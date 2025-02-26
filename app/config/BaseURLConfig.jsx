import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android' 

  ? 'http://192.168.1.81:8080/api'

  : 'http://localhost:8080/api';

const BaseURLConfig = () => {
  return BASE_URL;
};

export default BaseURLConfig;
