import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import userIcon from '../../../assets/images/usericon.png'; // Icon from https://www.flaticon.com/free-icon/user_847969?term=user&page=1&position=21&origin=search&related_id=847969
import editIcon from '../../../assets/images/edit.png'; // Icon from https://www.flaticon.com/free-icon/edit_1159633?term=edit&page=1&position=1&origin=search&related_id=1159633
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EmpAccountDetails() {
    const [accountId, setAccountId] = useState(null); // accountId is not being used, but we will keep this to retrieve the accountId from AsyncStorage by using setAccountId.
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    //Platform.OS to decide which URL to use when running on an Android/Android emulator vs iOS/web.
    const BASE_URL = Platform.OS === 'android' ? ( 
        'http://10.0.2.2:8080/api/accounts') : //Android Device & Android Studio (Use your personal ipv4 address)
        'http://localhost:8080/api/accounts'; //Computer & iOS

    // Fetch employee details
    useEffect(() => {
        const fetchStoredAccountIdAndDetails = async () => {
            try {
                // Retrieve the accountId from AsyncStorage, taken from ChatGPT
                const storedAccountId = await AsyncStorage.getItem('selectedAccountId');
                if (storedAccountId) {
                    setAccountId(storedAccountId);
                    console.log('Retrieved Account ID:', storedAccountId);
    
                    // Fetch employee details using the retrieved accountId
                    const response = await fetch(`${BASE_URL}/${storedAccountId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch employee details');
                    }
                    
                    const data = await response.json();
                    console.log('Employee Data:', data);
                    setEmployee({
                        ...data,
                        status: data.status === 1 || data.status === "1" || data.status === true // This will make the status display as "Active" if the status is 1 or true, and "Inactive" if the status is 0 or false.
                            ? "Active" 
                            : "Inactive",
                    });

                } else {
                    console.error('No Account ID found in storage');
                }
            } catch (error) {
                console.error('Error:', error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchStoredAccountIdAndDetails(); // calling fetchStoredAccountIdAndDetails will load the data
    }, []);
    
    
    if (loading) {
        return (
            <View style={styles.errorContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    if (!employee) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Employee not found</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={userIcon} style={styles.profileIcon} />
                    <View style={styles.profileTextContainer}>
                        <Text style={styles.profileName}>{employee.firstName} {employee.lastName}</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.editButton} 
                        onPress={async () => {
                            try {
                                await AsyncStorage.setItem('selectedAccountId', employee.accountId.toString()); // Save accountId in AsyncStorage
                                router.push('/screens/manager/EditEmpAccount'); // Navigate to the edit screen
                            } catch (error) {
                                console.error('Error saving account ID to AsyncStorage:', error);
                                Alert.alert('Error', 'Failed to navigate to the edit screen.');
                            }
                        }}>
                        <Image source={editIcon} style={styles.editIcon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>First Name: {employee.firstName}</Text>
                </View>

                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Last Name: {employee.lastName}</Text>
                </View>

                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Employee ID: {employee.employeeId}</Text>
                </View>

                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Email Address: {employee.email}</Text>
                </View>

                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Home Address: {employee.address}</Text>
                </View>

                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Phone Number: {employee.phoneNumber}</Text>
                </View>

                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Role: {employee.role}</Text>
                </View>

                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Status: {employee.status}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6F2FA',
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
    },

    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
        backgroundColor: '#D9D9D9',
    },

    profileIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 8,
    },

    profileTextContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 16,
    },

    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },

    editIcon: {
        width: 24,
        height: 24,
        tintColor: '#3F6D89',
    },

    editButton: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },

    editIcon: {
        width: 23,
        height: 23,
        tintColor: '#3F6D89',
    },

    detailCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
    },

    detailLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 4,
    },

    detailValue: {
        fontSize: 16,
        color: '#333',
    },
});