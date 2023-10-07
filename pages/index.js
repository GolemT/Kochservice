import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Gericht from './gericht';
import { randomID, recipeIDs } from '../components/logic' 
 
export default function Home() {
  const num = randomID()
  return (
    <div className={styles.container}>
      <Head>
        <title>Kochservice</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          Willkommen zu  <Link href="/">GolemT's Kochservice!</Link>
        </h1>

        <p className={styles.description}>
          Endlich mal gute Rezepte!
        </p>

        <div className={styles.grid}>
          <Link href="/rezepte" className={styles.card}>
            <h3>Rezepte &rarr;</h3>
            <p>Eine Übersicht aller Rezepte.</p>
          </Link>

          <Link key={recipeIDs} href={`/gericht?ID=${num}`} passHref className={styles.card}>
            <h3>Random &rarr;</h3>
            <p>Finde ein Rezept auf gut glück.</p>
          </Link>

          <Link
            href="/vorschlaege" className={styles.card}>
            <h3>Vorschläge &rarr;</h3>
            <p>Schlage neue Rezepte vor und erweitere unser Sortiment.</p>
          </Link>

          <Link href="/kontakt" className={styles.card}>
            <h3>Kontakt &rarr;</h3>
            <p>
              Unser Impressum sowie alle beteiligten Personen.
            </p>
          </Link>
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
