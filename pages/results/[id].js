import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import { isSessionTokenValid } from '../../util/auth';
import {
  getUserBySessionToken,
  getSurveyById,
  getSurveyResultsById,
} from '../../util/database';
import nextCookies from 'next-cookies';
import { Router, useRouter } from 'next/router';

export default function Results(props) {
  const router = useRouter();
  const survey = props.survey;
  const surveyResults = props.surveyResults;

  async function handleDelete(id) {
    const response = await fetch('/api/survey', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        surveyId: id,
      }),
    });
    const { success } = await response.json();
    if (success) router.push('/deleted');
  }

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
            <div key={result.questionText}>
              <div>{result.questionText}</div>
              <div>{result.participants} participants</div>
              <div>{result.averageScore.toFixed(2)} average score</div>
            </div>
          );
        })}
        <div>Link to invite Participants</div>
        <button onClick={() => handleDelete(survey.surveyId)}>
          Delete this survey.
        </button>
      </Layout>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { session: token } = nextCookies(context);
  if (await isSessionTokenValid(token)) {
    const user = await getUserBySessionToken(token);
    const survey = await getSurveyById(Number(context.query.id));
    survey.createdAt = JSON.stringify(survey.createdAt);

    const surveyResults = await getSurveyResultsById(Number(context.query.id));
    console.log(surveyResults);

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
