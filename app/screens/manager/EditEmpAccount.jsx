import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userIcon from '../../../assets/images/usericon.png'; // Icon from https://www.flaticon.com/free-icon/user_847969?term=user&page=1&position=21&origin=search&related_id=847969
import { Picker } from '@react-native-picker/picker';

// Need to find the logic behind prefilling the fields with the employee's data. This might have to be done when backend is connected to EmployeeAccounts and EmpAccountDetails.

export default function EditEmpAccount({}) {
    const [accountId, setAccountId] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');
    
    const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080/api/accounts' : 'http://localhost:8080/api/accounts';

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

    const fetchEmployeeData = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/${id}`);
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
            setStatus(data.status ? 'Active' : 'Inactive'); // Convert status to 'Active' or 'Inactive' depending on the boolean value in the database.
        } catch (error) {
            console.error('Error fetching employee data:', error);
            Alert.alert('Error', 'Failed to load employee data.');
        }
    };

    const handleSubmit = async () => { // To update the employee data in the backend and database, if fields are empty, an error message is displayed.
        if (!firstName || !lastName || !employeeId || !emailAddress || !address || !phoneNumber || !role || !status) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (!/^\d{6}$/.test(employeeId)) { // This will ensure that the employee ID is a 6-digit number
            Alert.alert('Error', 'Employee ID must be a 6-digit number.');
            return;
        }

        if (!/^\d{10}$/.test(phoneNumber)) { // This will ensure that the phone number is a 10-digit number, WILL CONFIRM WITH TEAM ON HOW TO FORMAT IT.
            Alert.alert('Error', 'Phone Number must be a 10-digit number.');
            return;
        }

        if (!status || status === 'placeholder') { // This will ensure that the user selects a status
            Alert.alert('Error', 'Please select a valid status.');
            return;
        }        

        try { // To update the employee data in the backend and database along with some error handling
            const response = await fetch(`${BASE_URL}/${accountId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email: emailAddress,
                    address,
                    phoneNumber,
                    role,
                    status: status === '1', // This will convert "1" to true, "0" to false
                }),
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

    // TODO: Make a handleDelete function to delete the employee account. This will be a DELETE request to the backend.
    // Ensure it contains a confirmation alert before deleting the account.

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View>
                <View style={styles.header}>
                    <Image source={userIcon} style={styles.profileIcon} />
                    <View style={styles.profileTextContainer}>
                        <Text style={styles.profileName}>{`${firstName} ${lastName}`}</Text> {/*Replaces the placeholder text with the employee's first and last name*/}
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
                        value={emailAddress}
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
                        <Picker // Reference for code: https://archive.reactnative.dev/docs/picker
                            selectedValue={status || ''} // This will set the default value to the employee's status
                            style={styles.picker}
                            onValueChange={(itemValue) => setStatus(itemValue)}
                        >
                            <Picker.Item label="Select Status" value="" />
                            <Picker.Item label="Active" value="1" />
                            <Picker.Item label="Inactive" value="0" />
                        </Picker>
                    </View>
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

    picker: {
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        justifyContent: 'center',
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