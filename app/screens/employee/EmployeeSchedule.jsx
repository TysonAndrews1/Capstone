import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MainLayout from '../../layouts/MainLayout';
import CalendarComponent from "../../components/Calender";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

/**
 * This code was generated with assistance from chatGPT.
 * prompt: How to create three touchable sections under header. Then it will show different components.
 */

const MyShiftsScreen = () => {
    return (
        <MainLayout> {/* ✅ 여기에서 감싸야 함 */}
            <View style={styles.screenContainer}>
                <CalendarComponent />
            </View>
        </MainLayout>
    );
};

const ShiftsForGrabsScreen = () => {
    return (
        <MainLayout> {/* ✅ 여기에서 감싸야 함 */}
            <View style={styles.screenContainer}>
                <Text>Shifts for grabs Content</Text>
            </View>
        </MainLayout>
    );
};

const TradesScreen = () => {
    return (
        <MainLayout> {/* ✅ 여기에서 감싸야 함 */}
            <View style={styles.screenContainer}>
                <Text>Trades Shifts</Text>
            </View>
        </MainLayout>
    );
};

const ShiftTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: { backgroundColor: '#3F708F' }, // 헤더 밑 배경색
                tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold', textTransform: 'none' }, // 텍스트 스타일
                tabBarIndicatorStyle: { backgroundColor: '#FFA726', height: 3 }, // 선택된 탭 밑줄 스타일
                tabBarActiveTintColor: '#000', // 선택된 탭 텍스트 색상
                tabBarInactiveTintColor: '#888', // 비활성화된 탭 텍스트 색
            }}
        >
            <Tab.Screen name="My Shifts" component={MyShiftsScreen} />
            <Tab.Screen name="Shifts for Grabs" component={ShiftsForGrabsScreen} />
            <Tab.Screen name="Trades" component={TradesScreen} />
        </Tab.Navigator>
    );
};

const EmployeeSchedule = () => {
    return <ShiftTabs />;
};

export default EmployeeSchedule;

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
});
