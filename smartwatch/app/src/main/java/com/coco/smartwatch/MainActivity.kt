package com.coco.smartwatch

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.room.Room
import com.coco.smartwatch.BuildConfig
import com.coco.smartwatch.data.local.CocoDatabase
import com.coco.smartwatch.data.remote.NetworkModule
import com.coco.smartwatch.data.repository.HabitRepositoryImpl
import com.coco.smartwatch.data.sync.SyncManager
import com.coco.smartwatch.design.CocoTheme
import com.coco.smartwatch.domain.usecase.GetHabitHistoryUseCase
import com.coco.smartwatch.domain.usecase.RegisterHabitUseCase
import com.coco.smartwatch.domain.usecase.UndoHabitUseCase
import com.coco.smartwatch.presentation.CocoApp
import com.coco.smartwatch.presentation.CocoViewModel
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch

/**
 * Entry point for the COCO Wear OS application.
 *
 * Manual DI (no Hilt/Dagger):
 *   CocoDatabase → HabitDao → SyncManager → HabitRepositoryImpl → use cases → CocoViewModel
 *
 * The backend URL and rabbit ID come from BuildConfig so they can be set
 * per environment without touching source files:
 *   BACKEND_URL env var  →  BuildConfig.BACKEND_URL
 *   RABBIT_ID  env var   →  BuildConfig.RABBIT_ID
 */
class MainActivity : ComponentActivity() {

    private val database by lazy {
        Room.databaseBuilder(applicationContext, CocoDatabase::class.java, "coco.db")
            .build()
    }

    private val apiService by lazy {
        NetworkModule.createApiService(BuildConfig.BACKEND_URL)
    }

    private val syncManager by lazy {
        SyncManager(
            dao = database.habitDao(),
            api = apiService,
            rabbitId = BuildConfig.RABBIT_ID
        )
    }

    private val repository by lazy {
        HabitRepositoryImpl(
            dao = database.habitDao(),
            syncManager = syncManager
        )
    }

    private val viewModel: CocoViewModel by viewModels {
        object : ViewModelProvider.Factory {
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                @Suppress("UNCHECKED_CAST")
                return CocoViewModel(
                    register = RegisterHabitUseCase(repository),
                    undo = UndoHabitUseCase(repository),
                    history = GetHabitHistoryUseCase(repository),
                    repository = repository
                ) as T
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Reset any records stuck in SYNCING state from a previous interrupted session.
        MainScope().launch { syncManager.resetInterruptedSyncs() }

        setContent { CocoTheme { CocoApp(viewModel) } }
    }
}
