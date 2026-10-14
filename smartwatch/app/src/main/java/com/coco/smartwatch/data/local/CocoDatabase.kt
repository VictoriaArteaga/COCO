package com.coco.smartwatch.data.local

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(entities = [HabitEntity::class], version = 1, exportSchema = true)
abstract class CocoDatabase : RoomDatabase() { abstract fun habitDao(): HabitDao }
