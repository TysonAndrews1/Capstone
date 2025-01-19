import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import userIcon from '../../../assets/images/usericon.png'; // Icon from https://www.flaticon.com/free-icon/user_847969?term=user&page=1&position=21&origin=search&related_id=847969
import MainLayout from '../../layouts/MainLayout';
import { useRouter } from 'expo-router';

export default function CreateEmpAccount() {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [employee_id, setEmployeeId] = useState('');
    const [email_address, setEmailAddress] = useState('');
    const [address, setAddress] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');

    const router = useRouter();

    const handleSubmit = () => {
        if (!first_name || !last_name || !employee_id || !email_address || !address || !phone_number || !role || !status) {
            Alert.alert("Error", "Please fill in all fields");
            return;
    }

    const newEmployee = { // Creates a new employee object that holds all the following details
        first_name,
        last_name,
        employee_id,
        email_address,
        address,
        phone_number,
        role,
        status,
    };
    
    const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080/api/employees' : 'http://localhost:8080/api/employees';

    fetch(BASE_URL, { // Sends to the API endpoint
        method: 'POST', // This is a POST request to create a new employee account for the database in JSON format
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        Alert.alert("Success", "Employee account created successfully!");
        router.push('/screens/manager/EmployeeAccounts'); // Navigate to the EmployeeAccounts screen after creating the employee account
    })
    .catch((error) => { // Error handling
        console.error('Error creating employee:', error);
        Alert.alert("Error", "Failed to create employee account");
    });
};

    return (
        <MainLayout>
            <ScrollView contentContainerStyle={styles.container}>
                
                <View style={styles.profileHeader}>
                    <Image source={userIcon} style={styles.profileIcon} /> {/* Code partially taken from: https://www.tutorialspoint.com/react_native/react_native_images.htm */}
                    <Text style={styles.profileTitle}>New Employee</Text>
                </View>

                <TextInput
                    style={styles.inputField}
                    placeholder="First Name"
                    value={first_name}
                    onChangeText={setFirstName}
                />
                <TextInput
                    style={styles.inputField}
                    placeholder="Last Name"
                    value={last_name}
                    onChangeText={setLastName}
                />
                <TextInput
                    style={styles.inputField}
                    placeholder="Employee ID"
                    value={employee_id}
                    onChangeText={setEmployeeId}
                />
                <TextInput
                    style={styles.inputField}
                    placeholder="Email Address"
                    value={email_address}
                    onChangeText={setEmailAddress}
                />
                <TextInput
                    style={styles.inputField}
                    placeholder="Home Address"
                    value={address}
                    onChangeText={setAddress}
                />
                <TextInput
                    style={styles.inputField}
                    placeholder="Phone Number"
                    value={phone_number}
                    onChangeText={setPhoneNumber}
                />
                <TextInput
                    style={styles.inputField}
                    placeholder="Role"
                    value={role}
                    onChangeText={setRole}
                />
                <TextInput
                    style={styles.inputField}
                    placeholder="Status"
                    value={status}
                    onChangeText={setStatus}
                />

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { // This is to ensure the content is scrollable in case it overflows the screen
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 50,
    },
    
    container: {
        padding: 16,
        alignItems: 'center',
    },

    profileHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },

    profileIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 8,
    },

    profileInitials: {
        fontSize: 32,
        color: '#3F6D89',
        fontWeight: 'bold',
    },

    profileTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },

    inputField: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12,
        fontSize: 16,
    },

    submitButton: {
        backgroundColor: '#3F6D89',
        padding: 12,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 8,
    },

    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
