package com.coco.smartwatch.presentation

import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.DrawableRes
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.ContextCompat
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.coco.smartwatch.R
import com.coco.smartwatch.data.sync.SyncState
import com.coco.smartwatch.design.*
import com.coco.smartwatch.domain.model.HabitRecord
import com.coco.smartwatch.domain.model.HabitType
import com.coco.smartwatch.domain.model.SyncStatus
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlin.math.max
import kotlin.math.min

private enum class Section(@DrawableRes val icon: Int) {
    HOME(R.drawable.ic_home), REGISTER(R.drawable.ic_plus), TRENDS(R.drawable.ic_trending),
    ANALYSIS(R.drawable.ic_search), SUMMARY(R.drawable.ic_history), SYNC(R.drawable.ic_refresh), SETTINGS(R.drawable.ic_settings)
}

/** Nombre completo de cada sección (para accesibilidad y títulos). */
private val Section.title: String
    get() = when (this) {
        Section.HOME -> tr("Inicio", "Home"); Section.REGISTER -> tr("Registrar", "Log")
        Section.TRENDS -> tr("Tendencias", "Trends"); Section.ANALYSIS -> tr("Análisis", "Analysis")
        Section.SUMMARY -> tr("Resumen", "Summary"); Section.SYNC -> tr("Sincronización", "Sync")
        Section.SETTINGS -> tr("Ajustes", "Settings")
    }

/** Rótulo corto bajo cada botón de la barra. */
private val Section.label: String get() = if (this == Section.SYNC) tr("Sincronizar", "Sync") else title

/** Pantalla breve mientras el modo demo entra a la cuenta. */
@Composable fun CocoConnecting() {
    CocoScreen {
        Spacer(Modifier.height(40.dp))
        Text(tr("Conectando con Coquito…", "Connecting to Coquito…"), color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth())
    }
}

@Composable fun CocoApp(viewModel: CocoViewModel, showLogout: Boolean = true, onLogout: () -> Unit = {}) {
    var section by remember { mutableStateOf(Section.HOME) }
    var selectedType by remember { mutableStateOf(HabitType.FOOD) }
    var trendToday by remember { mutableStateOf(false) }
    val records by viewModel.records.collectAsStateWithLifecycle()
    val message by viewModel.message.collectAsStateWithLifecycle()
    val lastSavedId by viewModel.lastSavedId.collectAsStateWithLifecycle()
    val syncState by viewModel.syncState.collectAsStateWithLifecycle()
    val haptic = LocalHapticFeedback.current
    val types = HabitType.entries
    CocoScreen {
        when (section) {
            Section.HOME -> Home(types, records) { selectedType = it; section = Section.REGISTER }
            Section.REGISTER -> Registration(selectedType, onType = { selectedType = it }, onSave = { value, note -> viewModel.save(selectedType, value, note); haptic.performHapticFeedback(HapticFeedbackType.LongPress); section = Section.HOME })
            Section.TRENDS -> Trends(records, selectedType, trendToday, { selectedType = it }, { trendToday = it })
            Section.ANALYSIS -> Analysis(records)
            Section.SUMMARY -> Summary(records)
            Section.SYNC -> Sync(
                pending = records.count { it.syncStatus == SyncStatus.PENDING },
                syncState = syncState,
                onSyncNow = { viewModel.retrySync() }
            )
            Section.SETTINGS -> SettingsScreen()
        }
        message?.let { msg ->
            Spacer(Modifier.height(6.dp))
            CocoCard {
                Text(msg, color = CocoColors.Normal, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                if (lastSavedId != null) {
                    Spacer(Modifier.height(4.dp))
                    OutlinedButton(onClick = { viewModel.undoLast(); haptic.performHapticFeedback(HapticFeedbackType.LongPress) }, shape = ControlShape, border = BorderStroke(1.5.dp, CocoColors.GreenDark), modifier = Modifier.fillMaxWidth().heightIn(min = 40.dp)) {
                        Text(tr("Deshacer", "Undo"), color = CocoColors.GreenDark, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
        Spacer(Modifier.height(10.dp))
        SectionBar(section) { section = it }
        if (showLogout) TextButton(onClick = onLogout, modifier = Modifier.heightIn(min = 40.dp)) {
            Icon(painterResource(R.drawable.ic_logout), contentDescription = null, tint = Color.White, modifier = Modifier.size(14.dp))
            Spacer(Modifier.width(6.dp))
            Text(tr("Cerrar sesión", "Sign out"), color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
        }
    }
}

/** Navegación inferior: filas de 3 botones con icono y nombre que se reparten el ancho. El activo es amarillo. */
@Composable private fun SectionBar(current: Section, onSelect: (Section) -> Unit) {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Section.entries.chunked(3).forEach { rowItems ->
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                rowItems.forEach { item ->
                    val active = item == current
                    val shape = RoundedCornerShape(10.dp)
                    val tint = if (active) CocoColors.Ink else Color(0xFFFFF4E8)
                    Column(
                        Modifier.weight(1f).height(48.dp).clip(shape).background(if (active) CocoColors.Yellow else Color.White.copy(alpha = 0.16f))
                            .border(1.5.dp, if (active) CocoColors.Ink else Color.White.copy(alpha = 0.45f), shape)
                            .clickable { onSelect(item) }.padding(horizontal = 2.dp),
                        horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center,
                    ) {
                        Icon(painterResource(item.icon), contentDescription = item.title, tint = tint, modifier = Modifier.size(18.dp))
                        FitText(item.label, color = tint, fontSize = 10.sp, fontWeight = FontWeight.Bold, minSize = 8.sp, textAlign = TextAlign.Center)
                    }
                }
            }
        }
    }
}

@Composable private fun ScreenTitle(@DrawableRes icon: Int, color: Color, text: String) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp, Alignment.CenterHorizontally)) {
        IconTile(icon, color, 24.dp)
        FitText(text, Modifier.weight(1f, fill = false), color = Color.White, fontSize = 16.sp, fontFamily = CocoFonts.Display, fontWeight = FontWeight.SemiBold)
    }
}

@Composable private fun Home(types: List<HabitType>, records: List<HabitRecord>, onRecord: (HabitType) -> Unit) {
    // Rutina de hoy: qué variables ya tienen un registro desde las 00:00
    val startOfDay = java.time.LocalDate.now().atStartOfDay(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli()
    val doneToday = records.filter { it.recordedAt >= startOfDay }.map { it.type }.toSet()
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp, Alignment.CenterHorizontally)) {
        LogoTile(24.dp)
        Text(tr("Hola, soy Coquito", "Hi, I'm Coquito"), fontFamily = CocoFonts.Display, fontWeight = FontWeight.SemiBold, fontSize = 16.sp, lineHeight = 18.sp, color = Color.White, modifier = Modifier.weight(1f, fill = false))
    }
    Spacer(Modifier.height(4.dp))
    Text(
        if (doneToday.size == types.size) tr("¡Rutina completa por hoy!", "Routine complete for today!")
        else tr("Hoy: ${doneToday.size} de ${types.size} registradas", "Today: ${doneToday.size} of ${types.size} logged"),
        color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center,
    )
    Spacer(Modifier.height(4.dp))
    Box(Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(4.dp)).background(Color.White.copy(alpha = 0.2f)).border(1.dp, Color.White.copy(alpha = 0.45f), RoundedCornerShape(4.dp))) {
        Box(Modifier.fillMaxWidth(doneToday.size / types.size.toFloat()).fillMaxHeight().background(CocoColors.Yellow))
    }
    Spacer(Modifier.height(6.dp))
    Column(verticalArrangement = Arrangement.spacedBy(3.dp)) {
        types.forEach { type -> CocoRow(type.iconRes(), Color(type.colorHex), type.displayName, done = type in doneToday) { onRecord(type) } }
    }
}

@Composable private fun StepButton(text: String, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Box(modifier.height(48.dp).clip(ControlShape).border(1.5.dp, Color.White, ControlShape).clickable(onClick = onClick), contentAlignment = Alignment.Center) {
        Text(text, color = Color.White, fontFamily = CocoFonts.Display, fontSize = 20.sp)
    }
}

private enum class RegTarget { NOTE, VALUE }

@Composable private fun Registration(type: HabitType, onType: (HabitType) -> Unit, onSave: (Double?, String?) -> Unit) {
    var value by remember(type) { mutableStateOf(if (type == HabitType.BEHAVIOR) "" else "1") }
    var note by remember(type) { mutableStateOf("") }
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val dictation = remember { VoiceDictation(context, scope) }
    var micDenied by remember { mutableStateOf(false) }
    var numberHint by remember { mutableStateOf("") }
    var target by remember { mutableStateOf(RegTarget.NOTE) }
    val hasMic = remember { context.packageManager.hasSystemFeature(PackageManager.FEATURE_MICROPHONE) }
    val startDictation = { field: RegTarget ->
        micDenied = false; numberHint = ""; target = field
        dictation.shutdown()
        if (field == RegTarget.NOTE) dictation.start { note = DictationText.append(note, it) }
        else dictation.start { spoken -> DictationText.toNumber(spoken)?.let { value = it } ?: run { numberHint = tr("No entendí «$spoken». Di un número, por ejemplo: doce.", "I didn't understand «$spoken». Say a number in Spanish, e.g. «doce».") } }
    }
    val micPermission = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted -> if (granted) startDictation(target) else micDenied = true }
    DisposableEffect(Unit) { onDispose { dictation.shutdown() } }
    LaunchedEffect(type) { dictation.shutdown(); numberHint = "" }
    val listening = dictation.state == DictationState.LISTENING
    val dictating = listening || dictation.state == DictationState.PREPARING
    val onMic = { field: RegTarget ->
        when {
            listening && target == field -> dictation.stop()
            ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED -> startDictation(field)
            else -> { target = field; micPermission.launch(Manifest.permission.RECORD_AUDIO) }
        }
    }
    ScreenTitle(type.iconRes(), Color(type.colorHex), type.displayName)
    Spacer(Modifier.height(8.dp))
    HabitPicker(type, onType)
    Spacer(Modifier.height(8.dp))
    val field = if (type == HabitType.BEHAVIOR) RegTarget.NOTE else RegTarget.VALUE
    if (type == HabitType.BEHAVIOR) {
        Row(Modifier.fillMaxWidth().heightIn(min = 48.dp).clip(ControlShape).background(CocoColors.Surface).padding(start = 12.dp, end = 4.dp, top = 4.dp, bottom = 4.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.weight(1f).padding(vertical = 4.dp), contentAlignment = Alignment.CenterStart) {
                if (note.isEmpty()) Text(tr("¿Qué notaste?", "What did you notice?"), color = CocoColors.Secondary, fontSize = 13.sp)
                BasicTextField(note, { note = it }, modifier = Modifier.fillMaxWidth(), textStyle = TextStyle(color = CocoColors.Text, fontSize = 14.sp, fontFamily = CocoFonts.Body))
            }
            if (hasMic) MicIconButton(listening && target == field, tr("nota", "note"), dictation.state != DictationState.PREPARING) { onMic(field) }
        }
    } else {
        Row(Modifier.fillMaxWidth().height(48.dp).clip(ControlShape).background(CocoColors.Surface).padding(start = 12.dp, end = 4.dp), verticalAlignment = Alignment.CenterVertically) {
            BasicTextField(
                value, { input -> if (input.matches(Regex("""^\d{0,5}([.,]\d{0,1})?$"""))) value = input }, singleLine = true,
                modifier = Modifier.width(60.dp),
                textStyle = TextStyle(color = CocoColors.Text, fontSize = 24.sp, fontFamily = CocoFonts.Display, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.End),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
            )
            Spacer(Modifier.width(4.dp))
            Text(type.displayUnit, color = CocoColors.Secondary, fontSize = 12.sp, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f))
            if (hasMic) MicIconButton(listening && target == field, tr("cantidad", "amount"), dictation.state != DictationState.PREPARING) { onMic(field) }
        }
    }
    // Ayuda bajo el campo (qué decir, lo que se va entendiendo o por qué no funcionó).
    val hint = when {
        micDenied -> tr("Sin permiso del micrófono. Puedes escribirlo.", "No microphone permission. You can type it.")
        dictation.state == DictationState.ERROR -> tr("No pudimos escuchar. Revisa el micrófono, inténtalo otra vez o escribe.", "We couldn't hear you. Check the microphone, try again or type.")
        dictation.state == DictationState.PREPARING -> tr("Preparando…", "Getting ready…")
        listening && dictation.micSilent -> tr("No se escucha nada. Revisa que el micrófono esté activo.", "I can't hear anything. Check that the microphone is on.")
        listening && dictation.partial.isNotEmpty() -> dictation.partial
        listening && target == RegTarget.VALUE -> tr("Escuchando… di un número, por ejemplo: doce", "Listening… say a number in Spanish, e.g. «doce»")
        listening -> tr("Escuchando… toca el micrófono para terminar", "Listening… tap the microphone to finish")
        numberHint.isNotEmpty() -> numberHint
        type.isDuration && (value.replace(',', '.').toDoubleOrNull() ?: 0.0) >= 60 -> "= " + formatDuration((value.replace(',', '.').toDoubleOrNull() ?: 0.0).toInt())
        else -> ""
    }
    if (hint.isNotEmpty()) Text(hint, color = Color.White, fontSize = 12.sp, lineHeight = 14.sp, textAlign = TextAlign.Center, modifier = Modifier.padding(top = 4.dp))
    if (listening) {
        // Indicador de volumen: sube cuando el micrófono capta sonido.
        Spacer(Modifier.height(4.dp))
        Box(Modifier.fillMaxWidth().height(6.dp).clip(RoundedCornerShape(3.dp)).background(Color.White.copy(alpha = 0.2f))) {
            Box(Modifier.fillMaxWidth(dictation.level.coerceAtLeast(0.02f)).fillMaxHeight().background(if (dictation.micSilent) CocoColors.Coral else CocoColors.Yellow))
        }
    }
    if (type != HabitType.BEHAVIOR) {
        Spacer(Modifier.height(6.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            StepButton("−1", Modifier.weight(1f)) { value = max(0.0, (value.replace(',', '.').toDoubleOrNull() ?: 0.0) - 1).toInt().toString() }
            StepButton("+1", Modifier.weight(1f)) { value = ((value.replace(',', '.').toDoubleOrNull() ?: 0.0) + 1).toInt().toString() }
        }
    }
    Spacer(Modifier.height(8.dp))
    CocoButton(tr("Guardar", "Save"), onClick = { onSave(value.replace(',', '.').toDoubleOrNull(), note.takeIf { it.isNotBlank() }) }, enabled = !dictating && (type != HabitType.BEHAVIOR || note.isNotBlank()))
}

@Composable private fun Trends(records: List<HabitRecord>, selected: HabitType, today: Boolean, onSelect: (HabitType) -> Unit, onToday: (Boolean) -> Unit) {
    ScreenTitle(R.drawable.ic_trending, CocoColors.Info, tr("Tendencias", "Trends"))
    Spacer(Modifier.height(6.dp))
    HabitPicker(selected, onSelect)
    Spacer(Modifier.height(6.dp))
    CocoCard {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            listOf(true to tr("Hoy", "Today"), false to tr("7 días", "7 days")).forEach { (isToday, label) ->
                val active = today == isToday
                Box(
                    Modifier.weight(1f).height(38.dp).clip(ControlShape)
                        .background(if (active) CocoColors.Yellow else Color.Transparent)
                        .border(1.5.dp, if (active) CocoColors.Ink else CocoColors.Line, ControlShape)
                        .clickable { onToday(isToday) },
                    contentAlignment = Alignment.Center,
                ) {
                    FitText(label, color = if (active) CocoColors.Ink else CocoColors.Text, fontSize = 13.sp, fontWeight = FontWeight.Bold, minSize = 10.sp, textAlign = TextAlign.Center)
                }
            }
        }
        val periodStart = if (today) java.time.LocalDate.now().atStartOfDay(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli() else System.currentTimeMillis() - 7 * 24 * 60 * 60 * 1000L
        val values = records.filter { it.type == selected && it.value != null && it.recordedAt >= periodStart }.take(7).reversed().mapNotNull { it.value }
        Spacer(Modifier.height(6.dp))
        if (values.isEmpty()) { Text(tr("Aún no hay registros de ${selected.displayName}.", "No ${selected.displayName.lowercase()} records yet."), color = CocoColors.Secondary, fontSize = 12.sp) }
        else {
            val maxValue = (values.maxOrNull() ?: 1.0).coerceAtLeast(1.0)
            // Las barras viven dentro de la tarjeta: ninguna sobrepasa los 72 dp de alto.
            Row(Modifier.fillMaxWidth().height(72.dp), horizontalArrangement = Arrangement.spacedBy(4.dp), verticalAlignment = Alignment.Bottom) {
                values.forEach { item -> Column(Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Bottom) {
                    FitText(if (selected.isDuration) formatDurationShort(item.toInt()) else item.toInt().toString(), color = CocoColors.Text, fontSize = 10.sp, fontWeight = FontWeight.Bold, minSize = 7.sp, textAlign = TextAlign.Center)
                    Spacer(Modifier.height(2.dp))
                    Box(Modifier.fillMaxWidth().height((46 * item / maxValue).coerceAtLeast(6.0).dp).clip(RoundedCornerShape(topStart = 5.dp, topEnd = 5.dp)).background(Color(selected.colorHex)))
                } }
            }
            Spacer(Modifier.height(4.dp))
            Text(tr("Últimos ${values.size} registros · ${selected.displayUnit}", "Last ${values.size} records · ${selected.displayUnit}"), color = CocoColors.Secondary, fontSize = 12.sp)
        }
    }
}

@Composable private fun ProgressRow(label: String, value: Int, goal: Int) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, color = CocoColors.Secondary, fontSize = 12.sp)
        Text(tr("$value de $goal", "$value of $goal"), color = CocoColors.Text, fontSize = 12.sp, fontWeight = FontWeight.Bold)
    }
    Spacer(Modifier.height(3.dp))
    Box(Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(4.dp)).background(CocoColors.GreenLight).border(1.dp, CocoColors.Line, RoundedCornerShape(4.dp))) {
        Box(Modifier.fillMaxWidth(value / goal.toFloat()).fillMaxHeight().background(CocoColors.Yellow))
    }
}

/** Gráficas de la semana (igual que la web): registros por variable y registros por día de los últimos 7 días. */
@Composable private fun AnalysisCharts(records: List<HabitRecord>) {
    val zone = java.time.ZoneId.systemDefault()
    val today = java.time.LocalDate.now(zone)
    val days = (6 downTo 0).map { today.minusDays(it.toLong()) }
    val week = records.filter { r -> java.time.Instant.ofEpochMilli(r.recordedAt).atZone(zone).toLocalDate() in days.first()..today }
    val perDay = days.map { d -> week.count { java.time.Instant.ofEpochMilli(it.recordedAt).atZone(zone).toLocalDate() == d } }
    val perType = HabitType.entries.map { t -> t to week.count { it.type == t } }
    val maxType = (perType.maxOfOrNull { it.second } ?: 1).coerceAtLeast(1)
    val maxDay = (perDay.maxOrNull() ?: 1).coerceAtLeast(1)

    CocoCard {
        Text(tr("Registros por variable", "Records by variable"), color = CocoColors.Text, fontWeight = FontWeight.Bold, fontSize = 13.sp)
        Text(tr("Últimos 7 días", "Last 7 days"), color = CocoColors.Secondary, fontSize = 11.sp)
        Spacer(Modifier.height(6.dp))
        perType.forEach { (type, count) ->
            Row(Modifier.fillMaxWidth().padding(vertical = 2.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(5.dp)) {
                IconTile(type.iconRes(), Color(type.colorHex), 18.dp)
                Column(Modifier.weight(1f)) {
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        FitText(type.shortLabel(), Modifier.weight(1f, fill = false), color = CocoColors.Text, fontSize = 11.sp, fontWeight = FontWeight.Bold, minSize = 8.sp)
                        Text(if (count == 0) "—" else count.toString(), color = CocoColors.Secondary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                    Box(Modifier.fillMaxWidth().height(6.dp).clip(RoundedCornerShape(3.dp)).background(CocoColors.GreenLight)) {
                        Box(Modifier.fillMaxWidth(count / maxType.toFloat()).fillMaxHeight().clip(RoundedCornerShape(3.dp)).background(Color(type.colorHex)))
                    }
                }
            }
        }
    }
    Spacer(Modifier.height(6.dp))
    CocoCard {
        Text(tr("Registros por día", "Records by day"), color = CocoColors.Text, fontWeight = FontWeight.Bold, fontSize = 13.sp)
        Text(tr("Cuántas anotaciones hubo cada día", "How many notes there were each day"), color = CocoColors.Secondary, fontSize = 11.sp, lineHeight = 14.sp)
        Spacer(Modifier.height(6.dp))
        Row(Modifier.fillMaxWidth().height(80.dp), horizontalArrangement = Arrangement.spacedBy(3.dp), verticalAlignment = Alignment.Bottom) {
            perDay.forEachIndexed { i, count ->
                Column(Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Bottom) {
                    Text(count.toString(), fontSize = 10.sp, color = CocoColors.Text, fontWeight = FontWeight.Bold, maxLines = 1)
                    Box(Modifier.fillMaxWidth().height((50 * count / maxDay.toFloat()).coerceAtLeast(4f).dp).clip(RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp)).background(if (i == 6) CocoColors.Yellow else Color(0xFFC9A887)))
                }
            }
        }
        Spacer(Modifier.height(3.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(3.dp)) {
            days.forEachIndexed { i, day ->
                val name = if (i == 6) tr("hoy", "today")
                else day.dayOfWeek.getDisplayName(java.time.format.TextStyle.SHORT, Locale(CocoSettings.language.code)).replace(".", "").take(3).lowercase()
                Box(Modifier.weight(1f), contentAlignment = Alignment.Center) {
                    FitText(name, color = CocoColors.Secondary, fontSize = 9.sp, minSize = 7.sp, textAlign = TextAlign.Center)
                }
            }
        }
    }
}

@Composable private fun Analysis(records: List<HabitRecord>) {
    // Mismo mínimo que la web: al menos 10 observaciones en 3 días distintos.
    val days = records.map { SimpleDateFormat("yyyyMMdd", Locale.getDefault()).format(Date(it.recordedAt)) }.toSet().size
    val enough = records.size >= 10 && days >= 3
    ScreenTitle(if (enough) R.drawable.ic_check else R.drawable.ic_info, if (enough) CocoColors.Normal else CocoColors.Info, tr("Análisis", "Analysis"))
    Spacer(Modifier.height(6.dp))
    CocoCard {
        Text(
            if (enough) tr("Ya hay suficientes anotaciones para leer la rutina de Coquito.", "There are enough notes to read Coquito's routine.")
            else tr("COCO todavía está conociendo la rutina de Coquito.", "COCO is still getting to know Coquito's routine."),
            color = CocoColors.Text, fontWeight = FontWeight.Bold, fontSize = 13.sp, lineHeight = 17.sp,
        )
        Spacer(Modifier.height(6.dp))
        if (enough) {
            Text(tr("Mira la lectura completa en la web, en la sección Análisis.", "See the full reading on the web, in the Analysis section."), color = CocoColors.Secondary, fontSize = 12.sp, lineHeight = 16.sp)
        } else {
            ProgressRow(tr("Observaciones", "Observations"), min(records.size, 10), 10)
            Spacer(Modifier.height(5.dp))
            ProgressRow(tr("Días distintos", "Different days"), min(days, 3), 3)
            Spacer(Modifier.height(6.dp))
            Text(tr("Aún no hay suficiente información para hacer un análisis.", "There isn't enough information for an analysis yet."), color = CocoColors.Secondary, fontSize = 12.sp, lineHeight = 16.sp)
        }
    }
    Spacer(Modifier.height(6.dp))
    AnalysisCharts(records)
    Spacer(Modifier.height(6.dp))
    Row(
        Modifier.fillMaxWidth().clip(RoundedCornerShape(10.dp)).background(Color.White.copy(alpha = 0.14f)).border(1.dp, Color.White.copy(alpha = 0.4f), RoundedCornerShape(10.dp)).padding(horizontal = 8.dp, vertical = 5.dp),
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Icon(painterResource(R.drawable.ic_info), contentDescription = null, tint = Color.White, modifier = Modifier.size(14.dp).padding(top = 1.dp))
        Text(tr("COCO ayuda a observar; no realiza diagnósticos.", "COCO helps you observe; it does not diagnose."), fontSize = 12.sp, lineHeight = 16.sp, color = Color.White)
    }
}

@Composable private fun Summary(records: List<HabitRecord>) {
    val today = SimpleDateFormat("yyyyMMdd", Locale.getDefault()).format(Date())
    val todaysRecords = records.filter { SimpleDateFormat("yyyyMMdd", Locale.getDefault()).format(Date(it.recordedAt)) == today }
    ScreenTitle(R.drawable.ic_history, CocoColors.Green, tr("Resumen de hoy", "Today's summary"))
    Spacer(Modifier.height(6.dp))
    CocoCard {
        HabitType.entries.forEach { type ->
            val latest = todaysRecords.firstOrNull { it.type == type }
            Row(Modifier.fillMaxWidth().heightIn(min = 34.dp).padding(vertical = 2.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                IconTile(type.iconRes(), Color(type.colorHex), 24.dp)
                Column(Modifier.weight(1f)) {
                    FitText(type.displayName, color = CocoColors.Text, fontSize = 13.sp, fontWeight = FontWeight.Bold, minSize = 9.sp)
                    Text(latest?.value?.let { formatValue(type, it) } ?: tr("Sin registros", "No records"), color = CocoColors.Secondary, fontSize = 12.sp, lineHeight = 14.sp)
                }
            }
        }
    }
}

@Composable private fun Sync(pending: Int, syncState: SyncState, onSyncNow: () -> Unit) {
    val (statusText, statusColor, icon) = when (syncState) {
        is SyncState.Idle       -> Triple(tr("Todo guardado", "All saved"), CocoColors.Normal, R.drawable.ic_check)
        is SyncState.Syncing    -> Triple(tr("Enviando tus anotaciones…", "Sending your notes…"), CocoColors.Info, R.drawable.ic_refresh)
        is SyncState.Synced     -> Triple(tr("Todo guardado", "All saved"), CocoColors.Normal, R.drawable.ic_check)
        is SyncState.PartialSync-> Triple(tr("Se enviaron ${syncState.synced}; faltan ${syncState.remaining}", "${syncState.synced} sent; ${syncState.remaining} left"), CocoColors.Attention, R.drawable.ic_alert)
        is SyncState.Offline    -> Triple(tr("Sin internet por ahora", "No internet for now"), CocoColors.Offline, R.drawable.ic_alert)
        is SyncState.Failed     -> Triple(tr("No pudimos enviar tus anotaciones", "We couldn't send your notes"), CocoColors.HighAttention, R.drawable.ic_alert)
    }
    ScreenTitle(R.drawable.ic_refresh, CocoColors.Normal, tr("Sincronización", "Sync"))
    Spacer(Modifier.height(6.dp))
    CocoCard {
        Text(tr("Tus anotaciones se guardan en el reloj aunque no haya internet.", "Your notes are saved on the watch even without internet."), color = CocoColors.Secondary, fontSize = 12.sp, lineHeight = 16.sp)
        Spacer(Modifier.height(6.dp))
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            IconTile(icon, statusColor, 26.dp)
            Column(Modifier.weight(1f)) {
                Text(statusText, color = statusColor, fontWeight = FontWeight.Bold, fontSize = 13.sp, lineHeight = 15.sp)
                Text(tr("$pending en espera de enviarse", "$pending waiting to be sent"), color = CocoColors.Secondary, fontSize = 12.sp, lineHeight = 14.sp)
            }
        }
    }
    Spacer(Modifier.height(6.dp))
    CocoButton(if (syncState is SyncState.Syncing) tr("Enviando…", "Sending…") else tr("Enviar ahora", "Send now"), onClick = onSyncNow, enabled = syncState !is SyncState.Syncing)
    Spacer(Modifier.height(5.dp))
    Text(tr("COCO no diagnostica enfermedades.", "COCO does not diagnose illnesses."), color = Color.White, fontSize = 12.sp, textAlign = TextAlign.Center)
}

/** Ajustes: idioma (español o inglés) y modo oscuro. Se guardan en el reloj. */
@Composable private fun SettingsScreen() {
    val context = LocalContext.current
    ScreenTitle(R.drawable.ic_settings, CocoColors.Info, tr("Ajustes", "Settings"))
    Spacer(Modifier.height(6.dp))
    CocoCard {
        Text(tr("Idioma", "Language"), color = CocoColors.Text, fontWeight = FontWeight.Bold, fontSize = 13.sp)
        Spacer(Modifier.height(6.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            AppLanguage.entries.forEach { language ->
                val active = CocoSettings.language == language
                Box(
                    Modifier.weight(1f).height(38.dp).clip(ControlShape)
                        .background(if (active) CocoColors.Yellow else Color.Transparent)
                        .border(1.5.dp, if (active) CocoColors.Ink else CocoColors.Line, ControlShape)
                        .clickable { CocoSettings.setLanguage(context, language) },
                    contentAlignment = Alignment.Center,
                ) {
                    FitText(language.displayName, color = if (active) CocoColors.Ink else CocoColors.Text, fontSize = 13.sp, fontWeight = FontWeight.Bold, minSize = 10.sp, textAlign = TextAlign.Center)
                }
            }
        }
    }
    Spacer(Modifier.height(6.dp))
    CocoCard {
        Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Column(Modifier.weight(1f)) {
                Text(tr("Modo oscuro", "Dark mode"), color = CocoColors.Text, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                Text(if (CocoSettings.dark) tr("Activado", "On") else tr("Apagado", "Off"), color = CocoColors.Secondary, fontSize = 12.sp)
            }
            Switch(
                checked = CocoSettings.dark, onCheckedChange = { CocoSettings.setDark(context, it) },
                colors = SwitchDefaults.colors(checkedThumbColor = CocoColors.Ink, checkedTrackColor = CocoColors.Yellow, checkedBorderColor = CocoColors.Ink),
            )
        }
    }
    Spacer(Modifier.height(6.dp))
    Text(
        tr("El dictado por voz sigue en español.", "Voice dictation stays in Spanish."),
        color = Color.White, fontSize = 12.sp, lineHeight = 14.sp, textAlign = TextAlign.Center,
    )
}
