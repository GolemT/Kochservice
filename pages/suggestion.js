import styles from '../styles/Home.module.css';
import Layout from '../components/Layout.js';
import { SuggestionList } from '../app/requests/SuggestionList.js';
 
export default function Home() {
  const suggestionList = SuggestionList()

  return (
    <Layout>      
      <main>
        <h1 className={styles.title}>
          Vorschläge!
        </h1>


        <div className={styles.grid}>
        
          {suggestionList}

        </div>
      </main>
    </Layout>
  );
}
