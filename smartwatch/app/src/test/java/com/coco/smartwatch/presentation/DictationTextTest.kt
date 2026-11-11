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
    @Test fun emailTranslatesSpokenSymbols() = assertEquals("maria.lopez@gmail.com", DictationText.toEmail("Maria punto Lopez arroba gmail punto com"))
    @Test fun emailTranslatesDigitsAndSeparators() = assertEquals("ana_perez-2@correo.co", DictationText.toEmail("ana guion bajo perez guion dos arroba correo punto co"))
    @Test fun emailIgnoresExtraSpaces() = assertEquals("a@b.com", DictationText.toEmail("  a   arroba b  punto   com "))
    @Test fun emailOfNothingIsEmpty() = assertEquals("", DictationText.toEmail("   "))
    @Test fun passwordCapitalizesAfterMayuscula() = assertEquals("Coco123", DictationText.toPassword("mayúscula coco uno dos tres"))
    @Test fun passwordAcceptsMayusculaWithoutAccent() = assertEquals("Ab", DictationText.toPassword("mayuscula a b"))
    @Test fun passwordTranslatesSymbols() = assertEquals("mi_clave-9.", DictationText.toPassword("mi guion bajo clave guion nueve punto"))
    @Test fun passwordTrailingMayusculaIsIgnored() = assertEquals("abc", DictationText.toPassword("abc mayúscula"))
    @Test fun passwordOfNothingIsEmpty() = assertEquals("", DictationText.toPassword("  "))
    @Test fun appendRespectsMaxLength() = assertEquals(10, DictationText.append("a".repeat(8), "bbbbbbbb", 10).length)

    @Test fun numberSimple() { assertEquals("12", DictationText.toNumber("doce")); assertEquals("0", DictationText.toNumber("cero")) }
    @Test fun numberCompound() {
        assertEquals("25", DictationText.toNumber("veinticinco"))
        assertEquals("45", DictationText.toNumber("cuarenta y cinco"))
        assertEquals("120", DictationText.toNumber("ciento veinte"))
        assertEquals("350", DictationText.toNumber("trescientos cincuenta"))
    }
    @Test fun numberThousands() {
        assertEquals("1000", DictationText.toNumber("mil"))
        assertEquals("2500", DictationText.toNumber("dos mil quinientos"))
    }
    @Test fun numberDecimal() = assertEquals("2,5", DictationText.toNumber("dos coma cinco"))
    @Test fun numberDigitsAndCase() = assertEquals("30", DictationText.toNumber("  Treinta "))
    @Test fun numberRejectsNonsense() {
        assertEquals(null, DictationText.toNumber("hola mundo"))
        assertEquals(null, DictationText.toNumber(""))
    }
}
