package com.coco.smartwatch.domain.usecase

import com.coco.smartwatch.domain.model.HabitRecord
import com.coco.smartwatch.domain.repository.HabitRepository

class RegisterHabitUseCase(private val repository: HabitRepository) {
    suspend operator fun invoke(record: HabitRecord): Long {
        require(record.type != com.coco.smartwatch.domain.model.HabitType.BEHAVIOR || !record.note.isNullOrBlank()) { "Describe brevemente lo observado." }
        require(record.value == null || record.value >= 0) { "El valor no puede ser negativo." }
        return repository.add(record)
    }
}
