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

    /** Une el texto ya escrito con lo dictado, sin espacios dobles y limitado a [maxLength]. */
    fun append(existing: String, dictated: String, maxLength: Int = 280): String {
        val spoken = dictated.trim().replace(Regex("\\s+"), " ")
        if (spoken.isEmpty()) return existing
        val base = existing.trimEnd()
        val joined = if (base.isEmpty()) spoken else "$base $spoken"
        return joined.take(maxLength)
    }
}
