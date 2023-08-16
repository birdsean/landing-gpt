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
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

type ChatMessage = {
  readonly content: string;
  readonly role: 'user' | 'assistant' | 'system';
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const systemMessage = `You are a landing page chat bot. 
  Your role is to convince the user to sign up for the waitlist.
  The product you will be describing is called "Review Droid." 
  It is an AI assistant that will do a first-pass on a developers Github pull request and leave comments on the code review. 
  All answers must be short and to the point.
  Be sure to mention the value propositions of the product which include (1) saving time, (2) improving code quality, and (3) being a more productive engineer than your peers.
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

const hashMessages = (messages: ChatMessage[]): string => {
  // compress and hash messages to use as key
  const messageString = JSON.stringify(messages);
  let hash = 0;
  for (let i = 0; i < messageString.length; i++) {
    hash = (hash << 5) - hash + messageString.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
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

  const sessionId = event.headers && event.headers['x-session-id'] || 'none';

  const command = new PutCommand({
    TableName: "ChatMessages",
    Item: {
      MessageId: hashMessages(messages),
      SessionId: sessionId,
      Messages: JSON.stringify([...messages, { role: 'assistant', content: completion }]),
      ProductName: "Review Droid",
      CreatedAt: Math.floor(Date.now() / 1000), // unix timestamp in seconds
    },
  });

  const response = await docClient.send(command);

  // detect error
  if (response.$metadata.httpStatusCode !== 200) {
    console.log(`Error saving to DynamoDB: ${response.$metadata.httpStatusCode}, ${response}`);
  }

  console.log(`Request completed: ${completion}`);
  responseStream.end();
};

export const handler = streamifyResponse(handleCompletion);
