package com.coco.smartwatch.presentation

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
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

@Composable
fun WearLoginScreen(api: CocoApiService, session: SessionStore, canChangeRabbit: suspend () -> Boolean, onPaired: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var rabbits by remember { mutableStateOf<List<RabbitDto>>(emptyList()) }
    var message by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    CocoScreen {
        // Cabecera: icono circular con el conejo y el nombre, igual que el inicio de sesión de la web
        IconTile(R.drawable.ic_rabbit, CocoColors.GreenDark, 48.dp, borderColor = Color.White.copy(alpha = 0.6f))
        Spacer(Modifier.height(6.dp))
        Text("COCO", fontFamily = CocoFonts.Display, fontWeight = FontWeight.SemiBold, fontSize = 26.sp, color = Color.White)
        Text("Inicia sesión y elige tu conejo", fontSize = 12.sp, color = Color.White.copy(alpha = 0.9f), textAlign = TextAlign.Center)
        Spacer(Modifier.height(10.dp))
        CocoCard {
            OutlinedTextField(email, { email = it }, label = { Text("Correo") }, singleLine = true, shape = ControlShape, modifier = Modifier.fillMaxWidth())
            Spacer(Modifier.height(6.dp))
            OutlinedTextField(password, { password = it }, label = { Text("Contraseña") }, visualTransformation = PasswordVisualTransformation(), singleLine = true, shape = ControlShape, modifier = Modifier.fillMaxWidth())
        }
        Spacer(Modifier.height(8.dp))
        CocoButton(if (loading) "Conectando…" else "Iniciar sesión", enabled = !loading && email.isNotBlank() && password.isNotBlank(), onClick = {
            scope.launch {
                loading = true; message = ""; rabbits = emptyList()
                try {
                    val login = api.login(LoginDto(email.trim(), password))
                    val token = login.body()?.token
                    if (!login.isSuccessful || token == null) { message = "Correo o contraseña incorrectos."; return@launch }
                    session.saveToken(token)
                    val result = api.getRabbits()
                    if (!result.isSuccessful) { message = if (result.code() == 401) "Sesión vencida. Intenta de nuevo." else "No se pudieron cargar tus conejos."; session.clear() }
                    else if (result.body().isNullOrEmpty()) message = "Crea un conejo desde la web y vuelve a iniciar sesión."
                    else { rabbits = result.body().orEmpty(); message = "Selecciona el conejo asociado a este reloj." }
                } catch (_: Exception) { message = "No se pudo conectar. Tus registros locales se conservan." }
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
                CocoRow(R.drawable.ic_rabbit, CocoColors.Green, rabbit.name) {
                    scope.launch {
                        if (session.rabbitId != null && session.rabbitId != rabbit.id && !canChangeRabbit()) {
                            message = "Sincroniza los registros pendientes del conejo asociado antes de cambiarlo."
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
