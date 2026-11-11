package com.coco.smartwatch.design

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.coco.smartwatch.R

/** Paleta COCO (la misma que la plataforma web): café de marca, amarillo de acento y tinta café oscura. */
object CocoColors {
    // Los colores que dependen del modo se leen de un estado observable: al activar el modo oscuro, todo se redibuja.
    private val dark: Boolean get() = CocoSettings.dark

    /** Café de marca (fijo): botones de micrófono y acentos que deben verse igual en ambos modos. */
    val BrandBrown = Color(0xFF5E3822)
    val Brown: Color get() = if (dark) Color(0xFF14100E) else Color(0xFF5E3822)
    val BrownLight: Color get() = if (dark) Color(0xFF2A211C) else Color(0xFF7D4D31)
    val Green = Color(0xFF8A5A3B)
    val GreenDark: Color get() = if (dark) Color(0xFFE8C9A8) else Color(0xFF5A3825)
    val GreenLight: Color get() = if (dark) Color(0xFF3A2F28) else Color(0xFFF3E6D8)
    val Yellow = Color(0xFFFFC83D); val Ink = Color(0xFF2B1B12)
    val Background: Color get() = Brown
    val Surface: Color get() = if (dark) Color(0xFF2B231E) else Color.White
    val Mint: Color get() = if (dark) Color(0xFF241D19) else Color(0xFFFBF3EA)
    val Text: Color get() = if (dark) Color(0xFFF3E6D8) else Color(0xFF2B1B12)
    val Secondary: Color get() = if (dark) Color(0xFFC9B5A3) else Color(0xFF6D5545)
    val Line: Color get() = if (dark) Color(0xFF4A3D34) else Color(0xFFE0CEBE)
    val Coral = Color(0xFFD6334F)
    val Normal: Color get() = if (dark) Color(0xFF5CBF86) else Color(0xFF2E7D50)
    val Attention: Color get() = if (dark) Color(0xFFE0A84A) else Color(0xFFB7791F)
    val HighAttention: Color get() = if (dark) Color(0xFFFF6B84) else Color(0xFFD6334F)
    val Info: Color get() = if (dark) Color(0xFF7FB0E6) else Color(0xFF3B6EA5)
    val Offline: Color get() = if (dark) Color(0xFFA3ADA8) else Color(0xFF7A8580)
}

/** Fredoka para títulos y Nunito para el texto: las mismas tipografías de la web. */
object CocoFonts {
    val Display = FontFamily(Font(R.font.fredoka_semibold, FontWeight.SemiBold), Font(R.font.fredoka_semibold, FontWeight.Bold))
    val Body = FontFamily(Font(R.font.nunito_regular, FontWeight.Normal), Font(R.font.nunito_bold, FontWeight.Bold), Font(R.font.nunito_bold, FontWeight.SemiBold))
}

private fun cocoTypography(): Typography {
    val base = Typography()
    fun TextStyle.body() = copy(fontFamily = CocoFonts.Body)
    fun TextStyle.display() = copy(fontFamily = CocoFonts.Display)
    return base.copy(
        displayLarge = base.displayLarge.display(), displayMedium = base.displayMedium.display(), displaySmall = base.displaySmall.display(),
        headlineLarge = base.headlineLarge.display(), headlineMedium = base.headlineMedium.display(), headlineSmall = base.headlineSmall.display(),
        titleLarge = base.titleLarge.display().copy(fontSize = 20.sp), titleMedium = base.titleMedium.display().copy(fontSize = 16.sp), titleSmall = base.titleSmall.display(),
        bodyLarge = base.bodyLarge.body(), bodyMedium = base.bodyMedium.body(), bodySmall = base.bodySmall.body(),
        labelLarge = base.labelLarge.body(), labelMedium = base.labelMedium.body(), labelSmall = base.labelSmall.body(),
    )
}

@Composable fun CocoTheme(content: @Composable () -> Unit) {
    val scheme = if (CocoSettings.dark) darkColorScheme(
        primary = CocoColors.Yellow, onPrimary = CocoColors.Ink,
        secondary = CocoColors.GreenLight, onSecondary = CocoColors.GreenDark,
        background = CocoColors.Background, surface = CocoColors.Surface,
        onSurface = CocoColors.Text, onBackground = CocoColors.Text,
        outline = CocoColors.Line, error = CocoColors.Coral,
    ) else lightColorScheme(
        primary = CocoColors.Yellow, onPrimary = CocoColors.Ink,
        secondary = CocoColors.GreenLight, onSecondary = CocoColors.GreenDark,
        background = CocoColors.Background, surface = CocoColors.Surface,
        onSurface = CocoColors.Text, onBackground = CocoColors.Text,
        outline = CocoColors.Line, error = CocoColors.Coral,
    )
    MaterialTheme(
        colorScheme = scheme,
        typography = cocoTypography(),
        content = content,
    )
}
