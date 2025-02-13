import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android' 

  ? 'http://10.187.214.148:8080/api'

  : 'http://10.187.214.148:8080/api';

const BaseURLConfig = () => {
  return BASE_URL;
};

export default BaseURLConfig;
