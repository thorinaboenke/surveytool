import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import { isSessionTokenValid } from '../util/auth';
import { getUserBySessionToken, getSurveysByToken } from '../util/database';
import nextCookies from 'next-cookies';

export default function Dashboard(props) {
  const surveys = props.surveys;
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateSurvey = async (newTitle) => {
    if (!newTitle) {
      return;
    }
    const response = await fetch('/api/survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newTitle,
      }),
    });
    const { success, newSurvey } = await response.json();

    if (!success) {
      setErrorMessage('Creating a Survey failed');
    } else {
      setMessage('Survey created');
      if (success) router.push(`/questions/${newSurvey.surveyId}`);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>SurveyTool</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout loggedIn={props.loggedIn} user={props.user}>
        <div className="dashboard">
          <div className="container">
            <div>
              Enter the title for a new Survey. Click 'Create survey'. Define a
              set of questions. Send the link to participants. Participants can
              give a rating between 1 (worst rating/don't agree at all) and 5
              (best rating/agree completely). Click 'Edit' to add or remove
              questions and 'Go to results' to see the number of participants
              and average ratings.
            </div>
            <div>Logged in as: {props.user.username}</div>
            {surveys.length === 1 && (
              <div>You have {surveys.length} survey</div>
            )}
            {surveys.length !== 1 && (
              <div>You have {surveys.length} surveys</div>
            )}
            <form>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                maxLength={60}
                onChange={(e) => setTitle(e.currentTarget.value)}
                required
              />

              <button type="submit" onClick={() => handleCreateSurvey(title)}>
                Create survey.
              </button>
              {message && <div>{message}</div>}
              {errorMessage && <div>{errorMessage}</div>}
            </form>
            <div className="surveycontainer">
              {surveys.map((survey) => {
                return (
                  <div key={survey.title}>
                    <div className="title">{survey.title}</div>{' '}
                    <div>
                      <Link href={`/questions/${survey.surveyId}`}>
                        <a>Edit</a>
                      </Link>
                    </div>
                    <div>
                      <Link href={`/results/${survey.surveyId}`}>
                        <a>Go to results</a>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
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
