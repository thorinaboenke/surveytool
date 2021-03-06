import postgres from 'postgres';
import dotenv from 'dotenv';
import camelcaseKeys from 'camelcase-keys';
import extractHerokuDatabaseEnvVars from './extractHerokuDatabaseEnvVars';
import { User, Session, Survey, Result, Question, Answer } from './types';

extractHerokuDatabaseEnvVars();
dotenv.config();

const sql =
  process.env.NODE_ENV === 'production'
    ? // Heroku needs SSL connections but
      // has an "unauthorized" certificate
      // https://devcenter.heroku.com/changelog-items/852
      postgres({ ssl: { rejectUnauthorized: false } })
    : postgres();

export async function getUserByUsername(username: string) {
  const users = await sql<User[]>`
        SELECT * FROM users WHERE username = ${username};
      `;

  return users.map((u: User) => camelcaseKeys(u))[0];
}

export async function registerUser(username: string, passwordHash: string) {
  if (!username || !passwordHash) {
    return;
  }
  const users = await sql<User[]>`
    INSERT INTO users
      (username, password_hash)
    VALUES
      (${username}, ${passwordHash})
    RETURNING *;
  `;
  return users.map((u: User) => camelcaseKeys(u))[0];
}
export async function insertSession(token: string, userId: number) {
  if (!token || !userId) {
    return;
  }
  const sessions = await sql<Session[]>`
    INSERT INTO sessions
      (token, user_id)
    VALUES
      (${token},${userId})
    RETURNING *;
  `;

  return sessions.map((s: Session) => camelcaseKeys(s))[0];
}

export async function getSessionByToken(token: string) {
  if (!token) {
    return;
  }
  const sessions = await sql<Session[]>`
  SELECT FROM sessions WHERE token = ${token};
  `;
  return sessions.map((s: Session) => camelcaseKeys(s))[0];
}

export async function deleteSessionByToken(token: string) {
  await sql`DELETE FROM sessions WHERE token = ${token};`;
}

export async function deleteExpiredSessions() {
  await sql`DELETE FROM sessions WHERE expiry_timestamp < NOW();`;
}

export async function getUserBySessionToken(token: string) {
  if (!token) {
    return;
  }

  const users = await sql<User[]>`SELECT
 users.user_id, users.username
  FROM
  users,
  sessions
  WHERE
  sessions.token = ${token} AND
  sessions.user_id = users.user_id
  ;`;

  return users.map((u: User) => camelcaseKeys(u))[0];
}

export async function deleteUserByUsername(username: string, token: string) {
  if (!token) {
    return;
  }
  const users = await sql<User[]>`
  DELETE FROM users where username = ${username} AND user_id = (SELECT user_id FROM sessions WHERE
  sessions.token = ${token} )
  Returning *;`;
  return users.map((u: User) => camelcaseKeys(u))[0];
}

export async function getSurveysByToken(token: string) {
  if (!token) {
    return [];
  }

  const surveys = await sql<Survey[]>`SELECT
 surveys.survey_id, surveys.title, surveys.created_at
  FROM
  surveys,
  sessions
  WHERE
  sessions.token = ${token} AND
  sessions.user_id = surveys.user_id
  ;`;

  return surveys.map((s: Survey) => camelcaseKeys(s));
}

export async function getSurveyById(id: number) {
  const survey = await sql<Survey[]>`SELECT
 *
  FROM
  surveys
  WHERE
  surveys.survey_id = ${id}
  ;`;

  return survey.map((s: Survey) => camelcaseKeys(s))[0];
}
export async function getSurveyResultsById(id: number) {
  const survey = await sql<Result[]>`SELECT
  question_id, COUNT(score) as participants, AVG(score) as average_score, question_text
  FROM
  answers
  INNER JOIN questions USING (question_id)
  WHERE
  question_id IN (SELECT question_id from questions WHERE questions.survey_id = ${id})
  GROUP BY question_id, question_text
  ;`;

  return survey.map((r: Result) => camelcaseKeys(r));
}

export async function deleteSurveyById(id: number, token: string) {
  if (!token) {
    return;
  }
  const survey = await sql<Survey[]>`
    DELETE FROM surveys where survey_id = ${id} AND user_id = (SELECT user_id FROM sessions WHERE
    sessions.token = ${token} )
    Returning *;`;
  return survey.map((s: Survey) => camelcaseKeys(s))[0];
}

export async function createSurvey(title: string, token: string) {
  if (!token) {
    return;
  }
  const user = await getUserBySessionToken(token);
  if (user) {
    const newSurvey = await sql<Survey[]>`
  INSERT into surveys (title, user_id) VALUES (${title},${user.userId} )
  Returning *;`;
    return newSurvey.map((s: Survey) => camelcaseKeys(s))[0];
  }
}

export async function getQuestionListBySurveyId(id: number) {
  const questions = await sql<Question[]>`
  SELECT * from questions
  WHERE questions.survey_id = ${id}
 ;`;
  return questions.map((s: Question) => camelcaseKeys(s));
}

export async function createQuestion(text: string, id: number, token: string) {
  if (!token) {
    return;
  }
  const question = await sql<Question[]>`
  INSERT into questions (question_text, survey_id) VALUES (${text},${id})
 `;
  return question.map((q: Question) => camelcaseKeys(q))[0];
}

export async function deleteQuestionById(id: number, token: string) {
  if (!token) {
    return;
  }
  const question = await sql<Question[]>`
    DELETE FROM questions where question_id = ${id}
    RETURNING *
    `;
  return question.map((q: Question) => camelcaseKeys(q))[0];
}

export async function addAnswerByQuestionId(id: number, score: number) {
  const answer = await sql<Answer[]>`
  INSERT into answers (score, question_id) VALUES (${score},${id})
 `;
  return answer.map((q: Answer) => camelcaseKeys(q))[0];
}
