export interface ChatMessage {
  content: string;
  role: "user" | "assistant";
}

const API_URL =
  "https://z32hkpspq7yk7rswz4axofmvw40ckvgs.lambda-url.us-east-1.on.aws/";

export default class Chat {
  static async getCompletion(messages: ChatMessage[]): Promise<string> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
      body: JSON.stringify(messages),
    });
    const data = await response.json();
    return data.completion;
  }
}
