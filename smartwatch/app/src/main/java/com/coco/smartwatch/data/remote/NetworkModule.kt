package com.coco.smartwatch.data.remote

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

/**
 * Configuración del cliente HTTP para COCO.
 *
 * La URL del backend se pasa como parámetro para que pueda
 * cambiar entre entornos (desarrollo, producción) sin recompilar.
 * No se escribe la URL directamente en el código.
 */
object NetworkModule {

    fun createApiService(baseUrl: String, accessToken: () -> String?): CocoApiService {
        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BASIC
        }

        val client = OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .addInterceptor { chain ->
                // El login no lleva token: si se manda uno vencido, el backend responde 401 aunque la clave sea correcta.
                val isAuthCall = chain.request().url.encodedPath.contains("/api/auth/")
                val request = chain.request().newBuilder().apply {
                    if (!isAuthCall) accessToken()?.let { header("Authorization", "Bearer $it") }
                }.build()
                chain.proceed(request)
            }
            .addInterceptor(logging)
            .build()

        return Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(CocoApiService::class.java)
    }
}
