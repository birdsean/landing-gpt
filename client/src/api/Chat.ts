export interface ChatMessage {
    content: string;
    role: 'user' | 'assistant';
}

const API_URL = 'http://localhost:3001/';

export default class Chat {
    static async getCompletion(messages: ChatMessage[]): Promise<string> {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messages)
        });
        const data = await response.json();
        return data.completion;
    }
}