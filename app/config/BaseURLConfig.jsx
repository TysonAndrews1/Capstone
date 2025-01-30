import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android' 
  ? 'http://10.187.241.206:8080/api'
  : 'http://localhost:8080/api';

const BaseURLConfig = () => {
  return BASE_URL;
};

export default BaseURLConfig;
