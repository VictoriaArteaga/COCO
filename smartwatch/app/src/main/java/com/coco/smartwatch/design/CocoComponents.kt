package com.coco.smartwatch.design

import androidx.annotation.DrawableRes
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.material3.Icon
import com.coco.smartwatch.R
import com.coco.smartwatch.domain.model.HabitType

/** Icono (vector bicolor de COCO) de cada variable de hábito. */
@DrawableRes fun HabitType.iconRes(): Int = when (this) {
    HabitType.FOOD -> R.drawable.ic_food
    HabitType.WATER -> R.drawable.ic_water
    HabitType.SLEEP -> R.drawable.ic_sleep
    HabitType.PLAY -> R.drawable.ic_play
    HabitType.BEHAVIOR -> R.drawable.ic_behavior
}

val CardShape = RoundedCornerShape(14.dp)
val ControlShape = RoundedCornerShape(12.dp)

/** Fondo turquesa de marca (degradado vertical, como el inicio de sesión de la web). Deja margen para pantallas redondas. */
@Composable fun CocoScreen(content: @Composable ColumnScope.() -> Unit) {
    Box(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(CocoColors.TurquoiseLight, CocoColors.Turquoise)))) {
        Column(
            Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(start = 18.dp, end = 18.dp, top = 28.dp, bottom = 28.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            content = content,
        )
    }
}

/** Tarjeta blanca con esquinas suaves, igual que las tarjetas de la web. */
@Composable fun CocoCard(modifier: Modifier = Modifier, content: @Composable ColumnScope.() -> Unit) {
    Surface(modifier.fillMaxWidth(), shape = CardShape, color = CocoColors.Surface, shadowElevation = 2.dp, border = BorderStroke(1.dp, CocoColors.Line.copy(alpha = 0.6f))) {
        Column(Modifier.padding(12.dp), content = content)
    }
}

/** Mosaico de icono: fondo de color, icono blanco y borde tinta (mismo patrón que la web). */
@Composable fun IconTile(@DrawableRes icon: Int, color: Color, size: Dp = 36.dp, tint: Color = Color.White, borderColor: Color = CocoColors.Ink) {
    Box(
        Modifier.size(size).clip(RoundedCornerShape(size * 0.28f)).background(color).border(1.5.dp, borderColor, RoundedCornerShape(size * 0.28f)),
        contentAlignment = Alignment.Center,
    ) { Icon(painterResource(icon), contentDescription = null, tint = tint, modifier = Modifier.size(size * 0.58f)) }
}

/** Botón principal amarillo con texto oscuro (contraste alto), como el botón de acción de la web. */
@Composable fun CocoButton(text: String, onClick: () -> Unit, modifier: Modifier = Modifier, enabled: Boolean = true) {
    Button(
        onClick = onClick, enabled = enabled, modifier = modifier.fillMaxWidth().heightIn(min = 48.dp), shape = ControlShape,
        colors = ButtonDefaults.buttonColors(containerColor = CocoColors.Yellow, contentColor = CocoColors.Ink, disabledContainerColor = CocoColors.Yellow.copy(alpha = 0.45f), disabledContentColor = CocoColors.Ink.copy(alpha = 0.6f)),
        border = BorderStroke(1.5.dp, CocoColors.Ink),
    ) { Text(text, fontFamily = CocoFonts.Display, fontWeight = FontWeight.Bold, fontSize = 15.sp) }
}

/** Fila táctil (mínimo 48 dp) con mosaico de icono y etiqueta, sobre fondo blanco. */
@Composable fun CocoRow(@DrawableRes icon: Int, color: Color, label: String, onClick: () -> Unit) {
    Surface(Modifier.fillMaxWidth().heightIn(min = 52.dp).clickable(onClick = onClick), shape = ControlShape, color = CocoColors.Surface, border = BorderStroke(1.dp, CocoColors.Line)) {
        Row(Modifier.padding(horizontal = 10.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            IconTile(icon, color, 34.dp)
            Text(label, color = CocoColors.Text, fontFamily = CocoFonts.Display, fontWeight = FontWeight.SemiBold, fontSize = 15.sp)
        }
    }
}

/** Etiqueta (píldora redondeada) de estado o conteo. */
@Composable fun CocoChip(text: String, background: Color = CocoColors.GreenDark, content: Color = Color.White) {
    Surface(shape = RoundedCornerShape(10.dp), color = background) {
        Text(text, Modifier.padding(horizontal = 10.dp, vertical = 4.dp), color = content, fontSize = 12.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
    }
}

/** Selector de variable: mosaico pequeño con anillo blanco cuando está seleccionado. */
@Composable fun HabitPicker(selected: HabitType, onSelect: (HabitType) -> Unit) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        HabitType.entries.forEach { type ->
            val active = type == selected
            Box(
                Modifier.size(34.dp).clip(RoundedCornerShape(10.dp)).clickable { onSelect(type) }
                    .background(if (active) Color(type.colorHex) else Color(type.colorHex).copy(alpha = 0.28f))
                    .border(if (active) 2.dp else 1.dp, if (active) CocoColors.Ink else Color(type.colorHex).copy(alpha = 0.5f), RoundedCornerShape(10.dp)),
                contentAlignment = Alignment.Center,
            ) { Icon(painterResource(type.iconRes()), contentDescription = type.label, tint = if (active) Color.White else Color(type.colorHex), modifier = Modifier.size(20.dp)) }
        }
    }
}
