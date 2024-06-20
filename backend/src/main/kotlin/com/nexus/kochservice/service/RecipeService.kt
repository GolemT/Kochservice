package com.nexus.kochservice.service

import com.nexus.kochservice.model.Recipe
import com.nexus.kochservice.repository.RecipeRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class RecipeService(@Autowired private val recipeRepository: RecipeRepository) {

    fun getAllRecipes(): List<Recipe> = recipeRepository.findAll()

    fun createRecipe(recipe: Recipe): Recipe = recipeRepository.save(recipe)

    fun updateRecipe(recipe: Recipe): Recipe = recipeRepository.insert(recipe)
}
