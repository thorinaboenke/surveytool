import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import nextCookies from 'next-cookies';
import { useState } from 'react';
import { isSessionTokenValid } from '../../util/auth';
import {
  getUserBySessionToken,
  getSurveyById,
  getQuestionListBySurveyId,
} from '../../util/database';
import { useRouter } from 'next/router';

export default function Questions(props) {
  const [question, setQuestion] = useState('');
  const [questionList, setQuestionList] = useState(props.questionList);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const survey = props.survey;
  const link = `https://survey-t.herokuapp.com/answers/${survey.surveyId}`;

  async function handleDeleteQuestion(id) {
    const response = await fetch('/api/questions', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId: id,
      }),
    });
    const { success } = await response.json();
    if (success) {
      const updatedQuestionList = questionList.filter(
        (q) => q.questionId !== id,
      );
      setQuestionList(updatedQuestionList);
    }
  }

  async function addQuestion(ques, id) {
    const response = await fetch('/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: ques,
        surveyId: id,
      }),
    });
    const { success } = await response.json();
    if (!success) {
    }
  }

  async function handleDeleteSurvey(id) {
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
    <div>
      <Head>
        <title>Survey Editor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout loggedIn={props.loggedIn} user={props.user}>
        <div className="questions">
          <div className="container">
            <div className="title"> {survey.title}</div>
            <div>
              <Link href={`/results/${survey.surveyId}`}>
                <a>Go to results</a>
              </Link>
            </div>
            <form>
              <label htmlFor="question">New question/category</label>
              <input
                id="question"
                maxLength={60}
                onChange={(e) => setQuestion(e.currentTarget.value)}
                required
              />

              <button
                type="submit"
                onClick={() => addQuestion(question, survey.surveyId)}
                disabled={!question}
              >
                Add question
              </button>
              <div className="error">{errorMessage}</div>
            </form>

            {questionList.map((q) => {
              return (
                <div key={q.questionText}>
                  <div>{q.questionText}</div>
                  <button onClick={() => handleDeleteQuestion(q.questionId)}>
                    Delete
                  </button>
                </div>
              );
            })}
            <div className="instructions">Link for participants:</div>
            <a href={`/answers/${survey.surveyId}`}>{link}</a>
            <button onClick={() => handleDeleteSurvey(survey.surveyId)}>
              Delete this survey
            </button>
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
    const survey = await getSurveyById(Number(context.query.id));
    survey.createdAt = JSON.stringify(survey.createdAt);

    const questionList = await getQuestionListBySurveyId(
      Number(context.query.id),
      token,
    );

    return {
      props: {
        user: user,
        loggedIn: true,
        survey: survey,
        questionList: questionList,
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
