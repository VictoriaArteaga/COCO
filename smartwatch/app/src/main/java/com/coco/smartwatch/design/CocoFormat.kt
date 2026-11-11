package com.coco.smartwatch.design

import com.coco.smartwatch.domain.model.HabitType
import kotlin.math.roundToInt

/** Sueño y juego se guardan en minutos; pasada la hora se muestran en horas y minutos. */
val HabitType.isDuration: Boolean get() = this == HabitType.SLEEP || this == HabitType.PLAY

/** 45 → "45 min", 60 → "1h", 90 → "1h 30 min", 135 → "2h 15 min". */
fun formatDuration(totalMinutes: Int): String {
    val minutes = totalMinutes.coerceAtLeast(0)
    if (minutes < 60) return "$minutes min"
    val hours = minutes / 60
    val rest = minutes % 60
    return if (rest == 0) "${hours}h" else "${hours}h $rest min"
}

/** Versión corta para etiquetas angostas (barras): 45 → "45", 60 → "1h", 90 → "1h30". */
fun formatDurationShort(totalMinutes: Int): String {
    val minutes = totalMinutes.coerceAtLeast(0)
    if (minutes < 60) return "$minutes"
    return if (minutes % 60 == 0) "${minutes / 60}h" else "${minutes / 60}h${minutes % 60}"
}

/** Valor de un registro con su unidad; las duraciones usan horas cuando pasan de 60 minutos. */
fun formatValue(type: HabitType, value: Double): String =
    if (type.isDuration) formatDuration(value.roundToInt()) else "${value.toInt()} ${type.displayUnit}"
