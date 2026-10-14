package com.coco.smartwatch

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
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
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val database = Room.databaseBuilder(applicationContext, CocoDatabase::class.java, "coco.db").build()
        val repository = HabitRepositoryImpl(database.habitDao())
        val viewModel = CocoViewModel(RegisterHabitUseCase(repository), UndoHabitUseCase(repository), GetHabitHistoryUseCase(repository))
        setContent { CocoTheme { CocoApp(viewModel) } }
    }
}
