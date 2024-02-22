import styles from '../styles/Home.module.css';
import { getPageContentSuggestion } from '../app/requests/getPageContentSuggestion.js'
import { useRouter} from 'next/router'
import Layout from '../components/Layout';

export default function Gericht() {
  const router = useRouter()
  const { ID } = router.query
  return (
    <Layout>
      <main>
        <div className={styles.grid}>
          {getPageContentSuggestion(ID)}
        </div>
      </main>
    </Layout>
  );
}
