package com.coco.smartwatch.presentation

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.coco.smartwatch.data.sync.SyncState
import com.coco.smartwatch.design.CocoColors
import com.coco.smartwatch.domain.model.HabitRecord
import com.coco.smartwatch.domain.model.HabitType
import com.coco.smartwatch.domain.model.SyncStatus
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlin.math.max

private enum class Section(val title: String) { HOME("Inicio"), REGISTER("Registrar"), TRENDS("Tendencias"), ANALYSIS("Análisis"), SUMMARY("Resumen"), SYNC("Sincronización") }

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
    Surface(Modifier.fillMaxSize(), color = CocoColors.Background) {
        Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 18.dp, vertical = 12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Text("COCO  🐇", style = MaterialTheme.typography.titleLarge, color = CocoColors.GreenDark, fontWeight = FontWeight.Bold)
            Text("Observa. Registra. Cuida.", style = MaterialTheme.typography.labelMedium, color = CocoColors.Secondary)
            TextButton(onClick = onLogout) { Text("Cerrar sesión", color = CocoColors.Secondary) }
            Spacer(Modifier.height(12.dp))
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
                Spacer(Modifier.height(8.dp)); Text(msg, color = CocoColors.Normal, style = MaterialTheme.typography.bodySmall)
                if (lastSavedId != null) TextButton(onClick = { viewModel.undoLast(); haptic.performHapticFeedback(HapticFeedbackType.LongPress) }) { Text("Deshacer") }
            }
            Spacer(Modifier.height(8.dp)); HorizontalDivider(color = CocoColors.GreenLight)
            Section.entries.forEach { item -> TextButton(onClick = { section = item }) { Text(item.title, color = if (section == item) CocoColors.GreenDark else CocoColors.Secondary) } }
        }
    }
}

@Composable private fun Home(count: Int, types: List<HabitType>, onRecord: (HabitType) -> Unit) {
    Text("Hola, soy Coquito", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
    Text("¿Qué quieres registrar?", color = CocoColors.Secondary)
    types.forEach { type -> Button(onClick = { onRecord(type) }, modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp)) { Text(type.label) } }
    Text("$count registros guardados", style = MaterialTheme.typography.labelSmall, color = CocoColors.Secondary)
}

@Composable private fun Registration(type: HabitType, onType: (HabitType) -> Unit, onSave: (Double?, String?) -> Unit) {
    var value by remember(type) { mutableStateOf(if (type == HabitType.BEHAVIOR) "" else "1") }
    var note by remember(type) { mutableStateOf("") }
    Text(type.label, style = MaterialTheme.typography.titleMedium, color = androidx.compose.ui.graphics.Color(type.colorHex), fontWeight = FontWeight.Bold)
    HabitType.entries.forEach { item -> FilterChip(selected = type == item, onClick = { onType(item) }, label = { Text(item.label) }) }
    if (type == HabitType.BEHAVIOR) OutlinedTextField(value = note, onValueChange = { note = it }, label = { Text("¿Qué notaste?") }, modifier = Modifier.fillMaxWidth(), minLines = 2)
    else {
        OutlinedTextField(value = value, onValueChange = { input -> if (input.matches(Regex("""^\d{0,5}([.,]\d{0,1})?$"""))) value = input }, label = { Text("Cantidad (${type.unit})") }, modifier = Modifier.fillMaxWidth())
        Row { listOf(-1.0, 1.0).forEach { delta -> TextButton(onClick = { value = (max(0.0, (value.replace(',', '.').toDoubleOrNull() ?: 0.0) + delta)).toInt().toString() }) { Text(if (delta > 0) "+1" else "−1") } } }
    }
    Button(onClick = { onSave(value.replace(',', '.').toDoubleOrNull(), note.takeIf { it.isNotBlank() }) }, modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp), enabled = type != HabitType.BEHAVIOR || note.isNotBlank()) { Text("Guardar") }
}

@Composable private fun Trends(records: List<HabitRecord>, selected: HabitType, period: String, onSelect: (HabitType) -> Unit, onPeriod: (String) -> Unit) {
    Text("Tendencias", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
    HabitType.entries.forEach { FilterChip(selected = selected == it, onClick = { onSelect(it) }, label = { Text(it.label) }) }
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        listOf("Hoy", "7 días").forEach { FilterChip(selected = period == it, onClick = { onPeriod(it) }, label = { Text(it) }) }
    }
    val periodStart = if (period == "Hoy") java.time.LocalDate.now().atStartOfDay(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli() else System.currentTimeMillis() - 7 * 24 * 60 * 60 * 1000L
    val values = records.filter { it.type == selected && it.value != null && it.recordedAt >= periodStart }.take(7).reversed().mapNotNull { it.value }
    if (values.isEmpty()) { Text("Aún no hay registros de ${selected.label}.", color = CocoColors.Secondary) }
    else {
        val maxValue = (values.maxOrNull() ?: 1.0).coerceAtLeast(1.0)
        Row(Modifier.fillMaxWidth().height(104.dp), horizontalArrangement = Arrangement.spacedBy(4.dp), verticalAlignment = Alignment.Bottom) {
            values.forEach { item -> Column(Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Bottom) {
                Text(item.toInt().toString(), style = MaterialTheme.typography.labelSmall)
                Spacer(Modifier.height(4.dp)); Surface(Modifier.fillMaxWidth().height((76 * item / maxValue).coerceAtLeast(8.0).dp), color = androidx.compose.ui.graphics.Color(selected.colorHex), shape = MaterialTheme.shapes.small) {}
            } }
        }
        Text("Últimos ${values.size} registros · ${selected.unit}", color = CocoColors.Secondary, style = MaterialTheme.typography.labelSmall)
    }
}

@Composable private fun Analysis(records: List<HabitRecord>) {
    val enough = records.size >= 7
    Text("Análisis", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
    Text(if (enough) "Análisis listo. COCO compara tus registros con el patrón de Coquito." else "COCO todavía está conociendo el patrón de Coquito.", color = CocoColors.Text)
    Text(if (enough) "Factores observados: ${records.take(3).joinToString { it.type.label.lowercase() }}." else "No hay suficiente información para realizar un análisis.", color = CocoColors.Secondary)
    Text("COCO ayuda a observar; no realiza diagnósticos.", style = MaterialTheme.typography.labelSmall, color = CocoColors.Secondary)
}

@Composable private fun Summary(records: List<HabitRecord>) {
    Text("Resumen de hoy", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
    val today = SimpleDateFormat("yyyyMMdd", Locale.getDefault()).format(Date())
    val todaysRecords = records.filter { SimpleDateFormat("yyyyMMdd", Locale.getDefault()).format(Date(it.recordedAt)) == today }
    HabitType.entries.forEach { type -> val latest = todaysRecords.firstOrNull { it.type == type }; Text("${type.label}: ${latest?.value?.let { "${it.toInt()} ${type.unit}" } ?: "Sin registros"}", color = CocoColors.Text) }
}

@Composable private fun Sync(pending: Int, syncState: SyncState, onSyncNow: () -> Unit) {
    Text("Sincronización", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
    Text("Tus registros se guardan localmente en el reloj.", color = CocoColors.Text)
    Spacer(Modifier.height(8.dp))

    val (statusText, statusColor) = when (syncState) {
        is SyncState.Idle       -> "Sin cambios pendientes" to CocoColors.Normal
        is SyncState.Syncing    -> "Sincronizando… (${syncState.count} registros)" to CocoColors.Info
        is SyncState.Synced     -> "Sincronizado (${syncState.count} registros)" to CocoColors.Normal
        is SyncState.PartialSync-> "Parcial: ${syncState.synced} enviados, ${syncState.remaining} pendientes" to CocoColors.Attention
        is SyncState.Offline    -> "Sin conexión" to CocoColors.Offline
        is SyncState.Failed     -> "No se pudo sincronizar" to CocoColors.Offline
    }
    Text(statusText, color = statusColor, style = MaterialTheme.typography.bodySmall)
    Spacer(Modifier.height(4.dp))
    Text("$pending registros pendientes de enviar", color = CocoColors.Secondary, style = MaterialTheme.typography.labelSmall)
    Spacer(Modifier.height(12.dp))

    Button(
        onClick = onSyncNow,
        enabled = syncState !is SyncState.Syncing,
        modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp)
    ) {
        Text(if (syncState is SyncState.Syncing) "Sincronizando…" else "Sincronizar ahora")
    }
    Spacer(Modifier.height(4.dp))
    Text(
        "COCO no diagnostica enfermedades.",
        color = CocoColors.Secondary,
        style = MaterialTheme.typography.labelSmall
    )
}
