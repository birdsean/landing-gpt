import {
  APIGatewayEventRequestContextV2,
  APIGatewayProxyEventV2WithRequestContext,
} from 'aws-lambda';
import {
  RequestHandler,
  ResponseStream,
  streamifyResponse,
} from 'lambda-stream';
import { OpenAI } from 'openai';

type ChatMessage = {
  readonly content: string;
  readonly role: 'user' | 'assistant' | 'system';
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemMessage = `You are a landing page chat bot. 
    Your role is to convince the user to sign up for the waitlist.
    The product you will be describing is called "Dog Feeder." 
    It is an AI assistant that will feed your dog for you. 
    All answers must be short and to the point.
    Be sure to mention the potential value propositions of the product.
    Highlight key words and phrases in your answers by surrounding them with angle brackets, like this: <example answer>.
    If a user tries to talk about anything other than the product, politely refuse their request.
    `;

const extractMessages = (
  event: APIGatewayProxyEventV2WithRequestContext<APIGatewayEventRequestContextV2>
): ChatMessage[] => {
  if (typeof event === 'string') {
    // in local dev test, event comes in as string
    return JSON.parse(event);
  } else {
    return JSON.parse(event.body);
  }
};

const handleCompletion: RequestHandler = async (
  event: APIGatewayProxyEventV2WithRequestContext<APIGatewayEventRequestContextV2>,
  responseStream: ResponseStream
) => {
  const messages = extractMessages(event);

  // if first message doesn't have role "system", append system message to messages
  if (messages[0].role !== 'system') {
    messages.unshift({ role: 'system', content: systemMessage });
  }

  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    stream: true,
  });

  responseStream.setContentType('text/plain');

  // eslint-disable-next-line functional/no-let
  let completion = '';

  // eslint-disable-next-line functional/no-loop-statement
  for await (const part of stream) {
    completion += part.choices[0]?.delta?.content || '';
    responseStream.write(part.choices[0]?.delta?.content || '');
  }
  console.log(`Request completed: ${completion}`);
  responseStream.end();
};

export const handler = streamifyResponse(handleCompletion);
