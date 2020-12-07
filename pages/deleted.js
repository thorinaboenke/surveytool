import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import nextCookies from 'next-cookies';
import { isSessionTokenValid } from '../util/auth';
import { getUserBySessionToken } from '../util/database';

export default function Home(props) {
  return (
    <div>
      <Head>
        <title>SurveyTool</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout loggedIn={props.loggedIn} user={props.user}>
        <div className="deleted flex">
          <div className="container">
            <div>Your survey was deleted</div>
            <Link href="/dashboard">
              <a>Set up another one? </a>
            </Link>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export async function getServerSideProps(context) {
  let { session: token } = nextCookies(context);
  const loggedIn = (await isSessionTokenValid(token)) || null;
  const user = (await getUserBySessionToken(token)) || null;

  return { props: { loggedIn: loggedIn, user: user } };
}
