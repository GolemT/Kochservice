package com.nexus.kochservice.repository

import com.nexus.kochservice.model.Recipe
import org.springframework.data.mongodb.repository.MongoRepository

interface RecipeRepository : MongoRepository<Recipe, String> {
    
}
