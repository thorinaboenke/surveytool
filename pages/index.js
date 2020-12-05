import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import { isSessionTokenValid } from '../util/auth';
import { getUserBySessionToken } from '../util/database';
import nextCookies from 'next-cookies';

export default function Home(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>SurveyTool</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout loggedIn={props.loggedIn} user={props.user}>
        <div>A tool to create surveys and collect feedback</div>
        <div className="instructions">
          <Link href="/signup">
            <a>Create an account </a>
          </Link>
          to start with with your first survey
        </div>
      </Layout>
    </div>
  );
}

export async function getServerSideProps(context) {
  let { session: token } = nextCookies(context);
  const loggedIn = (await isSessionTokenValid(token)) || null;
  const user = (await getUserBySessionToken(token)) || null;
  if (typeof token === 'undefined') {
    token = null;
  }

  return { props: { loggedIn: loggedIn, user: user } };
}
