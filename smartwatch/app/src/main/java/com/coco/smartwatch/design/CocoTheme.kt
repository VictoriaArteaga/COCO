package com.coco.smartwatch.design

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

object CocoColors {
    val Green = Color(0xFF356B55); val GreenDark = Color(0xFF244C3C); val GreenLight = Color(0xFFDCEBE2)
    val Background = Color(0xFFF7F5EF); val Surface = Color.White; val Text = Color(0xFF26332D); val Secondary = Color(0xFF65716B)
    val Normal = Color(0xFF2E7D5B); val Attention = Color(0xFF8A5700); val HighAttention = Color(0xFFB5483A); val Info = Color(0xFF3B6EA5); val Offline = Color(0xFF59645F)
}

@Composable fun CocoTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = lightColorScheme(primary = CocoColors.Green, onPrimary = Color.White, secondary = CocoColors.GreenLight, background = CocoColors.Background, surface = CocoColors.Surface, onSurface = CocoColors.Text, onBackground = CocoColors.Text), content = content)
}
