package com.coco.smartwatch.data.local

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

class SessionStore(context: Context) {
    private val preferences = EncryptedSharedPreferences.create(
        context,
        "coco_session",
        MasterKey.Builder(context).setKeyScheme(MasterKey.KeyScheme.AES256_GCM).build(),
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    val token: String? get() = preferences.getString("access_token", null)
    val rabbitId: String? get() = preferences.getString("rabbit_id", null)
    val isPaired: Boolean get() = token != null && rabbitId != null

    fun saveToken(value: String) { preferences.edit().putString("access_token", value).apply() }
    fun selectRabbit(id: String) { preferences.edit().putString("rabbit_id", id).apply() }
    fun logout() { preferences.edit().remove("access_token").apply() }
    fun clear() { preferences.edit().clear().apply() }
}
