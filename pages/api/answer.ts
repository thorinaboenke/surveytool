import { NextApiRequest, NextApiResponse } from 'next';
import { addAnswerByQuestionId } from '../../util/database';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    const { questionId, score } = request.body;
    if (!score) {
      return response.status(400).send({
        success: false,
        message: 'please choose a rating',
      });
    }
    const answer = await addAnswerByQuestionId(questionId, score);

    return response.status(200).send({ success: true });
  }
}
