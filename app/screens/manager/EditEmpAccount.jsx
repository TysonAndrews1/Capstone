import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import userIcon from '../../../assets/images/usericon.png'; // Icon from https://www.flaticon.com/free-icon/user_847969?term=user&page=1&position=21&origin=search&related_id=847969
import { use } from 'react';

// Need to find the logic behind prefilling the fields with the employee's data. This might have to be done when backend is connected to EmployeeAccounts and EmpAccountDetails.

export default function EditEmpAccount({employeeId}) {

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [employee_id, setEmployeeId] = useState('');
    const [email_address, setEmailAddress] = useState('');
    const [address, setAddress] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');
    
    const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080/api/accounts' : 'http://localhost:8080/api/accounts';

    useEffect(() => {
        const fetchEmployeeData = async () => { // This is to fetch the employee data from the backend and database

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
    }, [employeeId]); // This will run the fetchEmployeeData function when the employeeId changes

    const handleSubmit = async () => { // This is to update the employee data in the backend and database, if fields are empty, an error message is displayed.
        if (!first_name || !last_name || !employee_id || !email_address || !address || !phone_number || !role || !status) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        try { // This is to update the employee data in the backend and database along with some error handling
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
    
    // TODO: Make a handleDelete function to delete the employee account. This will be a DELETE request to the backend.
    // Ensure it contains a confirmation alert before deleting the account.

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
                        value={first_name}
                        onChangeText={setFirstName}
                        placeholder="Enter first name"
                    />
                </View>

                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Last Name</Text>
                    <TextInput
                        style={styles.textInput}
                        value={last_name}
                        onChangeText={setLastName}
                        placeholder="Enter last name"
                    />
                </View>

                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Employee ID</Text>
                    <TextInput
                        style={styles.textInput}
                        value={employee_id}
                        onChangeText={setEmployeeId}
                        placeholder="Enter employee ID"
                    />
                </View>

                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Email Address</Text>
                    <TextInput
                        style={styles.textInput}
                        value={email_address}
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
                        value={phone_number}
                        onChangeText={setPhoneNumber}
                        placeholder="Enter phone number"
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
                    <TextInput
                        style={styles.textInput}
                        value={status}
                        onChangeText={setStatus}
                        placeholder="Enter status"
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton}> {/*add onPress={handleDelete} when handleDelete is done*/}
                    <Text style={styles.deleteButtonText}>Delete Account</Text>
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

    deleteButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },

    deleteButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});