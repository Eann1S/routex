/* eslint-disable */
import axios from 'axios';

module.exports = async () => {
  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 3000;
  const baseUrl = `http://${host}:${port}`;

  axios.defaults.baseURL = baseUrl;
  axios.defaults.validateStatus = () => true;
};
