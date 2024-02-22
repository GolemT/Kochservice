import styles from '../../styles/Home.module.css'
import React, { useState, useEffect } from 'react';

export function getPageContentSuggestion(ID){
    const [objectData, setObjectData] = useState(null);
  
    useEffect(() => {
    // Make the API request when the component mounts
        fetch(`/api/getSuggestion?objectId=${ID}`)
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
              <h1 className={styles.title}>{objectData.title}</h1>
              <img src={objectData.pic} alt="Bild" className={styles.pic}/>
            </div>    
            <div>
              <h3>{objectData.ingredients}</h3>
              <h4>{objectData.preparation}</h4>
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