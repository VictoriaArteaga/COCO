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

private enum class Section(val title: String, @DrawableRes val icon: Int) {
    HOME("Inicio", R.drawable.ic_home), REGISTER("Registrar", R.drawable.ic_plus), TRENDS("Tendencias", R.drawable.ic_trending),
    ANALYSIS("Análisis", R.drawable.ic_search), SUMMARY("Resumen", R.drawable.ic_history), SYNC("Sincronización", R.drawable.ic_refresh)
}

@Composable fun CocoApp(viewModel: CocoViewModel, onLogout: () -> Unit = {}) {
    var section by remember { mutableStateOf(Section.HOME) }
    var selectedType by remember { mutableStateOf(HabitType.FOOD) }
    var trendPeriod by remember { mutableStateOf("7 días") }
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
            Section.TRENDS -> Trends(records, selectedType, trendPeriod, { selectedType = it }, { trendPeriod = it })
            Section.ANALYSIS -> Analysis(records)
            Section.SUMMARY -> Summary(records)
            Section.SYNC -> Sync(
                pending = records.count { it.syncStatus == SyncStatus.PENDING },
                syncState = syncState,
                onSyncNow = { viewModel.retrySync() }
            )
        }
        message?.let { msg ->
            Spacer(Modifier.height(6.dp))
            CocoCard {
                Text(msg, color = CocoColors.Normal, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                if (lastSavedId != null) {
                    Spacer(Modifier.height(4.dp))
                    OutlinedButton(onClick = { viewModel.undoLast(); haptic.performHapticFeedback(HapticFeedbackType.LongPress) }, shape = ControlShape, border = BorderStroke(1.5.dp, CocoColors.GreenDark), modifier = Modifier.fillMaxWidth().heightIn(min = 40.dp)) {
                        Text("Deshacer", color = CocoColors.GreenDark, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
        Spacer(Modifier.height(10.dp))
        SectionBar(section) { section = it }
        TextButton(onClick = onLogout, modifier = Modifier.heightIn(min = 40.dp)) {
            Icon(painterResource(R.drawable.ic_logout), contentDescription = null, tint = Color.White, modifier = Modifier.size(14.dp))
            Spacer(Modifier.width(6.dp))
            Text("Cerrar sesión", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
        }
    }
}

/** Navegación inferior: 2 filas de 3 iconos que se reparten el ancho disponible (siempre caben). El activo es amarillo. */
@Composable private fun SectionBar(current: Section, onSelect: (Section) -> Unit) {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Section.entries.chunked(3).forEach { rowItems ->
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                rowItems.forEach { item ->
                    val active = item == current
                    val shape = RoundedCornerShape(10.dp)
                    Box(
                        Modifier.weight(1f).height(38.dp).clip(shape).background(if (active) CocoColors.Yellow else Color.White.copy(alpha = 0.16f))
                            .border(1.5.dp, if (active) CocoColors.Ink else Color.White.copy(alpha = 0.45f), shape)
                            .clickable { onSelect(item) },
                        contentAlignment = Alignment.Center,
                    ) { Icon(painterResource(item.icon), contentDescription = item.title, tint = if (active) CocoColors.Ink else Color(0xFFFFF4E8), modifier = Modifier.size(20.dp)) }
                }
            }
        }
    }
}

@Composable private fun ScreenTitle(@DrawableRes icon: Int, color: Color, text: String) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp, Alignment.CenterHorizontally)) {
        IconTile(icon, color, 24.dp)
        Text(text, fontFamily = CocoFonts.Display, fontWeight = FontWeight.SemiBold, fontSize = 16.sp, lineHeight = 18.sp, color = Color.White, modifier = Modifier.weight(1f, fill = false))
    }
}

@Composable private fun Home(types: List<HabitType>, records: List<HabitRecord>, onRecord: (HabitType) -> Unit) {
    // Rutina de hoy: qué variables ya tienen un registro desde las 00:00
    val startOfDay = java.time.LocalDate.now().atStartOfDay(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli()
    val doneToday = records.filter { it.recordedAt >= startOfDay }.map { it.type }.toSet()
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp, Alignment.CenterHorizontally)) {
        LogoTile(24.dp)
        Text("Hola, soy Coquito", fontFamily = CocoFonts.Display, fontWeight = FontWeight.SemiBold, fontSize = 16.sp, lineHeight = 18.sp, color = Color.White, modifier = Modifier.weight(1f, fill = false))
    }
    Spacer(Modifier.height(4.dp))
    Text(
        if (doneToday.size == types.size) "¡Rutina completa por hoy!" else "Hoy: ${doneToday.size} de ${types.size} registradas",
        color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center,
    )
    Spacer(Modifier.height(4.dp))
    Box(Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(4.dp)).background(Color.White.copy(alpha = 0.2f)).border(1.dp, Color.White.copy(alpha = 0.45f), RoundedCornerShape(4.dp))) {
        Box(Modifier.fillMaxWidth(doneToday.size / types.size.toFloat()).fillMaxHeight().background(CocoColors.Yellow))
    }
    Spacer(Modifier.height(6.dp))
    Column(verticalArrangement = Arrangement.spacedBy(3.dp)) {
        types.forEach { type -> CocoRow(type.iconRes(), Color(type.colorHex), type.label, done = type in doneToday) { onRecord(type) } }
    }
}

@Composable private fun StepButton(text: String, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Box(modifier.height(48.dp).clip(ControlShape).border(1.5.dp, Color.White, ControlShape).clickable(onClick = onClick), contentAlignment = Alignment.Center) {
        Text(text, color = Color.White, fontFamily = CocoFonts.Display, fontSize = 20.sp)
    }
}

@Composable private fun Registration(type: HabitType, onType: (HabitType) -> Unit, onSave: (Double?, String?) -> Unit) {
    var value by remember(type) { mutableStateOf(if (type == HabitType.BEHAVIOR) "" else "1") }
    var note by remember(type) { mutableStateOf("") }
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val dictation = remember { VoiceDictation(context, scope) }
    var micDenied by remember { mutableStateOf(false) }
    val hasMic = remember { context.packageManager.hasSystemFeature(PackageManager.FEATURE_MICROPHONE) }
    val startDictation = { micDenied = false; dictation.start { note = DictationText.append(note, it) } }
    val micPermission = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted -> if (granted) startDictation() else micDenied = true }
    DisposableEffect(Unit) { onDispose { dictation.shutdown() } }
    LaunchedEffect(type) { if (type != HabitType.BEHAVIOR) dictation.shutdown() }
    val dictating = dictation.state == DictationState.PREPARING || dictation.state == DictationState.LISTENING
    ScreenTitle(type.iconRes(), Color(type.colorHex), type.label)
    Spacer(Modifier.height(8.dp))
    HabitPicker(type, onType)
    Spacer(Modifier.height(8.dp))
    if (type == HabitType.BEHAVIOR && hasMic) {
        val listening = dictation.state == DictationState.LISTENING
        val label = when (dictation.state) { DictationState.PREPARING -> "Preparando…"; DictationState.LISTENING -> "Toca para terminar"; else -> "Dictar nota" }
        Row(
            Modifier.fillMaxWidth().height(48.dp).clip(ControlShape).background(if (listening) CocoColors.Coral else Color.Transparent).border(1.5.dp, Color.White, ControlShape)
                .clickable(enabled = dictation.state != DictationState.PREPARING) {
                    when {
                        listening -> dictation.stop()
                        ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED -> startDictation()
                        else -> micPermission.launch(Manifest.permission.RECORD_AUDIO)
                    }
                },
            verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.Center,
        ) {
            Icon(painterResource(R.drawable.ic_mic), contentDescription = null, tint = Color.Unspecified, modifier = Modifier.size(22.dp))
            Spacer(Modifier.width(6.dp))
            Text(label, color = Color.White, fontFamily = CocoFonts.Display, fontSize = 14.sp)
        }
        val hint = when {
            micDenied -> "Sin permiso del micrófono. Puedes escribir la nota."
            dictation.state == DictationState.ERROR -> "No pudimos escuchar. Inténtalo otra vez o escribe."
            dictation.partial.isNotEmpty() -> dictation.partial
            else -> ""
        }
        if (hint.isNotEmpty()) Text(hint, color = Color.White, fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp))
        Spacer(Modifier.height(6.dp))
    }
    if (type == HabitType.BEHAVIOR) {
        Box(Modifier.fillMaxWidth().heightIn(min = 48.dp).clip(ControlShape).background(Color.White).padding(horizontal = 12.dp, vertical = 8.dp), contentAlignment = Alignment.CenterStart) {
            if (note.isEmpty()) Text("¿Qué notaste?", color = CocoColors.Secondary, fontSize = 13.sp)
            BasicTextField(note, { note = it }, modifier = Modifier.fillMaxWidth(), textStyle = TextStyle(color = CocoColors.Text, fontSize = 14.sp, fontFamily = CocoFonts.Body))
        }
    } else {
        Row(Modifier.fillMaxWidth().height(48.dp).clip(ControlShape).background(Color.White), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.Center) {
            BasicTextField(
                value, { input -> if (input.matches(Regex("""^\d{0,5}([.,]\d{0,1})?$"""))) value = input }, singleLine = true,
                modifier = Modifier.widthIn(max = 64.dp).width(IntrinsicSize.Min),
                textStyle = TextStyle(color = CocoColors.Text, fontSize = 24.sp, fontFamily = CocoFonts.Display, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.End),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
            )
            Spacer(Modifier.width(4.dp))
            Text(type.unit, color = CocoColors.Secondary, fontSize = 12.sp, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f, fill = false))
        }
        Spacer(Modifier.height(6.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            StepButton("−1", Modifier.weight(1f)) { value = max(0.0, (value.replace(',', '.').toDoubleOrNull() ?: 0.0) - 1).toInt().toString() }
            StepButton("+1", Modifier.weight(1f)) { value = ((value.replace(',', '.').toDoubleOrNull() ?: 0.0) + 1).toInt().toString() }
        }
    }
    Spacer(Modifier.height(8.dp))
    CocoButton("Guardar", onClick = { onSave(value.replace(',', '.').toDoubleOrNull(), note.takeIf { it.isNotBlank() }) }, enabled = !dictating && (type != HabitType.BEHAVIOR || note.isNotBlank()))
}

@Composable private fun Trends(records: List<HabitRecord>, selected: HabitType, period: String, onSelect: (HabitType) -> Unit, onPeriod: (String) -> Unit) {
    ScreenTitle(R.drawable.ic_trending, CocoColors.Info, "Tendencias")
    Spacer(Modifier.height(6.dp))
    HabitPicker(selected, onSelect)
    Spacer(Modifier.height(6.dp))
    CocoCard {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp, Alignment.CenterHorizontally)) {
            listOf("Hoy", "7 días").forEach { label ->
                FilterChip(
                    selected = period == label, onClick = { onPeriod(label) }, label = { Text(label, fontWeight = FontWeight.Bold, fontSize = 13.sp) }, shape = RoundedCornerShape(10.dp),
                    colors = FilterChipDefaults.filterChipColors(selectedContainerColor = CocoColors.Yellow, selectedLabelColor = CocoColors.Ink),
                )
            }
        }
        val periodStart = if (period == "Hoy") java.time.LocalDate.now().atStartOfDay(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli() else System.currentTimeMillis() - 7 * 24 * 60 * 60 * 1000L
        val values = records.filter { it.type == selected && it.value != null && it.recordedAt >= periodStart }.take(7).reversed().mapNotNull { it.value }
        Spacer(Modifier.height(6.dp))
        if (values.isEmpty()) { Text("Aún no hay registros de ${selected.label}.", color = CocoColors.Secondary, fontSize = 12.sp) }
        else {
            val maxValue = (values.maxOrNull() ?: 1.0).coerceAtLeast(1.0)
            // Las barras viven dentro de la tarjeta blanca: ninguna sobrepasa los 72 dp de alto.
            Row(Modifier.fillMaxWidth().height(72.dp), horizontalArrangement = Arrangement.spacedBy(4.dp), verticalAlignment = Alignment.Bottom) {
                values.forEach { item -> Column(Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Bottom) {
                    Text(item.toInt().toString(), fontSize = 10.sp, color = CocoColors.Text, fontWeight = FontWeight.Bold, maxLines = 1)
                    Spacer(Modifier.height(2.dp))
                    Box(Modifier.fillMaxWidth().height((46 * item / maxValue).coerceAtLeast(6.0).dp).clip(RoundedCornerShape(topStart = 5.dp, topEnd = 5.dp)).background(Color(selected.colorHex)))
                } }
            }
            Spacer(Modifier.height(4.dp))
            Text("Últimos ${values.size} registros · ${selected.unit}", color = CocoColors.Secondary, fontSize = 12.sp)
        }
    }
}

@Composable private fun ProgressRow(label: String, value: Int, goal: Int) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, color = CocoColors.Secondary, fontSize = 12.sp)
        Text("$value de $goal", color = CocoColors.Text, fontSize = 12.sp, fontWeight = FontWeight.Bold)
    }
    Spacer(Modifier.height(3.dp))
    Box(Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(4.dp)).background(CocoColors.GreenLight).border(1.dp, CocoColors.Line, RoundedCornerShape(4.dp))) {
        Box(Modifier.fillMaxWidth(value / goal.toFloat()).fillMaxHeight().background(CocoColors.Yellow))
    }
}

@Composable private fun Analysis(records: List<HabitRecord>) {
    // Mismo mínimo que la web: al menos 10 observaciones en 3 días distintos.
    val days = records.map { SimpleDateFormat("yyyyMMdd", Locale.getDefault()).format(Date(it.recordedAt)) }.toSet().size
    val enough = records.size >= 10 && days >= 3
    ScreenTitle(if (enough) R.drawable.ic_check else R.drawable.ic_info, if (enough) CocoColors.Normal else CocoColors.Info, "Análisis")
    Spacer(Modifier.height(6.dp))
    CocoCard {
        Text(
            if (enough) "Ya hay suficientes anotaciones para leer la rutina de Coquito." else "COCO todavía está conociendo la rutina de Coquito.",
            color = CocoColors.Text, fontWeight = FontWeight.Bold, fontSize = 13.sp, lineHeight = 17.sp,
        )
        Spacer(Modifier.height(6.dp))
        if (enough) {
            Text("Mira la lectura completa en la web, en la sección Análisis.", color = CocoColors.Secondary, fontSize = 12.sp, lineHeight = 16.sp)
        } else {
            ProgressRow("Observaciones", min(records.size, 10), 10)
            Spacer(Modifier.height(5.dp))
            ProgressRow("Días distintos", min(days, 3), 3)
            Spacer(Modifier.height(6.dp))
            Text("Aún no hay suficiente información para hacer un análisis.", color = CocoColors.Secondary, fontSize = 12.sp, lineHeight = 16.sp)
        }
    }
    Spacer(Modifier.height(6.dp))
    Row(
        Modifier.fillMaxWidth().clip(RoundedCornerShape(10.dp)).background(Color.White.copy(alpha = 0.14f)).border(1.dp, Color.White.copy(alpha = 0.4f), RoundedCornerShape(10.dp)).padding(horizontal = 8.dp, vertical = 5.dp),
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Icon(painterResource(R.drawable.ic_info), contentDescription = null, tint = Color.White, modifier = Modifier.size(14.dp).padding(top = 1.dp))
        Text("COCO ayuda a observar; no realiza diagnósticos.", fontSize = 12.sp, lineHeight = 16.sp, color = Color.White)
    }
}

@Composable private fun Summary(records: List<HabitRecord>) {
    val today = SimpleDateFormat("yyyyMMdd", Locale.getDefault()).format(Date())
    val todaysRecords = records.filter { SimpleDateFormat("yyyyMMdd", Locale.getDefault()).format(Date(it.recordedAt)) == today }
    ScreenTitle(R.drawable.ic_history, CocoColors.Green, "Resumen de hoy")
    Spacer(Modifier.height(6.dp))
    CocoCard {
        HabitType.entries.forEach { type ->
            val latest = todaysRecords.firstOrNull { it.type == type }
            Row(Modifier.fillMaxWidth().heightIn(min = 34.dp).padding(vertical = 2.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                IconTile(type.iconRes(), Color(type.colorHex), 24.dp)
                Column(Modifier.weight(1f)) {
                    Text(type.label, color = CocoColors.Text, fontWeight = FontWeight.Bold, fontSize = 13.sp, lineHeight = 15.sp)
                    Text(latest?.value?.let { "${it.toInt()} ${type.unit}" } ?: "Sin registros", color = CocoColors.Secondary, fontSize = 12.sp, lineHeight = 14.sp)
                }
            }
        }
    }
}

@Composable private fun Sync(pending: Int, syncState: SyncState, onSyncNow: () -> Unit) {
    val (statusText, statusColor, icon) = when (syncState) {
        is SyncState.Idle       -> Triple("Todo guardado", CocoColors.Normal, R.drawable.ic_check)
        is SyncState.Syncing    -> Triple("Enviando tus anotaciones…", CocoColors.Info, R.drawable.ic_refresh)
        is SyncState.Synced     -> Triple("Todo guardado", CocoColors.Normal, R.drawable.ic_check)
        is SyncState.PartialSync-> Triple("Se enviaron ${syncState.synced}; faltan ${syncState.remaining}", CocoColors.Attention, R.drawable.ic_alert)
        is SyncState.Offline    -> Triple("Sin internet por ahora", CocoColors.Offline, R.drawable.ic_alert)
        is SyncState.Failed     -> Triple("No pudimos enviar tus anotaciones", CocoColors.HighAttention, R.drawable.ic_alert)
    }
    ScreenTitle(R.drawable.ic_refresh, CocoColors.Normal, "Sincronización")
    Spacer(Modifier.height(6.dp))
    CocoCard {
        Text("Tus anotaciones se guardan en el reloj aunque no haya internet.", color = CocoColors.Secondary, fontSize = 12.sp, lineHeight = 16.sp)
        Spacer(Modifier.height(6.dp))
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            IconTile(icon, statusColor, 26.dp)
            Column(Modifier.weight(1f)) {
                Text(statusText, color = statusColor, fontWeight = FontWeight.Bold, fontSize = 13.sp, lineHeight = 15.sp)
                Text("$pending en espera de enviarse", color = CocoColors.Secondary, fontSize = 12.sp, lineHeight = 14.sp)
            }
        }
    }
    Spacer(Modifier.height(6.dp))
    CocoButton(if (syncState is SyncState.Syncing) "Enviando…" else "Enviar ahora", onClick = onSyncNow, enabled = syncState !is SyncState.Syncing)
    Spacer(Modifier.height(5.dp))
    Text("COCO no diagnostica enfermedades.", color = Color.White, fontSize = 12.sp, textAlign = TextAlign.Center)
}
