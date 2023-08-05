import { Handler, APIGatewayEvent } from 'aws-lambda';
import { Configuration, OpenAIApi } from 'openai';

type ChatMessage = {
  readonly content: string;
  readonly role: 'user' | 'assistant' | 'system';
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const systemMessage = `You are a landing page chat bot. 
    Your role is to convince the user to sign up for the waitlist.
    The product you will be describing is called "Review Droid." 
    It is an AI assistant that will do a first-pass on a developers Github pull request and leave comments on the code review. 
    All answers must be short and to the point.
    Be sure to mention the value propositions of the product which include (1) saving time, (2) improving code quality, and (3) being a more productive, AI-enabled engineer than your peers.
    Highlight key words and phrases in your answers by surrounding them with angle brackets, like this: <example answer>.
    If a user tries to talk about anything other than the product, politely refuse their request.
    `;

const extractMessages = (event: APIGatewayEvent): readonly ChatMessage[] => {
  if (typeof event === 'string') {
    // in local dev test, event comes in as string
    return JSON.parse(event);
  } else {
    return JSON.parse(event.body);
  }
};

export const handler: Handler = async (event: APIGatewayEvent) => {
  const chatCompletion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemMessage },
      ...extractMessages(event),
    ],
  });
  const { message } = chatCompletion.data.choices[0];

  console.log(`Request succeeded: ${message?.content}`);
  return JSON.stringify({ completion: message?.content });
};
