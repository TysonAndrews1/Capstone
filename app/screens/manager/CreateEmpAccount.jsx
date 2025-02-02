import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import userIcon from '../../../assets/images/usericon.png'; // Icon from https://www.flaticon.com/free-icon/user_847969?term=user&page=1&position=21&origin=search&related_id=847969
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import BaseURLConfig from '../../config/BaseURLConfig';

export default function CreateEmpAccount() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [email, setEmailAddress] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');
    const BASE_URL = BaseURLConfig();

    const router = useRouter();

    const handleSubmit = () => {
        if (!firstName || !lastName || !employeeId || !email || !address || !phoneNumber || !role || !status) {
            Alert.alert("Error", "Please fill in all fields");
            return;
    }

    // Format the first name, last name, and role to have the first letter capitalized and the rest lowercase
    const formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    const formattedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
    const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

    // Format email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // CODE REFERENCE: https://mailtrap.io/blog/javascript-email-validation/
    if (!emailRegex.test(email)) {
        Alert.alert("Error", "Please enter a valid email address");
        return;
    }

    // Format phone number to only be numbers
    const numericPhone = phoneNumber.replace(/\D/g, ""); // CODE REFERENCE: https://stackoverflow.com/questions/9309278/javascript-regex-replace-all-characters-other-than-numbers removes everything that is not a number

    const newEmployee = { // Creates a new employee object that holds all the following details
        firstName: formattedFirstName,
        lastName: formattedLastName,
        employeeId,
        email,
        address,
        phoneNumber: numericPhone,
        role: formattedRole,
        status: status === '1'? 'ACTIVE' : 'INACTIVE' // Condition if the status is 1 (active in the Picker), the employee is active, otherwise they are inactive
    };

    fetch(`${BASE_URL}/accounts/add-employee`, { // Sends to the API endpoint
        method: 'POST', // This is a POST request to create a new employee account for the database in JSON format
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee),
    })
    .then(async (response) => {
        const text = await response.text(); // Read raw response as text
        console.log("API Response:", text); // Log response to see what’s returned
        return (text); // Return the response from the API
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
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View>
                    <View style={styles.header}>
                        <Image source={userIcon} style={styles.profileIcon} />
                        <View style={styles.profileTextContainer}>
                            <Text style={styles.profileName}>Employee Name</Text>
                        </View>
                    </View>
    
                    <View style={styles.detailCard}>
                        <Text style={styles.detailLabel}>First Name</Text>
                        <TextInput
                            style={styles.textInput}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="Enter first name"
                        />
                    </View>
    
                    <View style={styles.detailCard}>
                        <Text style={styles.detailLabel}>Last Name</Text>
                        <TextInput
                            style={styles.textInput}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Enter last name"
                        />
                    </View>
    
                    <View style={styles.detailCard}>
                        <Text style={styles.detailLabel}>Employee ID</Text>
                        <TextInput
                            style={styles.textInput}
                            value={employeeId}
                            onChangeText={setEmployeeId}
                            placeholder="Enter employee ID (6 digits)"
                            keyboardType="numeric" // This will ensure it is a number
                        />
                    </View>
    
                    <View style={styles.detailCard}>
                        <Text style={styles.detailLabel}>Email Address</Text>
                        <TextInput
                            style={styles.textInput}
                            value={email}
                            onChangeText={setEmailAddress}
                            placeholder="Enter email address"
                        />
                    </View>
    
                    <View style={styles.detailCard}>
                        <Text style={styles.detailLabel}>Home Address</Text>
                        <TextInput
                            style={styles.textInput}
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Enter home address"
                        />
                    </View>
    
                    <View style={styles.detailCard}>
                        <Text style={styles.detailLabel}>Phone Number</Text>
                        <TextInput
                            style={styles.textInput}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder="Enter phone number"
                            keyboardType="phone-pad" // This will bring up the phone number keyboard on mobile devices
                        />
                    </View>
    
                    <View style={styles.detailCard}>
                        <Text style={styles.detailLabel}>Role</Text>
                        <TextInput
                            style={styles.textInput}
                            value={role}
                            onChangeText={setRole}
                            placeholder="Enter role"
                        />
                    </View>
    
                    <View style={styles.detailCard}>
                        <Text style={styles.detailLabel}>Status</Text>
                        <Picker
                            selectedValue={status}
                            onValueChange={(itemValue) => setStatus(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select Status" value="" />
                            <Picker.Item label="Active" value="1" />
                            <Picker.Item label="Inactive" value="0" />
                    </Picker>
                </View>
    
                    <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                        <Text style={styles.saveButtonText}>Create Employee Account</Text>
                    </TouchableOpacity>
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

        picker: {
            height: 70,
            color: '#333',
            borderColor: '#3F6D89',
            borderWidth: 1,
            borderRadius: 10,
        },
    
        saveButton: {
            backgroundColor: '#3F6D89',
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 10,
            alignItems: 'center',
            marginTop: 20,
        },
    
        saveButtonText: {
            fontSize: 16,
            color: '#fff',
            fontWeight: 'bold',
        },
});
