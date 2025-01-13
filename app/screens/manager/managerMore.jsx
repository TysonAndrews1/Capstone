import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useRouter } from "expo-router";


const ManagerMore = () => {

  const router = useRouter();

  return (
    <MainLayout>
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Text style={styles.searchText}>Search</Text>
          <Image source={require('../../../assets/images/search.png')} style={{ width: 24, height: 24}} />
        </View>
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Manage Employee Schedule</Text>
        </TouchableOpacity>        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>View Employee Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=> router.push('/screens/manager/ManageEvents')}>
          <Text style={styles.text}>Manage Events</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Manage Employee Accounts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Employee Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Push Schedule Notification</Text>
        </TouchableOpacity>
      </View>
    </MainLayout>
  );
};

export default ManagerMore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#E6F2FA',
    width: '90%',
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#000',
  },
  searchContainer: {
    marginTop: 15, 
    alignItems: 'center', // 가운데 정렬
  },
  searchBox: {
    flexDirection: 'row', // 가로 정렬
    alignItems: 'center', // 세로 중앙 정렬
    backgroundColor: '#E0E0E0', // 배경색
    borderRadius: 25, // 둥근 테두리
    paddingVertical: 8, // 상하 패딩
    paddingHorizontal: 12, // 좌우 패딩
    width: '90%', // 화면 너비의 90% 차지
  },
  searchText: {
    flex: 1, // 텍스트 영역 확장
    fontSize: 16, // 텍스트 크기
    color: '#757575', // 텍스트 색상
  },
});