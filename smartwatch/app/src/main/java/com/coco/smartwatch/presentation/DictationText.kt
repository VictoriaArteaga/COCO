package com.coco.smartwatch.presentation

import com.google.gson.JsonParser

/** Lógica pura del dictado: leer lo que devuelve Vosk y unirlo a la nota. */
object DictationText {
    /** Vosk responde {"text": "..."} o {"partial": "..."}; devuelve el texto o "" si no hay. */
    fun extract(json: String?): String {
        if (json.isNullOrBlank()) return ""
        return try {
            val obj = JsonParser.parseString(json).asJsonObject
            (obj.get("text") ?: obj.get("partial"))?.asString.orEmpty().trim()
        } catch (_: Exception) { "" }
    }

    private val spokenSymbols = mapOf(
        "arroba" to "@", "punto" to ".", "guion" to "-", "guión" to "-",
        "cero" to "0", "uno" to "1", "dos" to "2", "tres" to "3", "cuatro" to "4",
        "cinco" to "5", "seis" to "6", "siete" to "7", "ocho" to "8", "nueve" to "9",
    )

    /**
     * Convierte un correo dictado ("maria punto lopez arroba gmail punto com") en texto de correo
     * ("maria.lopez@gmail.com"): pasa a minúsculas, traduce arroba/punto/guion/dígitos y quita espacios.
     */
    fun toEmail(spoken: String): String =
        spoken.lowercase()
            .replace(Regex("gu[ií]on\\s+bajo"), "_")
            .trim().split(Regex("\\s+")).filter { it.isNotEmpty() }
            .joinToString("") { spokenSymbols[it] ?: it }

    /**
     * Convierte una contraseña dictada en texto. Igual que [toEmail] (símbolos, dígitos, sin espacios),
     * pero respeta mayúsculas: "mayúscula" pone en mayúscula la letra inicial de la palabra siguiente
     * ("mayúscula coco uno dos tres" -> "Coco123").
     */
    fun toPassword(spoken: String): String {
        val result = StringBuilder()
        var capitalizeNext = false
        spoken.lowercase()
            .replace(Regex("gu[ií]on\\s+bajo"), "_")
            .trim().split(Regex("\\s+")).filter { it.isNotEmpty() }
            .forEach { word ->
                if (word == "mayúscula" || word == "mayuscula") { capitalizeNext = true; return@forEach }
                val piece = spokenSymbols[word] ?: word
                result.append(if (capitalizeNext) piece.replaceFirstChar { it.uppercase() } else piece)
                capitalizeNext = false
            }
        return result.toString()
    }

    /** Une el texto ya escrito con lo dictado, sin espacios dobles y limitado a [maxLength]. */
    fun append(existing: String, dictated: String, maxLength: Int = 280): String {
        val spoken = dictated.trim().replace(Regex("\\s+"), " ")
        if (spoken.isEmpty()) return existing
        val base = existing.trimEnd()
        val joined = if (base.isEmpty()) spoken else "$base $spoken"
        return joined.take(maxLength)
    }
}
