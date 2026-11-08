package com.coco.smartwatch.presentation

import androidx.annotation.DrawableRes
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
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
        // Marca: conejo + nombre, como la cabecera de la web
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            IconTile(R.drawable.ic_rabbit, CocoColors.GreenDark, 34.dp, borderColor = Color.White.copy(alpha = 0.6f))
            Column {
                Text("COCO", fontFamily = CocoFonts.Display, fontWeight = FontWeight.SemiBold, fontSize = 22.sp, color = Color.White)
                Text("Observa. Registra. Cuida.", fontSize = 10.sp, color = Color.White.copy(alpha = 0.85f))
            }
        }
        Spacer(Modifier.height(10.dp))
        when (section) {
            Section.HOME -> Home(records.size, types) { selectedType = it; section = Section.REGISTER }
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
            Spacer(Modifier.height(8.dp))
            CocoCard {
                Text(msg, color = CocoColors.Normal, style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Bold)
                if (lastSavedId != null) {
                    Spacer(Modifier.height(6.dp))
                    OutlinedButton(onClick = { viewModel.undoLast(); haptic.performHapticFeedback(HapticFeedbackType.LongPress) }, shape = ControlShape, border = BorderStroke(1.5.dp, CocoColors.GreenDark), modifier = Modifier.fillMaxWidth().heightIn(min = 44.dp)) {
                        Text("Deshacer", color = CocoColors.GreenDark, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
        Spacer(Modifier.height(12.dp))
        SectionBar(section) { section = it }
        TextButton(onClick = onLogout, modifier = Modifier.heightIn(min = 44.dp)) {
            Icon(painterResource(R.drawable.ic_logout), contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
            Spacer(Modifier.width(6.dp))
            Text("Cerrar sesión", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
        }
    }
}

/** Navegación inferior: 6 mosaicos en dos filas de tres. El activo es blanco; los demás, amarillos. */
@Composable private fun SectionBar(current: Section, onSelect: (Section) -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Section.entries.chunked(3).forEach { row ->
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                row.forEach { item ->
                    val active = item == current
                    Column(Modifier.width(52.dp).clickable { onSelect(item) }, horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(
                            Modifier.size(44.dp).clip(RoundedCornerShape(12.dp)).background(if (active) Color.White else CocoColors.Yellow)
                                .border(1.5.dp, CocoColors.Ink, RoundedCornerShape(12.dp)),
                            contentAlignment = Alignment.Center,
                        ) { Icon(painterResource(item.icon), contentDescription = item.title, tint = if (active) CocoColors.Green else CocoColors.Ink, modifier = Modifier.size(24.dp)) }
                        Text(item.title, fontSize = 9.sp, color = Color.White, fontWeight = if (active) FontWeight.Bold else FontWeight.Normal, textAlign = TextAlign.Center, maxLines = 1)
                    }
                }
            }
        }
    }
}

@Composable private fun Home(count: Int, types: List<HabitType>, onRecord: (HabitType) -> Unit) {
    CocoCard {
        Text("Hola, soy Coquito", style = MaterialTheme.typography.titleMedium, color = CocoColors.GreenDark)
        Text("¿Qué quieres registrar?", color = CocoColors.Secondary, fontSize = 13.sp)
    }
    Spacer(Modifier.height(8.dp))
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        types.forEach { type -> CocoRow(type.iconRes(), Color(type.colorHex), type.label) { onRecord(type) } }
    }
    Spacer(Modifier.height(8.dp))
    CocoChip("$count registros guardados")
}

@Composable private fun Registration(type: HabitType, onType: (HabitType) -> Unit, onSave: (Double?, String?) -> Unit) {
    var value by remember(type) { mutableStateOf(if (type == HabitType.BEHAVIOR) "" else "1") }
    var note by remember(type) { mutableStateOf("") }
    CocoCard {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            IconTile(type.iconRes(), Color(type.colorHex), 34.dp)
            Text(type.label, style = MaterialTheme.typography.titleMedium, color = Color(type.colorHex), fontWeight = FontWeight.Bold)
        }
        Spacer(Modifier.height(8.dp))
        HabitPicker(type, onType)
        Spacer(Modifier.height(8.dp))
        if (type == HabitType.BEHAVIOR) OutlinedTextField(value = note, onValueChange = { note = it }, label = { Text("¿Qué notaste?") }, modifier = Modifier.fillMaxWidth(), minLines = 2, shape = ControlShape)
        else {
            OutlinedTextField(value = value, onValueChange = { input -> if (input.matches(Regex("""^\d{0,5}([.,]\d{0,1})?$"""))) value = input }, label = { Text("Cantidad (${type.unit})") }, modifier = Modifier.fillMaxWidth(), shape = ControlShape, singleLine = true)
            Spacer(Modifier.height(6.dp))
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf(-1.0, 1.0).forEach { delta ->
                    OutlinedButton(
                        onClick = { value = (max(0.0, (value.replace(',', '.').toDoubleOrNull() ?: 0.0) + delta)).toInt().toString() },
                        modifier = Modifier.weight(1f).heightIn(min = 44.dp), shape = ControlShape, border = BorderStroke(1.5.dp, CocoColors.GreenDark),
                    ) { Text(if (delta > 0) "+1" else "−1", color = CocoColors.GreenDark, fontFamily = CocoFonts.Display, fontSize = 18.sp) }
                }
            }
        }
    }
    Spacer(Modifier.height(8.dp))
    CocoButton("Guardar", onClick = { onSave(value.replace(',', '.').toDoubleOrNull(), note.takeIf { it.isNotBlank() }) }, enabled = type != HabitType.BEHAVIOR || note.isNotBlank())
}

@Composable private fun Trends(records: List<HabitRecord>, selected: HabitType, period: String, onSelect: (HabitType) -> Unit, onPeriod: (String) -> Unit) {
    CocoCard {
        Text("Tendencias", style = MaterialTheme.typography.titleMedium, color = CocoColors.GreenDark)
        Spacer(Modifier.height(8.dp))
        HabitPicker(selected, onSelect)
        Spacer(Modifier.height(8.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf("Hoy", "7 días").forEach { label ->
                FilterChip(
                    selected = period == label, onClick = { onPeriod(label) }, label = { Text(label, fontWeight = FontWeight.Bold) }, shape = RoundedCornerShape(10.dp),
                    colors = FilterChipDefaults.filterChipColors(selectedContainerColor = CocoColors.Yellow, selectedLabelColor = CocoColors.Ink),
                )
            }
        }
        val periodStart = if (period == "Hoy") java.time.LocalDate.now().atStartOfDay(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli() else System.currentTimeMillis() - 7 * 24 * 60 * 60 * 1000L
        val values = records.filter { it.type == selected && it.value != null && it.recordedAt >= periodStart }.take(7).reversed().mapNotNull { it.value }
        Spacer(Modifier.height(8.dp))
        if (values.isEmpty()) { Text("Aún no hay registros de ${selected.label}.", color = CocoColors.Secondary, fontSize = 13.sp) }
        else {
            val maxValue = (values.maxOrNull() ?: 1.0).coerceAtLeast(1.0)
            Row(Modifier.fillMaxWidth().height(104.dp), horizontalArrangement = Arrangement.spacedBy(4.dp), verticalAlignment = Alignment.Bottom) {
                values.forEach { item -> Column(Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Bottom) {
                    Text(item.toInt().toString(), style = MaterialTheme.typography.labelSmall, color = CocoColors.Text, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(4.dp))
                    Box(Modifier.fillMaxWidth().height((76 * item / maxValue).coerceAtLeast(8.0).dp).clip(RoundedCornerShape(topStart = 6.dp, topEnd = 6.dp)).background(Color(selected.colorHex)))
                } }
            }
            Spacer(Modifier.height(4.dp))
            Text("Últimos ${values.size} registros · ${selected.unit}", color = CocoColors.Secondary, style = MaterialTheme.typography.labelSmall)
        }
    }
}

@Composable private fun Analysis(records: List<HabitRecord>) {
    val enough = records.size >= 7
    CocoCard {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            IconTile(if (enough) R.drawable.ic_check else R.drawable.ic_info, if (enough) CocoColors.Normal else CocoColors.Info, 34.dp)
            Text("Análisis", style = MaterialTheme.typography.titleMedium, color = CocoColors.GreenDark)
        }
        Spacer(Modifier.height(8.dp))
        Text(if (enough) "Análisis listo. COCO compara tus registros con el patrón de Coquito." else "COCO todavía está conociendo el patrón de Coquito.", color = CocoColors.Text, fontWeight = FontWeight.Bold, fontSize = 13.sp)
        Spacer(Modifier.height(4.dp))
        Text(if (enough) "Factores observados: ${records.take(3).joinToString { it.type.label.lowercase() }}." else "No hay suficiente información para realizar un análisis.", color = CocoColors.Secondary, fontSize = 13.sp)
    }
    Spacer(Modifier.height(6.dp))
    Text("COCO ayuda a observar; no realiza diagnósticos.", style = MaterialTheme.typography.labelSmall, color = Color.White, textAlign = TextAlign.Center)
}

@Composable private fun Summary(records: List<HabitRecord>) {
    val today = SimpleDateFormat("yyyyMMdd", Locale.getDefault()).format(Date())
    val todaysRecords = records.filter { SimpleDateFormat("yyyyMMdd", Locale.getDefault()).format(Date(it.recordedAt)) == today }
    CocoCard {
        Text("Resumen de hoy", style = MaterialTheme.typography.titleMedium, color = CocoColors.GreenDark)
        Spacer(Modifier.height(8.dp))
        HabitType.entries.forEach { type ->
            val latest = todaysRecords.firstOrNull { it.type == type }
            Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                IconTile(type.iconRes(), Color(type.colorHex), 30.dp)
                Column {
                    Text(type.label, color = CocoColors.Text, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    Text(latest?.value?.let { "${it.toInt()} ${type.unit}" } ?: "Sin registros", color = CocoColors.Secondary, fontSize = 12.sp)
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
    CocoCard {
        Text("Sincronización", style = MaterialTheme.typography.titleMedium, color = CocoColors.GreenDark)
        Spacer(Modifier.height(4.dp))
        Text("Tus registros se guardan localmente en el reloj.", color = CocoColors.Secondary, fontSize = 12.sp)
        Spacer(Modifier.height(8.dp))
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            IconTile(icon, statusColor, 32.dp)
            Text(statusText, color = statusColor, fontWeight = FontWeight.Bold, fontSize = 13.sp)
        }
        Spacer(Modifier.height(8.dp))
        CocoChip("$pending pendientes de enviar", background = CocoColors.GreenLight, content = CocoColors.GreenDark)
    }
    Spacer(Modifier.height(8.dp))
    CocoButton(if (syncState is SyncState.Syncing) "Sincronizando…" else "Sincronizar ahora", onClick = onSyncNow, enabled = syncState !is SyncState.Syncing)
    Spacer(Modifier.height(6.dp))
    Text("COCO no diagnostica enfermedades.", color = Color.White, style = MaterialTheme.typography.labelSmall, textAlign = TextAlign.Center)
}
