package com.coco.smartwatch.domain.usecase

import com.coco.smartwatch.domain.repository.HabitRepository

class UndoHabitUseCase(private val repository: HabitRepository) { suspend operator fun invoke(id: Long) = repository.undo(id) }
