import styles from '../styles/Home.module.css';
import Layout from '../components/Layout';
 
export default function Home() {
  return (
    <Layout>
      <main>
        <h1 className={styles.title}>
          Vorschläge!
        </h1>
      </main>
    </Layout>
  );
}
