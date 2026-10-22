package com.coco.smartwatch.presentation

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.coco.smartwatch.data.local.SessionStore
import com.coco.smartwatch.data.remote.CocoApiService
import com.coco.smartwatch.data.remote.dto.LoginDto
import com.coco.smartwatch.data.remote.dto.RabbitDto
import kotlinx.coroutines.launch

@Composable
fun WearLoginScreen(api: CocoApiService, session: SessionStore, canChangeRabbit: suspend () -> Boolean, onPaired: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var rabbits by remember { mutableStateOf<List<RabbitDto>>(emptyList()) }
    var message by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    Surface(Modifier.fillMaxSize()) {
        Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
            Text("COCO", style = MaterialTheme.typography.titleLarge)
            Text("Inicia sesión y elige tu conejo")
            Spacer(Modifier.height(8.dp))
            OutlinedTextField(email, { email = it }, label = { Text("Correo") }, singleLine = true)
            OutlinedTextField(password, { password = it }, label = { Text("Contraseña") }, visualTransformation = PasswordVisualTransformation(), singleLine = true)
            Button(enabled = !loading && email.isNotBlank() && password.isNotBlank(), onClick = {
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
            }) { Text(if (loading) "Conectando…" else "Iniciar sesión") }
            if (message.isNotBlank()) Text(message, style = MaterialTheme.typography.bodySmall)
            rabbits.forEach { rabbit ->
                Button(onClick = {
                    scope.launch {
                        if (session.rabbitId != null && session.rabbitId != rabbit.id && !canChangeRabbit()) {
                            message = "Sincroniza los registros pendientes del conejo asociado antes de cambiarlo."
                        } else {
                            session.selectRabbit(rabbit.id)
                            onPaired()
                        }
                    }
                }, modifier = Modifier.fillMaxWidth()) { Text(rabbit.name) }
            }
        }
    }
}
