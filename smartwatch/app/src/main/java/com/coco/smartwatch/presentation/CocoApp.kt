package com.coco.smartwatch.presentation

import androidx.annotation.DrawableRes
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
            Section.HOME -> Home(types) { selectedType = it; section = Section.REGISTER }
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

/** Navegación inferior: una sola fila de 6 iconos de 34 dp (cabe en la curva de la pantalla). El activo es amarillo. */
@Composable private fun SectionBar(current: Section, onSelect: (Section) -> Unit) {
    Row(horizontalArrangement = Arrangement.spacedBy(2.dp)) {
        Section.entries.forEach { item ->
            val active = item == current
            val shape = RoundedCornerShape(10.dp)
            Box(
                Modifier.size(34.dp).clip(shape).background(if (active) CocoColors.Yellow else Color.White.copy(alpha = 0.16f))
                    .border(1.5.dp, if (active) CocoColors.Ink else Color.White.copy(alpha = 0.45f), shape)
                    .clickable { onSelect(item) },
                contentAlignment = Alignment.Center,
            ) { Icon(painterResource(item.icon), contentDescription = item.title, tint = if (active) CocoColors.Ink else Color(0xFFFFF4E8), modifier = Modifier.size(20.dp)) }
        }
    }
}

@Composable private fun ScreenTitle(@DrawableRes icon: Int, color: Color, text: String) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
        IconTile(icon, color, 24.dp)
        Text(text, fontFamily = CocoFonts.Display, fontWeight = FontWeight.SemiBold, fontSize = 17.sp, color = Color.White)
    }
}

@Composable private fun Home(types: List<HabitType>, onRecord: (HabitType) -> Unit) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
        LogoTile(24.dp)
        Text("Hola, soy Coquito", fontFamily = CocoFonts.Display, fontWeight = FontWeight.SemiBold, fontSize = 17.sp, color = Color.White)
    }
    Spacer(Modifier.height(6.dp))
    Column(verticalArrangement = Arrangement.spacedBy(3.dp)) {
        types.forEach { type -> CocoRow(type.iconRes(), Color(type.colorHex), type.label) { onRecord(type) } }
    }
}

@Composable private fun StepButton(text: String, onClick: () -> Unit) {
    Box(Modifier.width(56.dp).height(48.dp).clip(ControlShape).border(1.5.dp, Color.White, ControlShape).clickable(onClick = onClick), contentAlignment = Alignment.Center) {
        Text(text, color = Color.White, fontFamily = CocoFonts.Display, fontSize = 20.sp)
    }
}

@Composable private fun Registration(type: HabitType, onType: (HabitType) -> Unit, onSave: (Double?, String?) -> Unit) {
    var value by remember(type) { mutableStateOf(if (type == HabitType.BEHAVIOR) "" else "1") }
    var note by remember(type) { mutableStateOf("") }
    ScreenTitle(type.iconRes(), Color(type.colorHex), type.label)
    Spacer(Modifier.height(8.dp))
    HabitPicker(type, onType)
    Spacer(Modifier.height(8.dp))
    if (type == HabitType.BEHAVIOR) {
        Box(Modifier.fillMaxWidth().heightIn(min = 48.dp).clip(ControlShape).background(Color.White).padding(horizontal = 12.dp, vertical = 8.dp), contentAlignment = Alignment.CenterStart) {
            if (note.isEmpty()) Text("¿Qué notaste?", color = CocoColors.Secondary, fontSize = 13.sp)
            BasicTextField(note, { note = it }, modifier = Modifier.fillMaxWidth(), textStyle = TextStyle(color = CocoColors.Text, fontSize = 14.sp, fontFamily = CocoFonts.Body))
        }
    } else {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            StepButton("−1") { value = max(0.0, (value.replace(',', '.').toDoubleOrNull() ?: 0.0) - 1).toInt().toString() }
            Row(Modifier.weight(1f).height(48.dp).clip(ControlShape).background(Color.White), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.Center) {
                BasicTextField(
                    value, { input -> if (input.matches(Regex("""^\d{0,5}([.,]\d{0,1})?$"""))) value = input }, singleLine = true,
                    modifier = Modifier.widthIn(max = 56.dp),
                    textStyle = TextStyle(color = CocoColors.Text, fontSize = 24.sp, fontFamily = CocoFonts.Display, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.End),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                )
                Spacer(Modifier.width(4.dp))
                Text(type.unit, color = CocoColors.Secondary, fontSize = 12.sp)
            }
            StepButton("+1") { value = ((value.replace(',', '.').toDoubleOrNull() ?: 0.0) + 1).toInt().toString() }
        }
    }
    Spacer(Modifier.height(8.dp))
    CocoButton("Guardar", onClick = { onSave(value.replace(',', '.').toDoubleOrNull(), note.takeIf { it.isNotBlank() }) }, enabled = type != HabitType.BEHAVIOR || note.isNotBlank())
}

@Composable private fun Trends(records: List<HabitRecord>, selected: HabitType, period: String, onSelect: (HabitType) -> Unit, onPeriod: (String) -> Unit) {
    ScreenTitle(R.drawable.ic_trending, CocoColors.Info, "Tendencias")
    Spacer(Modifier.height(6.dp))
    HabitPicker(selected, onSelect)
    Spacer(Modifier.height(6.dp))
    CocoCard {
        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
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

@Composable private fun Analysis(records: List<HabitRecord>) {
    val enough = records.size >= 7
    ScreenTitle(if (enough) R.drawable.ic_check else R.drawable.ic_info, if (enough) CocoColors.Normal else CocoColors.Info, "Análisis")
    Spacer(Modifier.height(6.dp))
    CocoCard {
        Text(if (enough) "Análisis listo. COCO compara tus registros con el patrón de Coquito." else "COCO todavía está conociendo el patrón de Coquito.", color = CocoColors.Text, fontWeight = FontWeight.Bold, fontSize = 13.sp, lineHeight = 17.sp)
        Spacer(Modifier.height(6.dp))
        if (enough) {
            Text("Factores observados: ${records.take(3).joinToString { it.type.label.lowercase() }}.", color = CocoColors.Secondary, fontSize = 12.sp)
        } else {
            val shown = min(records.size, 7)
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("Registros", color = CocoColors.Secondary, fontSize = 12.sp)
                Text("$shown de 7", color = CocoColors.Text, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(Modifier.height(3.dp))
            Box(Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(4.dp)).background(CocoColors.GreenLight).border(1.dp, CocoColors.Line, RoundedCornerShape(4.dp))) {
                Box(Modifier.fillMaxWidth(shown / 7f).fillMaxHeight().background(CocoColors.Yellow))
            }
            Spacer(Modifier.height(6.dp))
            Text("No hay suficiente información para realizar un análisis.", color = CocoColors.Secondary, fontSize = 12.sp, lineHeight = 16.sp)
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
            Row(Modifier.fillMaxWidth().height(34.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                IconTile(type.iconRes(), Color(type.colorHex), 24.dp)
                Column {
                    Text(type.label, color = CocoColors.Text, fontWeight = FontWeight.Bold, fontSize = 13.sp, lineHeight = 15.sp)
                    Text(latest?.value?.let { "${it.toInt()} ${type.unit}" } ?: "Sin registros", color = CocoColors.Secondary, fontSize = 12.sp, lineHeight = 14.sp)
                }
            }
        }
    }
}

@Composable private fun Sync(pending: Int, syncState: SyncState, onSyncNow: () -> Unit) {
    val (statusText, statusColor, icon) = when (syncState) {
        is SyncState.Idle       -> Triple("Sin cambios pendientes", CocoColors.Normal, R.drawable.ic_check)
        is SyncState.Syncing    -> Triple("Sincronizando… (${syncState.count} registros)", CocoColors.Info, R.drawable.ic_refresh)
        is SyncState.Synced     -> Triple("Sincronizado (${syncState.count} registros)", CocoColors.Normal, R.drawable.ic_check)
        is SyncState.PartialSync-> Triple("Parcial: ${syncState.synced} enviados, ${syncState.remaining} pendientes", CocoColors.Attention, R.drawable.ic_alert)
        is SyncState.Offline    -> Triple("Sin conexión", CocoColors.Offline, R.drawable.ic_alert)
        is SyncState.Failed     -> Triple("No se pudo sincronizar", CocoColors.HighAttention, R.drawable.ic_alert)
    }
    ScreenTitle(R.drawable.ic_refresh, CocoColors.Normal, "Sincronización")
    Spacer(Modifier.height(6.dp))
    CocoCard {
        Text("Tus registros se guardan localmente en el reloj.", color = CocoColors.Secondary, fontSize = 12.sp, lineHeight = 16.sp)
        Spacer(Modifier.height(6.dp))
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            IconTile(icon, statusColor, 26.dp)
            Column {
                Text(statusText, color = statusColor, fontWeight = FontWeight.Bold, fontSize = 13.sp, lineHeight = 15.sp)
                Text("$pending pendientes de enviar", color = CocoColors.Secondary, fontSize = 12.sp, lineHeight = 14.sp)
            }
        }
    }
    Spacer(Modifier.height(6.dp))
    CocoButton(if (syncState is SyncState.Syncing) "Sincronizando…" else "Sincronizar ahora", onClick = onSyncNow, enabled = syncState !is SyncState.Syncing)
    Spacer(Modifier.height(5.dp))
    Text("COCO no diagnostica enfermedades.", color = Color.White, fontSize = 12.sp, textAlign = TextAlign.Center)
}
