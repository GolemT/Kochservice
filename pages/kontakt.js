import styles from '../styles/Home.module.css';
import Image from 'next/image';
import profile from '../public/pictures/profile.jpg';
import ChatGPT from '../public/pictures/ChatGPT.png';
import Layout from '../components/Layout';
 
export default function Home() {
  return (
    <Layout>      
      <main>
        <h1 className={styles.title}>
            Kontakt!
        </h1>

        <div className={styles.grid}>
          <div className={styles.card}>
            <Image src={profile} />
            <h3>GolemT</h3>
            <code className={styles.description}>Head Developer</code>         
          </div>

          <div className={styles.card}>
            <Image src={profile} />
            <h3>Platina</h3>
            <code className={styles.description}>Head Designer</code>         
          </div>

          <div className={styles.card}>
            <Image src={ChatGPT} 
              height={400}
              width={400}
            />
            <h3>ChatGPT</h3>
            <code className={styles.description}>Code Improver</code>         
          </div>
        </div>
      </main>
    </Layout>
  );
}
