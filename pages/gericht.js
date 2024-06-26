import styles from '../styles/Home.module.css';
import { getPageContent } from '../app/requests/getPageContent.js'
import { useRouter} from 'next/router'
import Layout from '../components/Layout';

export default function Gericht() {
  const router = useRouter()
  const { ID } = router.query
  return (
    <Layout>
      <main>
        <div className={styles.grid}>
          {getPageContent(ID)}
        </div>
      </main>
    </Layout>
  );
}
