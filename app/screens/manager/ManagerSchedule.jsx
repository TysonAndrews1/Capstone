import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, {useState} from 'react';
import MainLayout from '../../layouts/MainLayout';
import CalendarComponent from '../../components/Calender';

const ManagerSchedule = () => {
    // State to track the selected date
    const [selectedDate, setSelectedDate] = useState(null);

    /**
     *Handles the date selection from the calendar.
     Updates the 'selectedDate' state with the selected date in UTC format.
     * @param {Date} date - The selected date.
     */
    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    return (
    <MainLayout>
        <View style={ styles.container }>
        
        {/* Calendar Component */}
        <CalendarComponent onDateSelect={handleDateSelect} />
            
            {/* Conditional UI based on whether a date is selected */}
            <View style={styles.textAndButton}>
                {!selectedDate ? (
                    // If no date is selected, show this UI
                    <>
                        <Text style={styles.infoText}>Select a date to manage</Text>
                        <Text style={styles.infoText}>OR</Text>
                        <Text style={styles.infoText}>Select an employee to view schedules</Text>
                        <TouchableOpacity style={styles.infoButton}>
                            <Text style={styles.infoButtonText}>Select Employee</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    // If a date is selected, show this UI
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
        marginTop: 20,
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
