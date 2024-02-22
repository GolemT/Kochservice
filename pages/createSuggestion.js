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

  const[status, setStatus] = useState(null)

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
      const response = await fetch("/api/postSuggestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });
  
      console.log("Response status code:", response.status); // Add this line
  
      if (response.status === 200) {
        setRecipe(<h3 className={styles.statusvalid}>Rezept wurde erfolgreich hochgelade</h3>)
      } else {
        // Handle error here
        setRecipe(<h3 className={styles.statusinvalid}>Rezept konnte nicht hochgeladen werden</h3>)
        console.error("Failed to add recipe");
      }
    } catch (error) {
      setRecipe(<h3 className={styles.statusinvalid}>Ein Fehler ist aufgetreten, versuchen sie es später erneut</h3>)
      console.error("An error occurred:", error);
    }
  };  

  return (
    <Layout>
      <h1>Suggest a new recipe</h1>
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
            Zubereitung:
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
      {status}
      <button type="button" onClick={handleSubmit}>Submit Recipe</button>
    </Layout>
  );
}
