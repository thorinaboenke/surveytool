import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import { isSessionTokenValid } from '../../util/auth';
import { getUserBySessionToken, getSurveyById } from '../../util/database';
import nextCookies from 'next-cookies';

export default function Results(props) {
  const survey = props.survey;
  const surveyResults = props.surveyResults;

  return (
    <div className={styles.container}>
      <Head>
        <title>Survey Results</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout loggedIn={props.loggedIn} user={props.user}>
        <div>{survey.title}</div>
        {surveyResults.map((result) => {
          return (
            <div key={result.question}>
              <div>{result.question}</div>
              <div>{result.participants} participants</div>
              <div>{result.averageScore} average score</div>
            </div>
          );
        })}
        <div>Link to invite Participants</div>
        <button>Delete this survey.</button>
      </Layout>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { session: token } = nextCookies(context);
  if (await isSessionTokenValid(token)) {
    const user = await getUserBySessionToken(token);
    const survey = await getSurveyById(Number(context.query.id));
    const surveyResults = await getSurveyResultsById(Number(context.query.id));
    return {
      props: {
        user: user,
        loggedIn: true,
        survey: survey,
        surveyResults: surveyResults,
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
