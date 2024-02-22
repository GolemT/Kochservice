import Link from 'next/link';
import styles from '../../styles/Home.module.css'
import React, { useState, useEffect } from 'react';

export function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the data from your API
        fetch('/api/getRecipeNames')
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                setRecipes(data); // Update the state with fetched data
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            {recipes.map((obj) => (
                <Link key={obj.ID} href={`/gericht?ID=${obj.ID}`} className={styles.recipecard}>
                <img src={obj.pic} alt="Bild" className={styles.listpic}/>
                <h3>{obj.title} &rarr;</h3>
                </Link>
            ))}
        </div>
    );
}