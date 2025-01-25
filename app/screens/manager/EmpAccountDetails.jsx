import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import userIcon from '../../../assets/images/usericon.png'; // Icon from https://www.flaticon.com/free-icon/user_847969?term=user&page=1&position=21&origin=search&related_id=847969
import editIcon from '../../../assets/images/edit.png'; // Icon from https://www.flaticon.com/free-icon/edit_1159633?term=edit&page=1&position=1&origin=search&related_id=1159633
import { useRouter } from 'expo-router';

export default function EmpAccountDetails() {
    const { query } = useRouter();
    const employeeId = query;
    console.log(employeeId);

    //Platform.OS to decide which URL to use when running on an Android/Android emulator vs iOS/web.
    const BASE_URL = Platform.OS === 'android' ? ( 
        'http://10.0.2.2:8080/api/accounts') : //Android Device & Android Studio (Use your personal ipv4 address)
        'http://localhost:8080/api/accounts'; //Computer & iOS

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

        // Fetch employee details
        useEffect(() => {
            const fetchEmployeeDetails = async () => {
                setLoading(true);
                setError(null);
    
                try {
                    const response = await fetch(`${BASE_URL}/${employeeId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch employee details');
                    }
                    const data = await response.json();
                    setEmployee(data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };
    
            if (employeeId) {
                fetchEmployeeDetails();
            }
        }, [employeeId]);
    
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
                    <TouchableOpacity style={styles.editButton} onPress={()=> router.push('/screens/manager/EditEmpAccount')}>
                        <Image source={editIcon} style={styles.editIcon}/>
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
                    <Text style={styles.detailLabel}>Home Address</Text>
                </View>

                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Phone Number</Text>
                </View>

                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Role</Text>
                </View>

                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Status</Text>
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