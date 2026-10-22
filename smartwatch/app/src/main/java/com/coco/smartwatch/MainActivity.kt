package com.coco.smartwatch

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.room.Room
import com.coco.smartwatch.BuildConfig
import com.coco.smartwatch.data.local.CocoDatabase
import com.coco.smartwatch.data.local.SessionStore
import com.coco.smartwatch.data.remote.NetworkModule
import com.coco.smartwatch.data.repository.HabitRepositoryImpl
import com.coco.smartwatch.data.sync.SyncManager
import com.coco.smartwatch.design.CocoTheme
import com.coco.smartwatch.domain.usecase.GetHabitHistoryUseCase
import com.coco.smartwatch.domain.usecase.RegisterHabitUseCase
import com.coco.smartwatch.domain.usecase.UndoHabitUseCase
import com.coco.smartwatch.presentation.CocoApp
import com.coco.smartwatch.presentation.WearLoginScreen
import com.coco.smartwatch.presentation.CocoViewModel
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch

/**
 * Entry point for the COCO Wear OS application.
 *
 * Manual DI (no Hilt/Dagger):
 *   CocoDatabase → HabitDao → SyncManager → HabitRepositoryImpl → use cases → CocoViewModel
 *
 * The backend URL is configured at build time. A signed-in user selects an
 *   BACKEND_URL env var  →  BuildConfig.BACKEND_URL
 */
class MainActivity : ComponentActivity() {

    private val sessionStore by lazy { SessionStore(applicationContext) }

    private val database by lazy {
        Room.databaseBuilder(applicationContext, CocoDatabase::class.java, "coco.db")
            .build()
    }

    private val apiService by lazy {
        NetworkModule.createApiService(BuildConfig.BACKEND_URL) { sessionStore.token }
    }

    private val syncManager by lazy {
        SyncManager(
            dao = database.habitDao(),
            api = apiService,
            rabbitId = { sessionStore.rabbitId }
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

        setContent {
            CocoTheme {
                var paired by remember { mutableStateOf(sessionStore.isPaired) }
                if (paired) CocoApp(viewModel) { sessionStore.logout(); paired = false }
                else WearLoginScreen(apiService, sessionStore, { database.habitDao().pendingCount() == 0 }) { paired = true }
            }
        }
    }
}
