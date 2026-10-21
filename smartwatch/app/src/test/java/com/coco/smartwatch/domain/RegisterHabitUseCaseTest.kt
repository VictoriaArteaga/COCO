package com.coco.smartwatch.domain

import com.coco.smartwatch.data.sync.SyncState
import com.coco.smartwatch.domain.model.HabitRecord
import com.coco.smartwatch.domain.model.HabitType
import com.coco.smartwatch.domain.model.SyncStatus
import com.coco.smartwatch.domain.repository.HabitRepository
import com.coco.smartwatch.domain.usecase.RegisterHabitUseCase
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.emptyFlow
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * Unit tests for RegisterHabitUseCase.
 * FakeRepository is a top-level private class to avoid inner-class classloading issues.
 */
private class FakeHabitRepository : HabitRepository {
    var saved: HabitRecord? = null
    private val _syncState = MutableStateFlow<SyncState>(SyncState.Idle)

    override fun observeRecords(): Flow<List<HabitRecord>> = emptyFlow()
    override suspend fun add(record: HabitRecord): Long {
        saved = record
        return 1L
    }
    override suspend fun undo(id: Long) = Unit
    override suspend fun pendingCount(): Int = 0
    override val syncState: StateFlow<SyncState> get() = _syncState
    override suspend fun sync() = Unit
    override suspend fun retryExhaustedRecords() = Unit
}

class RegisterHabitUseCaseTest {

    @Test
    fun registersAValidOfflineObservation() = runTest {
        val repo = FakeHabitRepository()
        val id = RegisterHabitUseCase(repo)(
            HabitRecord(type = HabitType.WATER, value = 120.0, note = null, recordedAt = 1L)
        )
        assertEquals(1L, id)
        assertEquals(SyncStatus.PENDING, repo.saved?.syncStatus)
    }

    @Test
    fun requiresANoteForBehaviorObservations() = runTest {
        var threw = false
        try {
            RegisterHabitUseCase(FakeHabitRepository())(
                HabitRecord(type = HabitType.BEHAVIOR, value = null, note = null, recordedAt = 1L)
            )
        } catch (e: IllegalArgumentException) {
            threw = true
        }
        assertEquals(true, threw)
    }
}
