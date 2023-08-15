export interface ChatMessage {
  content: string;
  role: "user" | "assistant" | "system";
}

const API_URL =
  "https://h47icb3agajk2golbckv3ynmxy0ttkdg.lambda-url.us-east-1.on.aws/";

export default class Chat {
  static async getCompletion(messages: ChatMessage[], appendCompletion: (completion: string) => void) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      const decodedChunk = decoder.decode(value, { stream: true });
      appendCompletion(decodedChunk);
    }
  }
}
