package com.coco.smartwatch.data.demo

import com.coco.smartwatch.data.local.HabitDao
import com.coco.smartwatch.data.local.HabitEntity
import com.coco.smartwatch.data.local.SessionStore
import com.coco.smartwatch.data.remote.CocoApiService
import com.coco.smartwatch.data.remote.dto.LoginDto
import com.coco.smartwatch.domain.model.SyncStatus
import java.time.Instant

/**
 * Modo demo: inicia sesión sola con la cuenta configurada al compilar, elige a Coquito
 * y descarga los registros de la cuenta para que el reloj muestre su historial.
 */
class DemoSession(
    private val api: CocoApiService,
    private val session: SessionStore,
    private val dao: HabitDao,
    private val email: String,
    private val password: String,
    private val rabbitName: String = "Coquito",
) {
    /** @return true si quedó con sesión y conejo elegidos. */
    suspend fun connect(): Boolean {
        val login = api.login(LoginDto(email.trim(), password))
        val token = login.body()?.token
        if (!login.isSuccessful || token == null) return false
        session.saveToken(token)
        val rabbits = api.getRabbits().body().orEmpty()
        val rabbit = rabbits.firstOrNull { it.name.equals(rabbitName, ignoreCase = true) } ?: rabbits.firstOrNull() ?: return false
        session.selectRabbit(rabbit.id)
        pullRecords(rabbit.id)
        return true
    }

    /** Descarga todas las páginas y guarda lo nuevo como ya sincronizado (los repetidos se ignoran). */
    private suspend fun pullRecords(rabbitId: String) {
        var page = 0
        while (page < 20) {
            val response = api.listHabits(page, PAGE_SIZE)
            val body = response.body()
            if (!response.isSuccessful || body == null) return
            dao.insertAll(body.content.filter { it.rabbitId == rabbitId }.map {
                HabitEntity(
                    type = it.habitType, value = it.value, note = it.note,
                    recordedAt = Instant.parse(it.recordedAt).toEpochMilli(),
                    clientRecordId = it.clientRecordId, syncStatus = SyncStatus.SYNCED.name, retryCount = 0,
                )
            })
            if (body.last || body.content.isEmpty()) return
            page++
        }
    }

    companion object {
        const val PAGE_SIZE = 500
        /** El token del backend dura 1 h; se renueva antes de que venza. */
        const val REFRESH_MS = 30L * 60 * 1000
    }
}
