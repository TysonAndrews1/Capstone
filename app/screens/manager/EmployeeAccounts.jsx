import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Platform, Image } from 'react-native';
import MainLayout from '../../layouts/MainLayout';
import { useRouter } from "expo-router";

// Search bar may need to be reworked on when data is able to be fetched from the backend.

// It will say "no employees found" if there are no employees in the database. Since the database is not connected, it will say that for now.

export default function EmployeeAccounts() {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    //Platform.OS to decide which URL to use when running on an Android/Android emulator vs iOS/web.
    const BASE_URL = Platform.OS === 'android' ? ( 
        'http://10.187.198.97:8080/api/accounts') : //Android Device & Android Studio (Use your personal ipv4 address)
        'http://localhost:8080/api/accounts'; //Computer & iOS


    /* This effect runs once when the component mounts. FetchEmployees attempts to fetch employee data from a backend endpoint,
    then populates employees & filteredEmployees state. */ 
    const fetchEmployees = async () => {

        setLoading(true);
        setError(true);

        try {
            const response = await fetch(`${BASE_URL}`);
            if (!response.ok) {
                throw new Error('Error fetching employees');
            }
            const data = await response.json();
            setEmployees(data);
            setFilteredEmployees(data);
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

    const handleEmployeePress = (employee) => {
        router.push({
            pathname: '/screens/manager/EmpAccountDetails',
            query: { employeeId: employee.accountId },
          });
        console.log(employee.accountId);
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

            <ScrollView style={styles.scrollContainer}>
                {filteredEmployees.length > 0 ? (filteredEmployees.map((employee) => (
                    <Pressable
                    key={employee.accountId}
                    style={styles.employeeCard}
                    onPress={() => handleEmployeePress(employee)}>
                    <Text style={styles.employeeName}>{employee.firstName} {employee.lastName}</Text>
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
