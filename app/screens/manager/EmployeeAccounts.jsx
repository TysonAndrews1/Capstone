import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import MainLayout from '../../layouts/MainLayout';
import { useRouter } from "expo-router";

export default function EmployeeAccounts() {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

//Platform.OS to decide which URL to use when running on an Android emulator vs iOS/web. Android emulator accesses localhost via "10.0.2.2".
    const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080/api/events' : 'http://localhost:8080/api/events'; //copied from EventList.jsx


/* This effect runs once when the component mounts. FetchEmployees attempts to fetch employee data from a backend endpoint,
then populates employees & filteredEmployees state. */
useEffect(() => {
    
    const fetchEmployees = async (timeframe) => {
        setError(true);
        try {
            const response = await fetch(`${BASE_URL}/filter?timeframe=${timeframe}`);
            if (!response.ok) {
                throw new Error('Error fetching employees');
            }
            const data = await response.json();
            setEmployees(data);
            setFilteredEmployees(data);
        } catch (error) {
            console.error(error);
            setError('Error', 'Failed to fetch employee accounts.');
        }
    };

    fetchEmployees(); // calling fetchEmployees will load the data
}, []);

/* This effect listens to changes in searchQuery or employees (like entering a name in the search bar).
If there's no search query, filteredEmployees = employees (show all). */
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredEmployees(employees); // If the search is empty, show all employees
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = employees.filter((emp) =>
            emp.name.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredEmployees(filtered);
        }
        }, [searchQuery, employees]);

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

            <ScrollView style={styles.scrollContainer}>
                <Pressable style={styles.employeeCard}>
                    <Text style={styles.employeeName}>Test Account</Text>
                </Pressable>
            </ScrollView>

            <ScrollView style={styles.scrollContainer}>
                {filteredEmployees.length > 0 ? (filteredEmployees.map((employee) => (
                    <Pressable
                    key={employee.id}
                    style={styles.employeeCard}
                    onPress={() => handleEmployeePress(employee)}>
                    <Text style={styles.employeeName}>{employee.name}</Text>
                    </Pressable>
                    ))
                ) : (
                    <Text style={styles.noResults}>
                    {searchQuery ? 'No matching results.' : 'No employees found.'}
                    </Text>
                )}
            </ScrollView>
            </View>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },

    searchBar: {
        height: 50,
        backgroundColor: '#ccc',
        borderRadius: 25,
        paddingHorizontal: 12,
        marginBottom: 10,
        color: '#000',
        fontSize: 16,
    },

    addButton: {
        backgroundColor: '#3F6D89',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 4,
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 10,
    },

    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
      

    scrollContainer: {
        flex: 1,
    },

    employeeCard: {
        backgroundColor: '#E6F2FA',
        padding: 12,
        borderRadius: 4,
    },

    employeeName: {
        fontSize: 20,
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
