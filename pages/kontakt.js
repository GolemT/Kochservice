import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Image from 'next/image';
import profile from '../public/pictures/profile.jpg';
import ChatGPT from '../public/pictures/ChatGPT.png';
 
export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Kochservice</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Link href="/">GolemT's Kochservice!</Link>
      
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

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
        </a>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
