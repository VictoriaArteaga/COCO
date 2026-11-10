package com.coco.smartwatch.presentation

import android.content.Context
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.vosk.Model
import org.vosk.Recognizer
import org.vosk.android.RecognitionListener
import org.vosk.android.SpeechService
import java.io.File
import java.io.IOException

enum class DictationState { IDLE, PREPARING, LISTENING, ERROR }

/**
 * Dictado 100 % offline con Vosk (modelo de español incluido en assets/model-es).
 * El audio nunca sale del reloj ni se guarda: solo se conserva el texto reconocido.
 */
class VoiceDictation(context: Context, private val scope: CoroutineScope) {
    private val appContext = context.applicationContext
    private var service: SpeechService? = null
    private var job: Job? = null

    var state by mutableStateOf(DictationState.IDLE); private set
    /** Lo que el usuario va diciendo, todavía sin confirmar. */
    var partial by mutableStateOf(""); private set

    /** [onFinalText] se llama con cada frase terminada. */
    fun start(onFinalText: (String) -> Unit) {
        if (state == DictationState.PREPARING || state == DictationState.LISTENING) return
        state = DictationState.PREPARING; partial = ""
        job = scope.launch {
            try {
                val model = withContext(Dispatchers.IO) { loadModel(appContext) }
                val speech = SpeechService(Recognizer(model, SAMPLE_RATE), SAMPLE_RATE)
                service = speech
                speech.startListening(object : RecognitionListener {
                    override fun onPartialResult(hypothesis: String?) { partial = DictationText.extract(hypothesis) }
                    override fun onResult(hypothesis: String?) { deliver(DictationText.extract(hypothesis), onFinalText) }
                    override fun onFinalResult(hypothesis: String?) { deliver(DictationText.extract(hypothesis), onFinalText); finish() }
                    override fun onError(exception: Exception?) { release(); partial = ""; state = DictationState.ERROR }
                    override fun onTimeout() { stop() }
                })
                state = DictationState.LISTENING
            } catch (_: Throwable) { release(); state = DictationState.ERROR }
        }
    }

    /** Termina de escuchar; la última frase llega por onFinalText. */
    fun stop() { service?.stop() ?: finish() }

    fun dismissError() { if (state == DictationState.ERROR) state = DictationState.IDLE }

    fun shutdown() { job?.cancel(); release(); state = DictationState.IDLE; partial = "" }

    private fun deliver(text: String, onFinalText: (String) -> Unit) { if (text.isNotEmpty()) onFinalText(text); partial = "" }
    private fun finish() { release(); state = DictationState.IDLE; partial = "" }
    private fun release() { service?.shutdown(); service = null }

    private companion object {
        const val SAMPLE_RATE = 16000f
        const val ASSET_DIR = "model-es"
        const val READY_MARKER = ".ready"
        @Volatile var model: Model? = null

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
