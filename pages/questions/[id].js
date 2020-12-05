import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import nextCookies from 'next-cookies';
import { useState } from 'react';
import { isSessionTokenValid } from '../../util/auth';
import {
  getUserBySessionToken,
  getSurveyById,
  getQuestionListBySurveyId,
} from '../../util/database';
import { useRouter } from 'next/router';

export default function Results(props) {
  const [question, setQuestion] = useState('');
  const [questionList, setQuestionList] = useState(props.questionList);
  const router = useRouter();
  const survey = props.survey;
  const surveyResults = props.surveyResults;
  const link = `www.http://localhost:3000/answers/${survey.surveyId}`;

  async function handleDelete(id) {
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
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Survey Editor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout loggedIn={props.loggedIn} user={props.user}>
        <div>{survey.title}</div>
        <form>
          <label htmlFor="question">Question/Category</label>
          <input
            id="question"
            maxLength={60}
            onChange={(e) => setQuestion(e.currentTarget.value)}
            required
          />

          <button
            type="submit"
            onClick={() => addQuestion(question, survey.surveyId)}
          >
            Add question
          </button>
        </form>

        {questionList.map((q) => {
          return (
            <div key={q.questionText}>
              <div>{q.questionText}</div>
              <button onClick={() => handleDelete(q.questionId)}>
                Delete this question.
              </button>
            </div>
          );
        })}
        <a href={`/answers/${survey.surveyId}`}>{link}</a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(link);
          }}
        >
          Copy link to clipboard
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

    const questionList = await getQuestionListBySurveyId(
      Number(context.query.id),
      token,
    );
    console.log(questionList);

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
