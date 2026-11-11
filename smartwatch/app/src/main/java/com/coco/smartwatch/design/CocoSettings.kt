package com.coco.smartwatch.design

import android.content.Context
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import com.coco.smartwatch.domain.model.HabitType

enum class AppLanguage(val code: String, val displayName: String) { ES("es", "Español"), EN("en", "English") }

/**
 * Ajustes de la app (idioma y modo oscuro). Son estado observable: al cambiarlos, toda la interfaz
 * se vuelve a dibujar. Se guardan en el reloj y se restauran al abrir la app.
 */
object CocoSettings {
    private const val PREFS = "coco_settings"

    var language by mutableStateOf(AppLanguage.ES); private set
    var dark by mutableStateOf(false); private set

    fun load(context: Context) {
        val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        language = AppLanguage.entries.firstOrNull { it.code == prefs.getString("language", null) } ?: AppLanguage.ES
        dark = prefs.getBoolean("dark", false)
    }

    fun setLanguage(context: Context, value: AppLanguage) {
        language = value
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString("language", value.code).apply()
    }

    fun setDark(context: Context, value: Boolean) {
        dark = value
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putBoolean("dark", value).apply()
    }
}

/** Texto según el idioma elegido. Se lee desde un estado observable, así que la pantalla se actualiza sola. */
fun tr(es: String, en: String): String = if (CocoSettings.language == AppLanguage.EN) en else es

/** Nombre de cada variable en el idioma elegido. */
val HabitType.displayName: String
    get() = when (this) {
        HabitType.FOOD -> tr("Alimentación", "Feeding"); HabitType.WATER -> tr("Agua", "Water")
        HabitType.SLEEP -> tr("Sueño", "Sleep"); HabitType.PLAY -> tr("Juego", "Play")
        HabitType.BEHAVIOR -> tr("Comportamiento", "Behavior")
    }

/** Unidad de cada variable en el idioma elegido. */
val HabitType.displayUnit: String get() = if (this == HabitType.BEHAVIOR) tr("nota", "note") else unit

/** Nombre corto para rotular los mosaicos del selector. */
fun HabitType.shortLabel(): String = when (this) {
    HabitType.FOOD -> tr("Comida", "Food"); HabitType.WATER -> tr("Agua", "Water"); HabitType.SLEEP -> tr("Sueño", "Sleep")
    HabitType.PLAY -> tr("Juego", "Play"); HabitType.BEHAVIOR -> tr("Conducta", "Behavior")
}
