import axios from 'axios';
import { Topic } from '../types';

const API_URL = 'https://api.jsonblob.com/019b60be-f547-7a84-b9de-79bb6a8106dd';

export const api = {
  getTopics: async (): Promise<Topic[]> => {
    const response = await axios.get<Topic[]>(API_URL);
    return response.data;
  },

  saveTopics: async (topics: Topic[]): Promise<void> => {
    await axios.put(API_URL, topics, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};
