import * as data from '../components/data.json';
import Link from 'next/link';
import styles from '../styles/Home.module.css'

const recipes = require('./data.json')
const recipeArray = Object.values(recipes)

export const recipeIDs = Object.keys(data).filter((key) => key !== "default")
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
    let recipe = null

    for (let key in data){
        if(key==ID){
            recipe = data[key]
            break
        }
    }
    if(recipe){
        return (
            <div className={styles.name}>
                <h2>{recipe.name}</h2>
                <img src={recipe.pic} alt="Bild"></img>
                <h3>{recipe.zutaten}</h3>
                <div>
                    {Object.values(recipe.anleitung).map((step, index) => (
                        <div key={index}>
                            <p>{step.durchführung}</p>
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
        <Link href={`/gericht?ID=${key+1}`} className={styles.card} key={key}>
        <h3>{recipe.name} &rarr;</h3>
        </Link>
    ));
}