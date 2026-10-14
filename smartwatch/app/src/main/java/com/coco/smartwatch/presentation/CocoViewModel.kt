package com.coco.smartwatch.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.coco.smartwatch.domain.model.HabitRecord
import com.coco.smartwatch.domain.model.HabitType
import com.coco.smartwatch.domain.usecase.GetHabitHistoryUseCase
import com.coco.smartwatch.domain.usecase.RegisterHabitUseCase
import com.coco.smartwatch.domain.usecase.UndoHabitUseCase
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class CocoViewModel(private val register: RegisterHabitUseCase, private val undo: UndoHabitUseCase, history: GetHabitHistoryUseCase) : ViewModel() {
    val records = history().stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    private val _message = MutableStateFlow<String?>(null)
    val message = _message.asStateFlow()
    private val _lastSavedId = MutableStateFlow<Long?>(null)
    val lastSavedId = _lastSavedId.asStateFlow()
    fun save(type: HabitType, value: Double?, note: String?) = viewModelScope.launch {
        runCatching { register(HabitRecord(type = type, value = value, note = note, recordedAt = System.currentTimeMillis())) }
            .onSuccess { id ->
                _lastSavedId.value = id; _message.value = "Registro guardado. ${type.label}."
                delay(5_000)
                if (_lastSavedId.value == id) _lastSavedId.value = null
            }
            .onFailure { _message.value = it.message ?: "No pudimos guardar el registro. Inténtalo de nuevo." }
    }
    fun undoLast() = viewModelScope.launch { _lastSavedId.value?.let { undo(it); _lastSavedId.value = null; _message.value = "Registro deshecho." } }
}
