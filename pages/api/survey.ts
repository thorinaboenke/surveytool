import { NextApiRequest, NextApiResponse } from 'next';
import { deleteSurveyById, createSurvey } from '../../util/database';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'DELETE') {
    const { surveyId } = request.body;
    const token = request.cookies.session;

    const survey = await deleteSurveyById(surveyId, token);
    if (!survey) {
      return response.status(500).send({ success: false });
    }
    return response.status(200).send({ success: true });
  }
  if (request.method === 'POST') {
    const { title } = request.body;
    const token = request.cookies.session;
    if (!title) {
      return response.status(401).send({
        success: false,
        errors: [{ message: 'Survey needs a title' }],
      });
    }
    const newSurvey = await createSurvey(title, token);
    if (!newSurvey) {
      return response.status(500).send({ success: false });
    }
    return response.status(200).send({ success: true, newSurvey: newSurvey });
  }
}
