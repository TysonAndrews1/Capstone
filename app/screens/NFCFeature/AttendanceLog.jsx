// Reference for formatting date and time: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseURLConfig from '../../config/BaseURLConfig';
import MainLayout from '../../layouts/MainLayout';

const AttendanceLog = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accountId, setAccountId] = useState(null);
    const BASE_URL = BaseURLConfig();

    useEffect(() => {
        const fetchAccountId = async () => { // Fetch the stored Account ID from AsyncStorage
            try {
                const storedAccountId = await AsyncStorage.getItem('selectedAccountId');
                if (storedAccountId) {
                    setAccountId(storedAccountId);
                    fetchAttendanceRecords(storedAccountId);
                } else {
                    console.error('No Account ID found in storage');
                    Alert.alert('Error', 'No Account ID found.');
                }
            } catch (error) {
                console.error('Error retrieving Account ID:', error);
            }
        };

        fetchAccountId();
    }, []);

    const fetchAttendanceRecords = async (accountId) => { // Fetch the attendance records for the selected Account ID
        try {
            console.log(`Fetching Attendance Logs from: ${BASE_URL}/attendance/logs?account_id=${accountId}`);
    
            const response = await fetch(`${BASE_URL}/attendance/logs?account_id=${accountId}`);
            const data = await response.json();
            console.log("Raw Attendance Log Data:", JSON.stringify(data, null, 2));
    
            if (response.ok) {
                setAttendanceRecords(data);
            } else {
                Alert.alert('Error', data.message || 'Failed to fetch attendance records.');
            }
        } catch (error) {
            console.warn('Error fetching attendance records:', error);
        } finally {
            setLoading(false);
        }
    };    

    const formatDateTime = (dateTime) => { // Format the date and time for display
        if (!dateTime || dateTime === "null") return 'N/A';
    
        const date = new Date(dateTime);
        
        if (isNaN(date.getTime())) return 'Invalid Date'; // Check if the date is valid
    
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };    

    return (
        <MainLayout>
            <View style={styles.container}>
                <Text style={styles.header}>Attendance Log</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#007AFF" />
                ) : (
                    <ScrollView style={styles.scrollContainer}>
                        {attendanceRecords.length === 0 ? (
                            <Text style={styles.emptyMessage}>No attendance records found.</Text>
                        ) : (
                            attendanceRecords.map((item, index) => (
                                <View key={item.id || index} style={styles.recordCard}>
                                    <Text style={styles.recordText}>Clock In: {formatDateTime(item.clock_in_time)}</Text>
                                    <Text style={styles.recordText}>
                                        Clock Out: {item.clock_out_time ? formatDateTime(item.clock_out_time) : 'Still Clocked In'}
                                    </Text>
                                </View>
                            ))
                        )}
                    </ScrollView>
                )}
            </View>
        </MainLayout>
    );
};

export default AttendanceLog;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#EEF2F3',
    },

    scrollContainer: {
        flexGrow: 1,
    },

    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#3f6d89',
    },

    recordCard: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },

    recordText: {
        fontSize: 16,
        color: '#333',
    },

    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 20,
    },
});
