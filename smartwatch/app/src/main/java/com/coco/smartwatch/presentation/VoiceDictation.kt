package com.coco.smartwatch.presentation

import android.annotation.SuppressLint
import android.content.Context
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.vosk.Model
import org.vosk.Recognizer
import java.io.File
import java.io.IOException
import kotlin.math.abs

enum class DictationState { IDLE, PREPARING, LISTENING, ERROR }

/** Fuente de audio PCM de 16 kHz, 16 bits, mono. Es el micrófono del reloj; en pruebas puede ser un archivo. */
interface PcmSource {
    fun start()
    /** Llena [buffer] y devuelve cuántas muestras leyó (negativo si falló). */
    fun read(buffer: ShortArray): Int
    fun stop()
}

private class MicSource : PcmSource {
    private var record: AudioRecord? = null

    @SuppressLint("MissingPermission")
    override fun start() {
        val min = AudioRecord.getMinBufferSize(SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT)
        val r = AudioRecord(MediaRecorder.AudioSource.VOICE_RECOGNITION, SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, maxOf(min, 4096) * 4)
        if (r.state != AudioRecord.STATE_INITIALIZED) { r.release(); throw IOException("No se pudo abrir el micrófono") }
        r.startRecording()
        record = r
    }
    override fun read(buffer: ShortArray): Int = record?.read(buffer, 0, buffer.size) ?: -1
    override fun stop() { record?.let { runCatching { it.stop() }; it.release() }; record = null }

    private companion object { const val SAMPLE_RATE = 16000 }
}

/**
 * Dictado 100 % offline con Vosk (modelo de español incluido en assets/model-es).
 * El audio nunca sale del reloj ni se guarda: solo se conserva el texto reconocido.
 *
 * Además mide el nivel de sonido que llega del micrófono: si pasan unos segundos sin oír nada
 * ([micSilent]) la pantalla avisa, en lugar de quedarse "escuchando" sin respuesta.
 */
class VoiceDictation(context: Context, private val scope: CoroutineScope, private val sourceFactory: () -> PcmSource = { MicSource() }) {
    private val appContext = context.applicationContext
    private var job: Job? = null
    private var session: Session? = null

    /** Cada dictado tiene su propia bandera de parada, para que uno viejo nunca afecte a uno nuevo. */
    private class Session { @Volatile var stop = false }

    var state by mutableStateOf(DictationState.IDLE); private set
    /** Lo que el usuario va diciendo, todavía sin confirmar. */
    var partial by mutableStateOf(""); private set
    /** Volumen actual de 0 a 1 (para el indicador). */
    var level by mutableFloatStateOf(0f); private set
    /** Verdadero si llevamos varios segundos escuchando y el micrófono solo entrega silencio. */
    var micSilent by mutableStateOf(false); private set

    /** [onFinalText] se llama con cada frase terminada. */
    fun start(onFinalText: (String) -> Unit) {
        if (state == DictationState.PREPARING || state == DictationState.LISTENING) return
        state = DictationState.PREPARING; partial = ""; level = 0f; micSilent = false
        val mine = Session().also { session = it }
        job = scope.launch {
            var source: PcmSource? = null
            var recognizer: Recognizer? = null
            try {
                val model = withContext(Dispatchers.IO) { loadModel(appContext) }
                withContext(Dispatchers.IO) {
                    source = sourceFactory().also { it.start() }
                    recognizer = Recognizer(model, SAMPLE_RATE)
                }
                state = DictationState.LISTENING
                withContext(Dispatchers.IO) { capture(mine, source!!, recognizer!!, onFinalText) }
                finish()
            } catch (_: kotlinx.coroutines.CancellationException) {
                // shutdown(): ya se limpió el estado
            } catch (_: Throwable) {
                partial = ""; state = DictationState.ERROR
            } finally {
                runCatching { source?.stop() }
                runCatching { recognizer?.close() }
            }
        }
    }

    /** Bucle de captura: lee audio, lo pasa al reconocedor y mide el volumen. */
    private suspend fun capture(mine: Session, source: PcmSource, recognizer: Recognizer, onFinalText: (String) -> Unit) {
        val buffer = ShortArray(2048)
        val startedAt = System.currentTimeMillis()
        var heardSound = false
        while (!mine.stop) {
            val n = source.read(buffer)
            if (n < 0) throw IOException("Fallo al leer el micrófono")
            if (n == 0) continue
            var peak = 0
            for (i in 0 until n) { val v = abs(buffer[i].toInt()); if (v > peak) peak = v }
            if (peak > SOUND_THRESHOLD) heardSound = true
            val silentNow = !heardSound && System.currentTimeMillis() - startedAt > SILENCE_AFTER_MS
            val finalText = if (recognizer.acceptWaveForm(buffer, n)) DictationText.extract(recognizer.result) else null
            val partialText = if (finalText == null) DictationText.extract(recognizer.partialResult) else ""
            withContext(Dispatchers.Main) {
                level = (peak / 8000f).coerceIn(0f, 1f)
                micSilent = silentNow
                if (!finalText.isNullOrEmpty()) { onFinalText(finalText); partial = "" } else partial = partialText
            }
        }
        val last = DictationText.extract(recognizer.finalResult)
        withContext(Dispatchers.Main) { if (last.isNotEmpty()) onFinalText(last); partial = "" }
    }

    /** Termina de escuchar; la última frase llega por onFinalText. */
    fun stop() { if (state == DictationState.LISTENING) session?.stop = true else finish() }

    fun dismissError() { if (state == DictationState.ERROR) state = DictationState.IDLE }

    fun shutdown() { session?.stop = true; session = null; job?.cancel(); job = null; state = DictationState.IDLE; partial = ""; level = 0f; micSilent = false }

    private fun finish() { state = DictationState.IDLE; partial = ""; level = 0f; micSilent = false }

    companion object {
        private const val SAMPLE_RATE = 16000f
        private const val ASSET_DIR = "model-es"
        private const val READY_MARKER = ".ready"
        /** Pico (de 32 767) por encima del cual consideramos que el micrófono capta sonido real. */
        private const val SOUND_THRESHOLD = 300
        private const val SILENCE_AFTER_MS = 5000L
        @Volatile private var model: Model? = null

        /** Copia el modelo de assets a almacenamiento interno la primera vez y lo carga una sola vez. */
        @Synchronized fun loadModel(context: Context): Model {
            model?.let { return it }
            val target = File(context.filesDir, ASSET_DIR)
            if (!File(target, READY_MARKER).exists()) {
                target.deleteRecursively()
                copyAsset(context, ASSET_DIR, target)
                File(target, READY_MARKER).writeText("ok")
            }
            return Model(target.absolutePath).also { model = it }
        }

        private fun copyAsset(context: Context, path: String, target: File) {
            val children = context.assets.list(path).orEmpty()
            if (children.isEmpty()) {
                target.parentFile?.mkdirs()
                context.assets.open(path).use { input -> target.outputStream().use { input.copyTo(it) } }
            } else {
                if (!target.mkdirs() && !target.isDirectory) throw IOException("No se pudo crear $target")
                children.forEach { copyAsset(context, "$path/$it", File(target, it)) }
            }
        }
    }
}
