import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import nextCookies from 'next-cookies';
import { isSessionTokenValid } from '../util/auth';
import { getUserBySessionToken, getSurveysByToken } from '../util/database';

export default function Dashboard(props) {
  const [surveys, setSurveys] = useState(props.surveys);
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
      setErrorMessage('Creating a survey failed');
    } else {
      setMessage('Survey created');
      setSurveys({ ...surveys, newSurvey });
      console.log(surveys);

      router.push(`/questions/${newSurvey.surveyId}`);
    }
  };
  console.log({ surveys });
  return (
    <div>
      <Head>
        <title>SurveyTool</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout loggedIn={props.loggedIn} user={props.user}>
        <div className="dashboard">
          <div className="container">
            <div>
              Enter the title for a new survey. Click 'Create survey'. 'Edit' to
              add or remove questions. Send the link to participants.
              Participants can give a rating between 1 and 5. 'Go to results' to
              see the number of participants and average ratings.
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
              {surveys && (
                <>
                  {surveys.map((survey) => {
                    return (
                      <div key={survey.title}>
                        <div className="title">{survey.title}</div>{' '}
                        <div>
                          created:{' '}
                          {JSON.parse(survey.createdAt).substring(0, 10)}
                        </div>
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
                </>
              )}
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
    let serializedSurveys = [];
    if (surveys) {
      serializedSurveys = surveys.map((s) => {
        return { ...s, createdAt: JSON.stringify(s.createdAt) };
      });
    }

    return {
      props: {
        user: user,
        loggedIn: true,
        surveys: serializedSurveys,
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
