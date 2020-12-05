import { NextApiRequest, NextApiResponse } from 'next';
import { addAnswerByQuestionId } from '../../util/database';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    const { questionId, score } = request.body;
    if (!score) {
      return response.status(401).send({
        success: false,
        errors: [{ message: 'Score cannot be empty' }],
      });
    }
    const answer = await addAnswerByQuestionId(questionId, score);

    return response.status(200).send({ success: true });
  }
}
