import axios from 'axios';
import { Topic } from '../types';

const API_URL = 'https://api.jsonblob.com/019c4159-d258-7d1f-ab56-b781cb1ffe02';

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
