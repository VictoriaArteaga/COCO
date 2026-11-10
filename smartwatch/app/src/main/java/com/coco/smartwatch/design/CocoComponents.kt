package com.coco.smartwatch.design

import androidx.annotation.DrawableRes
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
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
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Density
import kotlin.math.min
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

/**
 * Fondo café de marca (degradado vertical, como el inicio de sesión de la web).
 *
 * Responsive para cualquier reloj (redondo o cuadrado, pequeño o grande):
 *  - Todo el diseño (dp y sp) se escala según el lado menor de la pantalla; la referencia es un reloj de 227 dp.
 *    Así el espacio de diseño es siempre casi el mismo y nada se sale de la pantalla.
 *  - En pantallas redondas los márgenes se calculan con la geometría del círculo, para que ni el primer ni el
 *    último elemento queden cortados por la curva. En pantallas cuadradas los márgenes son pequeños.
 *  - El contenido se desplaza si no cabe y se centra verticalmente si sobra espacio.
 */
@Composable fun CocoScreen(content: @Composable ColumnScope.() -> Unit) {
    val round = LocalConfiguration.current.isScreenRound
    BoxWithConstraints(Modifier.fillMaxSize()) {
        val factor = (min(maxWidth.value, maxHeight.value) / 227f).coerceIn(0.55f, 1.3f)
        val base = LocalDensity.current
        // fontScale limitado: con letra del sistema muy grande el texto sigue cabiendo (y se ajusta en varias líneas).
        CompositionLocalProvider(LocalDensity provides Density(base.density * factor, base.fontScale.coerceIn(0.85f, 1.15f))) {
            ScaledScreen(round, content)
        }
    }
}

@Composable private fun ScaledScreen(round: Boolean, content: @Composable ColumnScope.() -> Unit) {
    BoxWithConstraints(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(CocoColors.BrownLight, CocoColors.Brown)))) {
        val side = if (round) maxWidth * 0.17f else 14.dp
        val top = if (round) maxHeight * 0.17f else 12.dp
        val bottom = if (round) maxHeight * 0.20f else 16.dp
        val minContent = maxHeight - top - bottom
        Column(
            Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(start = side, end = side, top = top, bottom = bottom),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Column(
                Modifier.fillMaxWidth().heightIn(min = minContent),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
                content = content,
            )
        }
    }
}

/** Logo de COCO: conejo a todo color sobre mosaico amarillo con borde tinta. */
@Composable fun LogoTile(size: Dp = 44.dp) {
    val shape = RoundedCornerShape(size * 0.3f)
    Box(Modifier.size(size).clip(shape).background(CocoColors.Yellow).border(1.5.dp, CocoColors.Ink, shape), contentAlignment = Alignment.Center) {
        Image(painterResource(R.drawable.ic_logo), contentDescription = "COCO", modifier = Modifier.size(size * 0.86f))
    }
}

/** Fila de conejo (selección en el inicio de sesión): logo + nombre. */
@Composable fun CocoRabbitRow(label: String, onClick: () -> Unit) {
    Surface(Modifier.fillMaxWidth().heightIn(min = 48.dp).clickable(onClick = onClick), shape = ControlShape, color = CocoColors.Surface, border = BorderStroke(1.dp, CocoColors.Line)) {
        Row(Modifier.padding(horizontal = 8.dp, vertical = 6.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            LogoTile(32.dp)
            Text(label, color = CocoColors.Text, fontFamily = CocoFonts.Display, fontWeight = FontWeight.SemiBold, fontSize = 15.sp, maxLines = 2, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f))
        }
    }
}

/** Tarjeta blanca con esquinas suaves, igual que las tarjetas de la web. */
@Composable fun CocoCard(modifier: Modifier = Modifier, content: @Composable ColumnScope.() -> Unit) {
    Surface(modifier.fillMaxWidth(), shape = CardShape, color = CocoColors.Surface, shadowElevation = 2.dp, border = BorderStroke(1.dp, CocoColors.Line.copy(alpha = 0.6f))) {
        Column(Modifier.padding(horizontal = 10.dp, vertical = 8.dp), content = content)
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
        onClick = onClick, enabled = enabled, modifier = modifier.fillMaxWidth().heightIn(min = 46.dp), shape = ControlShape,
        colors = ButtonDefaults.buttonColors(containerColor = CocoColors.Yellow, contentColor = CocoColors.Ink, disabledContainerColor = CocoColors.Yellow.copy(alpha = 0.45f), disabledContentColor = CocoColors.Ink.copy(alpha = 0.6f)),
        border = BorderStroke(1.5.dp, CocoColors.Ink),
    ) { Text(text, fontFamily = CocoFonts.Display, fontWeight = FontWeight.Bold, fontSize = 15.sp) }
}

/**
 * Fila táctil con mosaico de icono y etiqueta, sobre fondo blanco.
 * done = null: fila sin estado; true = ya registrada hoy (check verde); false = pendiente (reloj ámbar).
 */
@Composable fun CocoRow(@DrawableRes icon: Int, color: Color, label: String, done: Boolean? = null, onClick: () -> Unit) {
    Surface(Modifier.fillMaxWidth().heightIn(min = 38.dp).clickable(onClick = onClick), shape = ControlShape, color = CocoColors.Surface, border = BorderStroke(1.dp, CocoColors.Line)) {
        Row(Modifier.padding(horizontal = 8.dp, vertical = 4.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            IconTile(icon, color, 26.dp)
            Text(label, color = CocoColors.Text, fontFamily = CocoFonts.Display, fontWeight = FontWeight.SemiBold, fontSize = 15.sp, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f))
            if (done != null) {
                Icon(
                    painterResource(if (done) R.drawable.ic_check else R.drawable.ic_history),
                    contentDescription = if (done) "Registrada hoy" else "Pendiente",
                    tint = if (done) CocoColors.Normal else CocoColors.Attention, modifier = Modifier.size(18.dp),
                )
            }
        }
    }
}

/** Etiqueta (píldora redondeada) de estado o conteo. */
@Composable fun CocoChip(text: String, background: Color = CocoColors.GreenDark, content: Color = Color.White) {
    Surface(shape = RoundedCornerShape(10.dp), color = background) {
        Text(text, Modifier.padding(horizontal = 10.dp, vertical = 4.dp), color = content, fontSize = 12.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
    }
}

/** Selector de variable: mosaicos de 40 dp que pasan a una segunda fila si no caben (nunca se salen de la pantalla). */
@OptIn(ExperimentalLayoutApi::class)
@Composable fun HabitPicker(selected: HabitType, onSelect: (HabitType) -> Unit) {
    FlowRow(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(4.dp, Alignment.CenterHorizontally), verticalArrangement = Arrangement.spacedBy(4.dp)) {
        HabitType.entries.forEach { type ->
            val active = type == selected
            Box(
                Modifier.size(40.dp).clip(RoundedCornerShape(10.dp)).clickable { onSelect(type) }
                    .background(if (active) Color(type.colorHex) else Color(type.colorHex).copy(alpha = 0.6f))
                    .border(if (active) 2.dp else 1.dp, if (active) CocoColors.Ink else Color.White.copy(alpha = 0.5f), RoundedCornerShape(10.dp)),
                contentAlignment = Alignment.Center,
            ) { Icon(painterResource(type.iconRes()), contentDescription = type.label, tint = Color.White, modifier = Modifier.size(22.dp)) }
        }
    }
}
