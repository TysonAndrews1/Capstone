import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Platform, Image } from 'react-native';
import MainLayout from '../../layouts/MainLayout';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseURLConfig from '../../config/BaseURLConfig';

// Search bar may need to be reworked on when data is able to be fetched from the backend.

// It will say "no employees found" if there are no employees in the database. Since the database is not connected, it will say that for now.

export default function EmployeeAccounts() {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const BASE_URL = BaseURLConfig();

    /* This effect runs once when the component mounts. FetchEmployees attempts to fetch employee data from a backend endpoint,
    then populates employees & filteredEmployees state. */ 
    const fetchEmployees = async () => {

        setLoading(true);
        setError(true);

        try {
            const response = await fetch(`${BASE_URL}/accounts`);
            if (!response.ok) {
                throw new Error('Error fetching employees');
            }
            const data = await response.json();

            const sortedEmployees = data.sort((a, b) => { // Sort employees by last name, then first name
                const lastNameA = a.lastName.toLowerCase();
                const lastNameB = b.lastName.toLowerCase();
                const firstNameA = a.firstName.toLowerCase();
                const firstNameB = b.firstName.toLowerCase();
    
                if (lastNameA < lastNameB) return -1;
                if (lastNameA > lastNameB) return 1;
                if (firstNameA < firstNameB) return -1;
                if (firstNameA > firstNameB) return 1;
                return 0;
            });

            setEmployees(sortedEmployees);
            setFilteredEmployees(sortedEmployees);
        } catch (error) {
            console.error(error);
            setError('Error', 'Failed to fetch employee accounts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees(); // calling fetchEmployees will load the data
    }, []);

    /* This effect listens to changes in searchQuery or employees (like entering a name in the search bar).
    If there's no search query, filteredEmployees = employees (show all). */
    useEffect(() => {
        if (!searchQuery.trim()) { // .trim() removes whitespace from both ends of a string
            setFilteredEmployees(employees); // If the search is empty, show all employees
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase(); // Converts the user's input to lowercase
            const filtered = employees.filter((emp) => // .filter creates a new array with elements that pass the conditions of the function, while not modifying the original array
            emp.firstName.toLowerCase().includes(lowerCaseQuery) ||
            emp.lastName.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredEmployees(filtered);
        }
        }, [searchQuery, employees]);

    const handleEmployeePress = async (employee) => {
        try {
            // Save the accountId in AsyncStorage
            await AsyncStorage.setItem('selectedAccountId', employee.accountId.toString());
    
            // Navigate to the next screen
            router.push('/screens/manager/EmpAccountDetails');
        } catch (error) {
            console.error('Error storing accountId:', error);
        }
    };

    return (
        <MainLayout>
            <View style={styles.container}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search"
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                <Pressable style={styles.addButton} onPress={()=> router.push('/screens/manager/CreateEmpAccount')}>
                    <Text style={styles.addButtonText}>Add Employee</Text>
                </Pressable>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => ( // returns a new array with the results of calling a provided function on every element in the array, in this case, the employee cards
                            <Pressable
                                key={employee.accountId}
                                style={styles.employeeCard}
                                onPress={() => handleEmployeePress(employee)}
                            >
                                <View style={styles.employeeInfoContainer}>
                                    <Text style={styles.employeeName}>
                                        {employee.firstName} {employee.lastName}
                                    </Text>
                                </View>
                            </Pressable>
                        ))
                    ) : (
                        <Text style={styles.noResults}>
                            {searchQuery ? 'No matching results found.' : 'No employees available.'}
                        </Text>
                    )}
                </ScrollView>
            </View>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 55,
    },

    container: {
        padding: 16,
    },

    searchBar: {
        height: 50,
        backgroundColor: '#e0e0e0',
        borderRadius: 15,
        paddingHorizontal: 12,
        marginBottom: 10,
        color: '#000',
        fontSize: 16,
    },

    addButton: {
        backgroundColor: '#3F6D89',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 2,
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 10,
    },

    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    employeeCard: {
        backgroundColor: '#E6F2FA',
        paddingVertical: 15,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#d9d9d9',
    },

    employeeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3F6D89',
    },

    employeeDetails: {
        fontSize: 14,
        color: '#333',
    },

    noResults: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
});
