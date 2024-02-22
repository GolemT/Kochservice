import styles from '../styles/Home.module.css';
import { getSearch }  from '../app/requests/getSearch.js'
import { useRouter } from 'next/router';
import Layout from '../components/Layout.js';


export default function search(){
    const router = useRouter();
    const { input } = router.query;

    const recipes = getSearch(input)

    return (
        <Layout>
          <main>
            <h1 className={styles.title}>
              Rezepte mit '{input}'
            </h1>
    
    
            <div className={styles.grid}>
            
               {recipes}
    
            </div>
          </main>
        </Layout>
      );
}