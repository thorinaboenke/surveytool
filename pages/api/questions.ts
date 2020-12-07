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
      return response
        .status(500)
        .send({ success: false, message: 'Question could not be deleted' });
    }
    return response.status(200).send({ success: true });
  }
  if (request.method === 'POST') {
    const { text, surveyId } = request.body;
    const token = request.cookies.session;
    if (!text) {
      return response.status(400).send({
        success: false,
        message: 'Question cannot be empty',
      });
    }
    const question = await createQuestion(text, surveyId, token);
    if (!question) {
      return response
        .status(500)
        .send({ success: false, message: 'Question could not be saved' });
    }
    return response.status(200).send({ success: true });
  }
}
