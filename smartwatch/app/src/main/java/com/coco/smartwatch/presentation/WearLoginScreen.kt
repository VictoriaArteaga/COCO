package com.coco.smartwatch.presentation

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.coco.smartwatch.R
import com.coco.smartwatch.data.local.SessionStore
import com.coco.smartwatch.data.remote.CocoApiService
import com.coco.smartwatch.data.remote.dto.LoginDto
import com.coco.smartwatch.data.remote.dto.RabbitDto
import com.coco.smartwatch.design.*
import kotlinx.coroutines.launch

/** Campo blanco compacto (40 dp) con texto de ayuda; cabe en la pantalla redonda sin cortar. */
@Composable private fun LoginField(value: String, hint: String, keyboard: KeyboardType, secret: Boolean, onChange: (String) -> Unit) {
    Box(Modifier.fillMaxWidth().height(40.dp).clip(ControlShape).background(Color.White).border(1.dp, CocoColors.Line, ControlShape).padding(horizontal = 12.dp), contentAlignment = Alignment.CenterStart) {
        if (value.isEmpty()) Text(hint, color = CocoColors.Secondary, fontSize = 13.sp)
        BasicTextField(
            value, onChange, singleLine = true, modifier = Modifier.fillMaxWidth(),
            textStyle = TextStyle(color = CocoColors.Text, fontSize = 14.sp, fontFamily = CocoFonts.Body),
            keyboardOptions = KeyboardOptions(keyboardType = keyboard),
            visualTransformation = if (secret) PasswordVisualTransformation() else VisualTransformation.None,
        )
    }
}

@Composable
fun WearLoginScreen(api: CocoApiService, session: SessionStore, canChangeRabbit: suspend () -> Boolean, onPaired: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var rabbits by remember { mutableStateOf<List<RabbitDto>>(emptyList()) }
    var message by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    CocoScreen {
        // Cabecera compacta: logo a color + nombre, para que todo quepa en la pantalla redonda
        LogoTile(44.dp)
        Text("COCO", fontFamily = CocoFonts.Display, fontWeight = FontWeight.SemiBold, fontSize = 24.sp, color = Color.White)
        Text("Inicia sesión para empezar", fontSize = 12.sp, color = Color.White, textAlign = TextAlign.Center)
        Spacer(Modifier.height(10.dp))
        LoginField(email, "Correo", KeyboardType.Email, false) { email = it }
        Spacer(Modifier.height(6.dp))
        LoginField(password, "Contraseña", KeyboardType.Password, true) { password = it }
        Spacer(Modifier.height(8.dp))
        CocoButton(if (loading) "Conectando…" else "Iniciar sesión", enabled = !loading && email.isNotBlank() && password.isNotBlank(), onClick = {
            scope.launch {
                loading = true; message = ""; rabbits = emptyList()
                try {
                    val login = api.login(LoginDto(email.trim(), password))
                    val token = login.body()?.token
                    if (!login.isSuccessful || token == null) { message = "El correo o la contraseña no son correctos."; return@launch }
                    session.saveToken(token)
                    val result = api.getRabbits()
                    if (!result.isSuccessful) { message = if (result.code() == 401) "Tu sesión terminó. Inténtalo de nuevo." else "No pudimos cargar a tus conejos. Inténtalo de nuevo."; session.clear() }
                    else if (result.body().isNullOrEmpty()) message = "Crea un conejo desde la web y vuelve a iniciar sesión."
                    else { rabbits = result.body().orEmpty(); message = "Elige el conejo de este reloj." }
                } catch (_: Exception) { message = "No pudimos conectar. Tus anotaciones siguen guardadas en el reloj." }
                finally { loading = false }
            }
        })
        if (message.isNotBlank()) {
            Spacer(Modifier.height(8.dp))
            CocoCard { Text(message, style = MaterialTheme.typography.bodySmall, color = CocoColors.Text, fontWeight = FontWeight.Bold) }
        }
        if (rabbits.isNotEmpty()) Spacer(Modifier.height(8.dp))
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            rabbits.forEach { rabbit ->
                CocoRabbitRow(rabbit.name) {
                    scope.launch {
                        if (session.rabbitId != null && session.rabbitId != rabbit.id && !canChangeRabbit()) {
                            message = "Primero envía las anotaciones en espera; después podrás cambiar de conejo."
                        } else {
                            session.selectRabbit(rabbit.id)
                            onPaired()
                        }
                    }
                }
            }
        }
    }
}
