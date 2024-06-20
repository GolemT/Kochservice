package com.nexus.kochservice.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "recipes")
data class Recipe(
    @Id val id: String? = null,
    val title: String,
    val pic: String,
    val ingredients: String,
    val preparation: String,
    val names: List<String>,
    val verified: Boolean
)
