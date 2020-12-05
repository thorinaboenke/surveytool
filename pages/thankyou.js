import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Thankyou() {
  return (
    <div className={styles.container}>
      <Head>
        <title>SurveyTool - Thank you for participating</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>Thank you for participating!</div>
      <Link href="/signup">
        <a>Click here to make your own survey </a>
      </Link>
    </div>
  );
}
