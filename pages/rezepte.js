import styles from '../styles/Home.module.css';
import { RecipeList } from '../components/logic.js'
import Layout from '../components/Layout.js';
 
export default function Home() {
  const recipeList = RecipeList()

  return (
    <Layout>      
      <main>
        <h1 className={styles.title}>
          Rezepte!
        </h1>


        <div className={styles.grid}>
        
          {recipeList}

        </div>
      </main>
    </Layout>
  );
}
