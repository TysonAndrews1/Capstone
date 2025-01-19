import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image } from 'react-native';
import userIcon from '../../../assets/images/usericon.png'; // Icon from https://www.flaticon.com/free-icon/user_847969?term=user&page=1&position=21&origin=search&related_id=847969
import MainLayout from '../../layouts/MainLayout';

export default function CreateEmpAccount() {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [employee_id, setEmployeeId] = useState('');
    const [email_address, setEmailAddress] = useState('');
    const [address, setAddress] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');

    /* handleInputChange updates the form data whenever the user types in the input fields.
    It will be called when there is an input in any of the fields.*/
    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
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

                {/* Add the save button here, researching the logic behind it for now. */}
            </ScrollView>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
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

    // Add save button styling here
});
