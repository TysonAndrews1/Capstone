import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.0.83:8080/api'
  : 'http://localhost:8080/api';

const BaseURLConfig = () => {
  return BASE_URL;
};

export default BaseURLConfig;
