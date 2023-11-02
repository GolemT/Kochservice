import Link from 'next/link';
import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react';

export function RecipeList() {
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
                <img src={obj.pic} alt="Bild" className={styles.listpic}/>
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
            data.preparation = JSON.parse(data.preparation)
            setObjectData(data); // Update objectData with fetched data
        })
        .catch((error) => {
            console.error(error);
        });
    }, [ID]); // Use ID as a dependency to fetch data when it changes
    
    if (objectData) {
        return (
          <document>
            <div className={styles.name}>
              <h2>{objectData.title}</h2>
              <img src={objectData.pic} alt="Bild" className={styles.pic}/>
            </div>    
            <div>
              <h3>{objectData.ingredients}</h3>
              {/* Map through the preparation steps and display each one in a separate block */}
              {Object.entries(objectData.preparation).map(([step, description]) => (
                <div key={step}>
                  <h4>{step}</h4>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </document>
        );
    }
    return (
        <div className={styles.name}>
            <h2>Rezept nicht vorhanden</h2>
        </div>
    );
}

// picks a random number from 1 to var count
// used by the random function
export function randomID() {
    return  (Math.floor(Math.random()* count +1))
}

export function getSearch(input) {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (input) {
        // Make the API request when the component mounts
        fetch(`http://localhost:3001/api/getSearch?input=${input}`)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Network response was not ok');
            }
          })
          .then((data) => {
            setContent(data);
            setLoading(false);
          })
          .catch((error) => {
            setError(error);
            setLoading(false);
          });
      }
    }, [input]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Keine Rezepte gefunden :(</div>;
    }
  
    return (
      <div>
        {content.map((obj) => (
          <Link key={obj.ID} href={`/gericht?ID=${obj.ID}`} className={styles.recipecard}>
            <img src={obj.pic} className={styles.listpic} alt="Bild" />
            <h3>{obj.title} &rarr;</h3>
          </Link>
        ))}
      </div>
    );
  }

// Defines how many recipes are available in the database
// Should be automatically updated
let count = 5

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