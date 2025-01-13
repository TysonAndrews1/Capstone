import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import CalendarComponent from '../../components/Calender';

const ManagerSchedule = () => {
    const handleDateSelect = (date) => {
        console.log("Selected Date:", date);
    };

  return (
    <MainLayout>
        <View style={{ flex: 1 }}>
            <CalendarComponent onDateSelect={handleDateSelect} />
        </View>
        <View>
            <Text>Select a date to manage</Text>
            <Text>OR</Text>
            <Text>Select an employee to view schedules</Text>
            <Pressable>
                <Text>Select Employee</Text>
            </Pressable>
        </View>
    </MainLayout>
  );
};

export default ManagerSchedule;

const styles = StyleSheet.create({})