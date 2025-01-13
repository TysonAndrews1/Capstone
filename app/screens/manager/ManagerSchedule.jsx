import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, {useState} from 'react';
import MainLayout from '../../layouts/MainLayout';
import CalendarComponent from '../../components/Calender';

const ManagerSchedule = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateSelect = (date) => {
        console.log("Selected Date (UTC):", date); // 디버깅용 로그
        setSelectedDate(date); // 선택된 날짜 업데이트 (UTC 그대로 저장)
    };

    return (
    <MainLayout>
        <View style={ styles.container }>
   
        <CalendarComponent onDateSelect={handleDateSelect} />
            
            <View style={styles.textAndButton}>
                {!selectedDate ? (
                    <>
                        <Text style={styles.infoText}>Select a date to manage</Text>
                        <Text style={styles.infoText}>OR</Text>
                        <Text style={styles.infoText}>Select an employee to view schedules</Text>
                        <TouchableOpacity style={styles.infoButton}>
                            <Text style={styles.infoButtonText}>Select Employee</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity style={styles.infoButton}>
                        <Text style={styles.infoButtonText}>Add Shift</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.infoButton}>
                        <Text style={styles.infoButtonText}>Update Existing Shift</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    </MainLayout>
    );
};

export default ManagerSchedule;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#ffffff',
        width: '100%',
        alignItems: 'center',
    },
    textAndButton: {
        marginTop: 20, // Add space between calendar and text/buttons
        width: '100%',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
        color: '#F4A261',
    },
    infoButton: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#E6F2FA',
        width: '90%',
        marginVertical: 8,
        alignItems: 'center',
    },
    infoButtonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#000',
    },
});