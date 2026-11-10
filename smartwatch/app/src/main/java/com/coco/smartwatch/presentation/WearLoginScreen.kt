package com.coco.smartwatch.presentation

import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.clickable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.core.content.ContextCompat
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
@Composable private fun LoginField(
    value: String, hint: String, keyboard: KeyboardType, secret: Boolean,
    /** Si no es null, muestra un botón de micrófono al final del campo. */
    mic: MicButton? = null, onChange: (String) -> Unit,
) {
    Row(
        Modifier.fillMaxWidth().heightIn(min = 40.dp).clip(ControlShape).background(Color.White).border(1.dp, CocoColors.Line, ControlShape).padding(start = 12.dp, end = if (mic != null) 4.dp else 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(Modifier.weight(1f), contentAlignment = Alignment.CenterStart) {
            if (value.isEmpty()) Text(hint, color = CocoColors.Secondary, fontSize = 13.sp)
            BasicTextField(
                value, onChange, singleLine = true, modifier = Modifier.fillMaxWidth(),
                textStyle = TextStyle(color = CocoColors.Text, fontSize = 14.sp, fontFamily = CocoFonts.Body),
                keyboardOptions = KeyboardOptions(keyboardType = keyboard),
                visualTransformation = if (secret) PasswordVisualTransformation() else VisualTransformation.None,
            )
        }
        if (mic != null) {
            Box(
                Modifier.size(32.dp).clip(CircleShape).background(if (mic.listening) CocoColors.Coral else CocoColors.Brown)
                    .semantics { contentDescription = if (mic.listening) "Terminar de dictar: $hint" else "Dictar: $hint" }
                    .clickable(enabled = mic.enabled, onClick = mic.onClick),
                contentAlignment = Alignment.Center,
            ) { Icon(painterResource(R.drawable.ic_mic), contentDescription = null, tint = Color.Unspecified, modifier = Modifier.size(18.dp)) }
        }
    }
}

private enum class DictationTarget { EMAIL, PASSWORD }

private class MicButton(val listening: Boolean, val enabled: Boolean, val onClick: () -> Unit)

@Composable
fun WearLoginScreen(api: CocoApiService, session: SessionStore, canChangeRabbit: suspend () -> Boolean, onPaired: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var rabbits by remember { mutableStateOf<List<RabbitDto>>(emptyList()) }
    var message by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    // Dictado de correo y contraseña (offline, mismo motor que la nota de comportamiento). Un solo dictado a la vez.
    val context = LocalContext.current
    val dictation = remember { VoiceDictation(context, scope) }
    val hasMic = remember { context.packageManager.hasSystemFeature(PackageManager.FEATURE_MICROPHONE) }
    var micDenied by remember { mutableStateOf(false) }
    var target by remember { mutableStateOf(DictationTarget.EMAIL) }
    val startDictation = { field: DictationTarget ->
        micDenied = false; target = field
        dictation.shutdown()
        if (field == DictationTarget.EMAIL) { email = ""; dictation.start { email += DictationText.toEmail(it) } }
        else { password = ""; dictation.start { password += DictationText.toPassword(it) } }
    }
    val micPermission = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted -> if (granted) startDictation(target) else micDenied = true }
    DisposableEffect(Unit) { onDispose { dictation.shutdown() } }
    val listening = dictation.state == DictationState.LISTENING
    val dictating = listening || dictation.state == DictationState.PREPARING
    val micFor = { field: DictationTarget ->
        if (!hasMic) null else MicButton(listening && target == field, enabled = dictation.state != DictationState.PREPARING) {
            when {
                listening && target == field -> dictation.stop()
                ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED -> startDictation(field)
                else -> { target = field; micPermission.launch(Manifest.permission.RECORD_AUDIO) }
            }
        }
    }
    // Ayuda bajo el campo que se está dictando (nunca muestra lo que se dice de la contraseña).
    val hintFor = { field: DictationTarget ->
        if (target != field) "" else when {
            micDenied -> "Sin permiso del micrófono. Escríbelo."
            dictation.state == DictationState.ERROR -> "No pudimos escuchar. Inténtalo otra vez o escribe."
            dictation.state == DictationState.PREPARING -> "Preparando…"
            listening && field == DictationTarget.EMAIL -> "Di: ana punto perez arroba gmail punto com"
            listening -> "Di tu contraseña. «Mayúscula» antes de una palabra"
            else -> ""
        }
    }

    CocoScreen {
        // Cabecera compacta: logo a color + nombre, para que todo quepa en la pantalla redonda
        LogoTile(44.dp)
        Text("COCO", fontFamily = CocoFonts.Display, fontWeight = FontWeight.SemiBold, fontSize = 24.sp, color = Color.White)
        Text("Inicia sesión para empezar", fontSize = 12.sp, lineHeight = 14.sp, color = Color.White, textAlign = TextAlign.Center)
        Spacer(Modifier.height(10.dp))
        LoginField(email, "Correo", KeyboardType.Email, false, micFor(DictationTarget.EMAIL)) { email = it }
        val emailHint = hintFor(DictationTarget.EMAIL)
        if (emailHint.isNotEmpty()) Text(emailHint, color = Color.White, fontSize = 12.sp, lineHeight = 14.sp, textAlign = TextAlign.Center, modifier = Modifier.padding(top = 3.dp))
        Spacer(Modifier.height(6.dp))
        LoginField(password, "Contraseña", KeyboardType.Password, true, micFor(DictationTarget.PASSWORD)) { password = it }
        val passwordHint = hintFor(DictationTarget.PASSWORD)
        if (passwordHint.isNotEmpty()) Text(passwordHint, color = Color.White, fontSize = 12.sp, lineHeight = 14.sp, textAlign = TextAlign.Center, modifier = Modifier.padding(top = 3.dp))
        Spacer(Modifier.height(8.dp))
        CocoButton(if (loading) "Conectando…" else "Iniciar sesión", enabled = !loading && !dictating && email.isNotBlank() && password.isNotBlank(), onClick = {
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
