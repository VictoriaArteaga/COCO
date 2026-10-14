package com.coco.smartwatch.domain

import com.coco.smartwatch.domain.model.HabitRecord
import com.coco.smartwatch.domain.model.HabitType
import com.coco.smartwatch.domain.repository.HabitRepository
import com.coco.smartwatch.domain.usecase.RegisterHabitUseCase
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.emptyFlow
import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Test

class RegisterHabitUseCaseTest {
    private class FakeRepository : HabitRepository {
        var saved: HabitRecord? = null
        override fun observeRecords(): Flow<List<HabitRecord>> = emptyFlow()
        override suspend fun add(record: HabitRecord): Long { saved = record; return 1L }
        override suspend fun undo(id: Long) = Unit
        override suspend fun pendingCount() = 0
    }
    @Test fun `registers a valid offline observation`() = kotlinx.coroutines.runBlocking {
        val repository = FakeRepository(); val id = RegisterHabitUseCase(repository)(HabitRecord(type = HabitType.WATER, value = 120.0, note = null, recordedAt = 1L))
        assertEquals(1L, id); assertEquals(true, repository.saved?.syncPending)
    }
    @Test fun `requires a note for behavior observations`() = kotlinx.coroutines.runBlocking {
        assertThrows(IllegalArgumentException::class.java) { kotlinx.coroutines.runBlocking { RegisterHabitUseCase(FakeRepository())(HabitRecord(type = HabitType.BEHAVIOR, value = null, note = null, recordedAt = 1L)) } }
    }
}
