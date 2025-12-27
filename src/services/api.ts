import axios from 'axios';
import { Topic } from '../types';

const API_URL = 'https://api.jsonblob.com/019b5b4a-ac9d-734c-a130-600d2cca0b2e';

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
