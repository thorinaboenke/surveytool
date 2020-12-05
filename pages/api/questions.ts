import { NextApiRequest, NextApiResponse } from 'next';
import { deleteQuestionById, createQuestion } from '../../util/database';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'DELETE') {
    const { questionId } = request.body;
    const token = request.cookies.session;

    const question = await deleteQuestionById(questionId, token);
    if (!question) {
      return response.status(401).send({ success: false });
    }
    return response.status(200).send({ success: true });
  }
  if (request.method === 'POST') {
    const { text, surveyId } = request.body;
    const token = request.cookies.session;
    if (!text) {
      return response.status(401).send({
        success: false,
        errors: [{ message: 'Question cannot be empty' }],
      });
    }
    const question = await createQuestion(text, surveyId, token);
    if (!question) {
      return response.status(401).send({ success: false });
    }
    return response.status(200).send({ success: true });
  }
}
