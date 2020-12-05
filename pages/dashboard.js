import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import { isSessionTokenValid } from '../util/auth';
import { getUserBySessionToken, getSurveysByToken } from '../util/database';
import nextCookies from 'next-cookies';

export default function Dasboard(props) {
  const surveys = props.surveys;

  return (
    <div className={styles.container}>
      <Head>
        <title>SurveyTool</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout loggedIn={props.loggedIn} user={props.user}>
        <div>
          How it works: Define a set of questions, save the survey and receive a
          link that you can publish or send to participants. Participants can
          give a rating between 1 (worst rating/don't agree at all) and 5 (best
          rating/ agree completely).
        </div>
        {surveys.length === 1 && <div>You have {surveys.length} survey</div>}
        {surveys.length !== 1 && <div>You have {surveys.length} surveys</div>}
        {surveys.map((survey) => {
          return (
            <div key={survey.title}>
              <div>{survey.title}</div>{' '}
              <Link href={`/results/${survey.surveyId}`}>
                <a>Go to results</a>
              </Link>
            </div>
          );
        })}
        <button>Create a survey.</button>
      </Layout>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { session: token } = nextCookies(context);
  if (await isSessionTokenValid(token)) {
    const user = await getUserBySessionToken(token);
    const surveys = await getSurveysByToken(token);
    return {
      props: {
        user: user,
        loggedIn: true,
        surveys: surveys,
      },
    };
  }
  return {
    redirect: {
      destination: '/login?returnTo=/dashboard',
      permanent: false,
    },
  };
}
