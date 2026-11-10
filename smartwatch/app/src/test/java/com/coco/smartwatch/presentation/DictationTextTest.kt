package com.coco.smartwatch.presentation

import org.junit.Assert.assertEquals
import org.junit.Test

class DictationTextTest {
    @Test fun extractsFinalText() = assertEquals("comió poco", DictationText.extract("""{"text": " comió poco "}"""))
    @Test fun extractsPartialText() = assertEquals("comió", DictationText.extract("""{"partial": "comió"}"""))
    @Test fun ignoresEmptyOrBrokenJson() {
        assertEquals("", DictationText.extract(null))
        assertEquals("", DictationText.extract("""{"text": ""}"""))
        assertEquals("", DictationText.extract("no es json"))
    }
    @Test fun appendJoinsWithSingleSpace() = assertEquals("Hoy comió poco", DictationText.append("Hoy  ", "comió   poco"))
    @Test fun appendToEmptyKeepsDictation() = assertEquals("saltó mucho", DictationText.append("", " saltó mucho "))
    @Test fun appendNothingKeepsNote() = assertEquals("Hoy", DictationText.append("Hoy", "  "))
    @Test fun appendRespectsMaxLength() = assertEquals(10, DictationText.append("a".repeat(8), "bbbbbbbb", 10).length)
}
