package com.coco.smartwatch.domain.model

enum class HabitType(val label: String, val colorHex: Long, val unit: String) {
    FOOD("Alimentación", 0xFFC4600F, "g"), WATER("Agua", 0xFF1B7FB5, "ml"),
    SLEEP("Sueño", 0xFF4B55B5, "min"), PLAY("Juego", 0xFFD6334F, "min"),
    BEHAVIOR("Comportamiento", 0xFF2E7D50, "nota");

    companion object { fun fromName(name: String) = entries.firstOrNull { it.name == name } ?: FOOD }
}
