import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import userIcon from '../../../assets/images/usericon.png';
import MainLayout from '../../layouts/MainLayout';
import { useRouter } from 'expo-router';

export default function EditEmpAccount({ route }) {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [employee_id, setEmployeeId] = useState('');
    const [email_address, setEmailAddress] = useState('');
    const [address, setAddress] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');

    const router = useRouter();
    const { employeeId } = route.params;

    useEffect(() => {
        const fetchEmployeeData = async () => {
            const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080/api/employees' : 'http://localhost:8080/api/employees';

            try {
                const response = await fetch(`${BASE_URL}/${employeeId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch employee: ${response.status}`);
                }
                const data = await response.json();
                setFirstName(data.first_name);
                setLastName(data.last_name);
                setEmployeeId(data.employee_id);
                setEmailAddress(data.email_address);
                setAddress(data.address);
                setPhoneNumber(data.phone_number);
                setRole(data.role);
                setStatus(data.status);
            } catch (error) {
                console.error('Error fetching employee data:', error);
                Alert.alert('Error', 'Failed to load employee data');
            }
        };

        fetchEmployeeData();
    }, [employeeId]);

    const handleSubmit = async () => {
        if (!first_name || !last_name || !employee_id || !email_address || !address || !phone_number || !role || !status) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const updatedEmployee = {
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

        try {
            const response = await fetch(`${BASE_URL}/${employeeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedEmployee),
            });

            if (!response.ok) {
                throw new Error(`Failed to update employee: ${response.status}`);
            }

            Alert.alert('Success', 'Employee updated successfully!');
            router.push('/screens/manager/EmployeeAccounts');
        } catch (error) {
            console.error('Error updating employee:', error);
            Alert.alert('Error', 'Failed to update employee account');
        }
    };

    return (
        <MainLayout>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.profileHeader}>
                    <Image source={userIcon} style={styles.profileIcon} />
                    <Text style={styles.profileTitle}>Edit Employee</Text>
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
