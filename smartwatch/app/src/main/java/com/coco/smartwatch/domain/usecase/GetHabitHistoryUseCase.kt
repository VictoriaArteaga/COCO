package com.coco.smartwatch.domain.usecase

import com.coco.smartwatch.domain.repository.HabitRepository

class GetHabitHistoryUseCase(private val repository: HabitRepository) { operator fun invoke() = repository.observeRecords() }
