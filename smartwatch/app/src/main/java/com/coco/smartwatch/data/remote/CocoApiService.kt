package com.coco.smartwatch.data.remote

import com.coco.smartwatch.data.remote.dto.SyncBatchDto
import com.coco.smartwatch.data.remote.dto.SyncResultDto
import com.coco.smartwatch.data.remote.dto.LoginDto
import com.coco.smartwatch.data.remote.dto.AuthResultDto
import com.coco.smartwatch.data.remote.dto.RabbitDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.GET
import retrofit2.http.Query
import com.coco.smartwatch.data.remote.dto.HabitPageDto

/**
 * Interfaz Retrofit para la API REST del backend COCO.
 * La URL base se configura externamente mediante BuildConfig.BACKEND_URL.
 */
interface CocoApiService {

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginDto): Response<AuthResultDto>

    @GET("api/rabbits")
    suspend fun getRabbits(): Response<List<RabbitDto>>

    /** Descarga registros de la cuenta (paginado, del más reciente al más antiguo). */
    @GET("api/habits")
    suspend fun listHabits(@Query("page") page: Int, @Query("size") size: Int): Response<HabitPageDto>

    /**
     * Envía un lote de registros pendientes al backend para sincronización.
     * El backend responde con listas de synced, duplicates y failed.
     */
    @POST("api/sync/habits")
    suspend fun syncHabits(@Body batch: SyncBatchDto): Response<SyncResultDto>
}
