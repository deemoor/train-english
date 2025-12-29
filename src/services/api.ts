import axios from 'axios';
import { Topic } from '../types';

const API_URL = 'https://api.jsonblob.com/019b6a80-e898-7117-9eb8-15dddf97c8dd';

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
