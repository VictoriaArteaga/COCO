package com.coco.smartwatch

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.room.Room
import com.coco.smartwatch.data.local.CocoDatabase
import com.coco.smartwatch.data.repository.HabitRepositoryImpl
import com.coco.smartwatch.domain.usecase.GetHabitHistoryUseCase
import com.coco.smartwatch.domain.usecase.RegisterHabitUseCase
import com.coco.smartwatch.domain.usecase.UndoHabitUseCase
import com.coco.smartwatch.presentation.CocoApp
import com.coco.smartwatch.presentation.CocoViewModel
import com.coco.smartwatch.design.CocoTheme

class MainActivity : ComponentActivity() {

    private val database by lazy {
        Room.databaseBuilder(applicationContext, CocoDatabase::class.java, "coco.db").build()
    }

    private val viewModel: CocoViewModel by viewModels {
        object : ViewModelProvider.Factory {
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                val repository = HabitRepositoryImpl(database.habitDao())
                @Suppress("UNCHECKED_CAST")
                return CocoViewModel(
                    RegisterHabitUseCase(repository),
                    UndoHabitUseCase(repository),
                    GetHabitHistoryUseCase(repository)
                ) as T
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { CocoTheme { CocoApp(viewModel) } }
    }
}
