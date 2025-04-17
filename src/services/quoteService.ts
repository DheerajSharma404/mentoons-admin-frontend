import axios from 'axios';

const API_URL = 'https://dummyjson.com/quotes/random';

export const getQuotes = async (): Promise<any> => {
  const response = await axios.get(API_URL);
  return response.data;
};
