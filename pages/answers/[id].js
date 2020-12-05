import Head from 'next/head';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import { useState, useEffect } from 'react';
import { getSurveyById, getQuestionListBySurveyId } from '../../util/database';
import { useRouter } from 'next/router';

export default function Results(props) {
  const [questionList, setQuestionList] = useState(props.questionList);
  const [questionDisplayed, setQuestionDisplayed] = useState(1);
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

  function Question(props) {
    const { question, submitAnswer, loading } = props;
    const [score, setScore] = useState('');
    const scores = [1, 2, 3, 4, 5];

    return (
      <div key={question.questionText}>
        <div>{question.questionText}</div>
        <label>
          <input
            type="radio"
            name="rating"
            id="1"
            value={1}
            onChange={(e) => setScore(e.currentTarget.value)}
            checked={score == 1}
            disabled={loading}
          />
          <div>1</div>
        </label>
        <label>
          <input
            type="radio"
            name="rating"
            id="2"
            value={2}
            onChange={(e) => setScore(e.currentTarget.value)}
            checked={score == 2}
            disabled={loading}
          />
          <div>2</div>
        </label>
        <label>
          <input
            type="radio"
            name="rating"
            id="3"
            value={3}
            onChange={(e) => setScore(e.currentTarget.value)}
            checked={score == 3}
            disabled={loading}
          />
          <div>3</div>
        </label>
        <label>
          <input
            type="radio"
            name="rating"
            id="4"
            value={4}
            onChange={(e) => setScore(e.currentTarget.value)}
            checked={score == 4}
            disabled={loading}
          />
          <div>4</div>
        </label>
        <label>
          <input
            type="radio"
            name="rating"
            id="5"
            value={5}
            onChange={(e) => setScore(e.currentTarget.value)}
            checked={score == 5}
            disabled={loading}
          />
          <div>5</div>
        </label>

        <button onClick={() => submitAnswer(question.questionId, score)}>
          Submit Answer
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Survey Editor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout loggedIn={props.loggedIn} user={props.user}>
        <div>{survey.title}</div>
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
  console.log(questionList);

  return {
    props: {
      survey: survey,
      questionList: questionList,
    },
  };
}
