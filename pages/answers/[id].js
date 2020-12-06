import Head from 'next/head';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import { useState, useEffect } from 'react';
import { getSurveyById, getQuestionListBySurveyId } from '../../util/database';
import { useRouter } from 'next/router';
import Question from '../../components/Question';

export default function Results(props) {
  const [questionList, setQuestionList] = useState(props.questionList);
  const [questionDisplayed, setQuestionDisplayed] = useState(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const survey = props.survey;

  useEffect(() => {
    if (questionDisplayed === questionList.length) {
      router.push('/thankyou');
    }
  }, [questionDisplayed, router, questionList.length]);

  async function submitAnswer(id, score) {
    const response = await fetch('/api/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId: id,
        score: score,
      }),
    });
    const { success } = await response.json();
    if (success) {
      const next = questionDisplayed + 1;
      setQuestionDisplayed(next);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Survey-T</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout loggedIn={props.loggedIn} user={props.user}>
        <div className="answers">
          <div className="title">{survey.title}</div>
          <div>
            {' '}
            {questionDisplayed + 1} of {questionList.length}
          </div>
          {questionDisplayed < questionList.length && (
            <Question
              submitAnswer={submitAnswer}
              question={questionList[questionDisplayed]}
              loading={loading}
            />
          )}
        </div>
      </Layout>
    </div>
  );
}

export async function getServerSideProps(context) {
  const survey = await getSurveyById(Number(context.query.id));
  survey.createdAt = JSON.stringify(survey.createdAt);
  const questionList = await getQuestionListBySurveyId(
    Number(context.query.id),
  );
  return {
    props: {
      survey: survey,
      questionList: questionList,
    },
  };
}
