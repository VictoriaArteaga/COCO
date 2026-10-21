package com.coco.smartwatch.data.remote

import com.coco.smartwatch.data.remote.dto.SyncBatchDto
import com.coco.smartwatch.data.remote.dto.SyncResultDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

/**
 * Interfaz Retrofit para la API REST del backend COCO.
 * La URL base se configura externamente mediante BuildConfig.BACKEND_URL.
 */
interface CocoApiService {

    /**
     * Envía un lote de registros pendientes al backend para sincronización.
     * El backend responde con listas de synced, duplicates y failed.
     */
    @POST("api/sync/habits")
    suspend fun syncHabits(@Body batch: SyncBatchDto): Response<SyncResultDto>
}
