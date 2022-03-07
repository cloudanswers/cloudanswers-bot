import {
  ApplicationFunction,
  createLambdaFunction,
  createProbot
} from '@probot/adapter-aws-lambda-serverless';
import app from 'src/index';

export const handler = createLambdaFunction(
  app as unknown as ApplicationFunction,
  {
    probot: createProbot()
  }
);
