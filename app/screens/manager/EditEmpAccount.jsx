import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userIcon from '../../../assets/images/usericon.png'; // Icon from https://www.flaticon.com/free-icon/user_847969?term=user&page=1&position=21&origin=search&related_id=847969
import { Picker } from '@react-native-picker/picker';
import BaseURLConfig from '../../config/BaseURLConfig';
import { useRouter } from 'expo-router';

export default function EditEmpAccount() {
    const [accountId, setAccountId] = useState();
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

    useEffect(() => {
        const fetchAccountIdAndData = async () => {
            try {
                // Retrieve accountId from AsyncStorage
                const storedAccountId = await AsyncStorage.getItem('selectedAccountId');
                if (storedAccountId) {
                    setAccountId(storedAccountId); // Set accountId in state
                    fetchEmployeeData(storedAccountId); // Fetch employee data
                } else {
                    Alert.alert('Error', 'No account ID found in storage.');
                }
            } catch (error) {
                console.error('Error fetching account ID from AsyncStorage:', error);
                Alert.alert('Error', 'Failed to retrieve account ID.');
            }
        };

        fetchAccountIdAndData();
    }, []);

    const fetchEmployeeData = async (accountId) => {
        try {
            const response = await fetch(`${BASE_URL}/accounts/${accountId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch employee data: ${response.status}`);
            }
            const data = await response.json();
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setEmployeeId(data.employeeId);
            setEmailAddress(data.email);
            setAddress(data.address);
            setPhoneNumber(data.phoneNumber);
            setRole(data.role);
            setStatus(data.status);
        } catch (error) {
            console.error('Error fetching employee data:', error);
            Alert.alert('Error', 'Failed to load employee data.');
        }
    };

    const handleUpdate = async () => { // To update the employee data in the backend and database, if fields are empty, an error message is displayed.
        if (!firstName || !lastName || !employeeId || !email || !address || !phoneNumber || !role || !status) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        /* Format the first name, last name, and role to have the first letter capitalized and the rest lowercase.
        If they have a space in any of the fields, it will capitalize the first letter of each name/role. (Copied from CreateEmpAccount.jsx)*/
        const formattedFirstName = firstName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        const formattedLastName = lastName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        const formattedRole = role.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    
        // Format email address
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // CODE REFERENCE: https://mailtrap.io/blog/javascript-email-validation/
        if (!emailRegex.test(email)) {
            Alert.alert("Error", "Please enter a valid email address");
            return;
        }
    
        // Format phone number to only be numbers
        const numericPhone = phoneNumber.replace(/\D/g, ""); // CODE REFERENCE: https://stackoverflow.com/questions/9309278/javascript-regex-replace-all-characters-other-than-numbers removes everything that is not a number

        const updatedEmployeeData = {
            firstName: formattedFirstName,
            lastName: formattedLastName,
            employeeId,
            email,
            address,
            phoneNumber: numericPhone,
            role: formattedRole,
            status: status,
        };

        try { // To update the employee data in the backend and database along with some error handling
            const response = await fetch(`${BASE_URL}/accounts/${accountId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedEmployeeData),
            });

            if (!response.ok) {
                throw new Error(`Failed to update employee: ${response.status}`);
            }

            Alert.alert('Success', 'Employee account updated successfully!');
            router.push('/screens/manager/EmployeeAccounts');

        } catch (error) {
            console.error('Error updating employee:', error);
            Alert.alert('Error', 'Failed to update employee account');
        }
    };

    const handleDelete = async () => { // Same as the handleDelete method in EditEvent.jsx, but for deleting an employee account
        if (!accountId) return;
    
        try {
            const response = await fetch(`${BASE_URL}/accounts/${accountId}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                alert(`Employee account deleted successfully.`);
                router.push('/screens/manager/EmployeeAccounts');

            } else {
                const data = await response.json();
                console.log('Delete failed:', data);
                alert(data.message || 'Failed to delete employee account.');
            }

        } catch (error) {
            console.error('Error deleting employee:', error);
            alert('An error occurred while deleting the employee account.');
        }
    };
    

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View>
                <View style={styles.header}>
                    <Image source={userIcon} style={styles.profileIcon} />
                    <View style={styles.profileTextContainer}>
                        <Text style={styles.profileName}>{`${firstName} ${lastName}`}</Text>
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
                        keyboardType="numeric" // Ensure it is a number
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
                        keyboardType="phone-pad" // This will ensure it is a phone number
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
                    <View style={styles.pickerContainer}>
                        <Picker // CODE REFERENCE: https://archive.reactnative.dev/docs/picker
                            selectedValue={status || ''} // This will set the default value to the employee's status
                            style={styles.picker}
                            onValueChange={(itemValue) => setStatus(itemValue)}
                        >
                            <Picker.Item label="Select Status" value="" />
                            <Picker.Item label="Active" value="ACTIVE" />
                            <Picker.Item label="Inactive" value="INACTIVE" />
                        </Picker>
                    </View>
                </View>


                <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 14,
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
        padding: 14,
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
        backgroundColor: '#fff',
        borderColor: '#ccc',
    },

    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
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