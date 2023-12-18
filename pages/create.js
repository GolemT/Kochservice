import Layout from "../components/Layout";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
// import ImageUpload from "../components/imageUpload"

export default function Create() {
  const router = useRouter();

  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: "",
    steps: "",
    pic: "pictures/profile.jpg", // Initialize pic as an empty string
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  const handleImageUpload = (pic) => {
    setRecipe({ ...recipe, pic });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/postRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });
  
      console.log("Response status code:", response.status); // Add this line
  
      if (response.status === 200) {
        const newRecipeData = await response.json();
        console.log("New Recipe Data:", newRecipeData); // Add this line
        const newRecipeID = newRecipeData.recipeID;
        router.push(`/gericht?ID=${newRecipeID}`);
      } else {
        // Handle error here
        console.error("Failed to add recipe");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };  

  return (
    <Layout>
      <h1>Create a new Recipe</h1>
      <div className={styles.grid}>
        <div className={styles.create}>
          <label>
            Name:
            <input
              className={styles.input}
              type="text"
              name="name"
              placeholder="Recipe Name ..."
              value={recipe.name}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className={styles.create}>
          <label>
            Ingredients:
            <textarea
              className={styles.input}
              name="ingredients"
              placeholder="Ingredients ..."
              value={recipe.ingredients}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className={styles.create}>
          <label>
            Schritte als JSON:
            <textarea
              className={styles.input}
              name="steps"
              placeholder="Schritte ..."
              value={recipe.steps}
              onChange={handleInputChange}
            />
          </label>
        </div>
        {/* <div className={styles.create}>
          Upload Image:
          <ImageUpload onImageUpload={handleImageUpload} />
        </div> */}
      </div>
      <button type="button" onClick={handleSubmit}>Submit Recipe</button>
    </Layout>
  );
}
