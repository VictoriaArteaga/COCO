package com.coco.smartwatch.domain.model

enum class HabitType(val label: String, val colorHex: Long, val unit: String) {
    FOOD("Alimentación", 0xFF5B8E69, "g"), WATER("Agua", 0xFF4387A8, "ml"),
    SLEEP("Sueño", 0xFF70659A, "min"), PLAY("Juego", 0xFFC4778C, "min"),
    BEHAVIOR("Comportamiento", 0xFFC87945, "nota");

    companion object { fun fromName(name: String) = entries.firstOrNull { it.name == name } ?: FOOD }
}
