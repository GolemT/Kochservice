import Link from 'next/link';
import styles from '../../styles/Home.module.css'
import React, { useState, useEffect } from 'react';

export function getSearch(input) {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (input) {
        // Make the API request when the component mounts
        fetch(`/api/getSearch?input=${input}`)
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