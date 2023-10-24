import * as banana from '../components/data.json';
import Link from 'next/link';
import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react';

const recipes = require('./data.json')
const recipeArray = Object.values(recipes)

export const recipeIDs = Object.keys(banana).filter((key) => key !== "default")
export function randomID(){
    let randomIndex = Math.floor(Math.random() * ((recipeIDs.length)))
    if (recipeIDs[randomIndex]=='default'){
        return 1
    }
    return recipeIDs[randomIndex]
}

function getKey(name) {
    let key = null
    for(let i=0; i<recipes.length; i++) {
        if(recipes[i].name == name){
            key = i
        }
    }
    return recipeIDs[key]
}

export function getPageContent(ID){

    const [objectData, setObjectData] = useState(null);

    useEffect(() => {
    // Make the API request when the component mounts
        fetch(`http://localhost:3001/api/getObject?objectId=${ID}`)
        .then((response) => {
            if (response.ok) {
                console.log("okay")
                return response.json();
            } else {
            throw new Error('Network response was not ok');
            }
        })
        .then((data) => {
            console.log(data)
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

export default function getList(){
    return recipeArray.map((recipe, key) => (
        <Link href={`/gericht?ID=${key+1}`} className={styles.recipecard} key={key}>
        <img src={recipe.pic} alt="Bild"></img>
        <h3>{recipe.title} &rarr;</h3>
        </Link>
    ));
}