package com.coco.smartwatch.data.remote.dto

data class LoginDto(val email: String, val password: String)
data class AuthResultDto(val token: String, val user: AuthUserDto)
data class AuthUserDto(val id: String, val email: String, val displayName: String?)
data class RabbitDto(val id: String, val name: String, val active: Boolean, val createdAt: String)
