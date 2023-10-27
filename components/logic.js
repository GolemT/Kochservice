import Link from 'next/link';
import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react';

export default function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the data from your API
        fetch('http://localhost:3001/api/getRecipeNames')
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
                <img src={obj.pic} alt="Bild" />
                <h3>{obj.title} &rarr;</h3>
                </Link>
            ))}
        </div>
    );
}

// function for /gericht, gets the corresponding recipe frome the database based on the ID given
export function getPageContent(ID){
    const [objectData, setObjectData] = useState(null);

    useEffect(() => {
    // Make the API request when the component mounts
        fetch(`http://localhost:3001/api/getObject?objectId=${ID}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
            throw new Error('Network response was not ok');
            }
        })
        .then((data) => {
            setObjectData(data); // Update objectData with fetched data
        })
        .catch((error) => {
            console.error(error);
        });
    }, [ID]); // Use ID as a dependency to fetch data when it changes
    
    if(objectData){
        return (
            <div className={styles.name}>
                <h2>{objectData.title}</h2>
                <img src={objectData.pic} alt="Bild"/>
                <h3>{objectData.ingredients}</h3>
                <div>
                    {Object.values(objectData.preparation).map((step, index) => (
                        <div key={index}>
                            <p>{step}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
    return (
        <div className={styles.name}>
            <h2>Rezept nicht vorhanden</h2>
        </div>
    )
}

// picks a random number from 1 to var count
// used by the random function
export function randomID() {
    return  (Math.floor(Math.random()* count +1))
}
 

// Defines how many recipes are available in the database
// Should be automatically updated
let count = 4

// function to automatically update the variable "count"
async function getCount() {
    const [data, setData] = useState(null);
  
        const response = await fetch('http://localhost:3001/api/getAmount')
    
        if (!response.ok) {
            throw new Error('Network response was not okay')
        }

        const answer = await response.json()
        count = data.count

        if (isNaN(count)) {
            throw new Error('Invalid count value: ' + count)
        }
  
    useEffect(() => {
      fetchData();
  
      // Schedule API call every hour
      const interval = setInterval(() => {
        fetchData();
      }, 3600000); // 3600000 milliseconds = 1 hour
  
      // Clear the interval when the component unmounts
      return () => clearInterval(interval);
    }, []);
  
  }