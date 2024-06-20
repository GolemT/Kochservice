package com.nexus.kochservice.controller

import com.nexus.kochservice.model.Recipe
import com.nexus.kochservice.service.RecipeService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.repository.Update
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/recipes")
class RecipeController(@Autowired private val recipeService: RecipeService) {

    @GetMapping
    fun getAllRecipes(): List<Recipe> = recipeService.getAllRecipes()

    @PostMapping
    fun createRecipe(@RequestBody recipe: Recipe): Recipe = recipeService.createRecipe(recipe)

    @PatchMapping
    fun updateRecipe(@RequestBody recipe: Recipe): Recipe = recipeService.updateRecipe(recipe)
}
