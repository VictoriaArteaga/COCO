package com.coco.smartwatch.design

import org.junit.Assert.assertEquals
import org.junit.Test

class CocoFormatTest {
    @Test fun underAnHourStaysInMinutes() {
        assertEquals("0 min", formatDuration(0))
        assertEquals("45 min", formatDuration(45))
        assertEquals("59 min", formatDuration(59))
    }
    @Test fun exactHoursShowOnlyHours() {
        assertEquals("1h", formatDuration(60))
        assertEquals("2h", formatDuration(120))
    }
    @Test fun hoursWithMinutes() {
        assertEquals("1h 30 min", formatDuration(90))
        assertEquals("2h 15 min", formatDuration(135))
        assertEquals("3h 5 min", formatDuration(185))
    }
    @Test fun negativeIsZero() = assertEquals("0 min", formatDuration(-5))
    @Test fun shortVersionForBars() {
        assertEquals("45", formatDurationShort(45))
        assertEquals("1h", formatDurationShort(60))
        assertEquals("1h30", formatDurationShort(90))
    }
}
