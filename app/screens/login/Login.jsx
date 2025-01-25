import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { handleLogin } from "../../firebase/auth";
import { useRouter } from "expo-router";

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const BASE_URL = 'http://10.0.2.2:8080/api';

    const forgotPass = () => {
        router.push('/screens/forgotPassword');
    };

    const onLoginPress = async () => {
    
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password.");
            return;
        }

        try {
            // Using Firebase Authentication
            const firebaseUser = await handleLogin(email, password);
            console.log("Logged in user:", firebaseUser); // Firebase user object
            
            // Fetching role from the MySQL
            const fetchUserRole = async (email) => {
                const response = await fetch(`${BASE_URL}/user?email=${email}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch user role: ${response.status}`);
            }
            
            const data = await response.json();
            return data.role;
            };

            // Checking the role, then navigate each screen.
            const role = await fetchUserRole(email);
            console.log("User role:", role);

            if (role === 'Manager') {
                router.push('/screens/manager/ManagerScreen');
            } else if (role === 'Employee') {
                router.push('/screens/employee/EmployeeScreen');
            } else {
                Alert.alert("Error", "Unknown role. Please contact support.");
            }
            
            
        } catch (error) {
            Alert.alert("Login Failed", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Sign In</Text>
            <View style={styles.card}>
                <Text style={styles.inputText}>Email</Text>
                <View style={styles.inputGroup}>
                    <TextInput
                        style={styles.input}
                        placeholder="email"
                        placeholderTextColor="#aaa"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <Text style={styles.inputText}>Password</Text>
                <View style={styles.inputGroup}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#aaa"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={onLoginPress}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={forgotPass}>
                    <Text style={styles.inputText}>Forgot password?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
      },
      card: {
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.9)", // Slightly transparent for modern effect
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 5,
      },
      heading: {
        color: "#333",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 40,
        textAlign: "center",
      },
      inputGroup: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        borderBottomWidth: 1,
        borderColor: "#ddd",
        paddingBottom: 10,
        backgroundColor: "white",
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 50,
      },
      input: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 10,
        color: "#333",
      },
      inputText: {
        color: "#000000",
        fontSize: 14,
        textDecorationLine: "underline",
        paddingLeft: 20,
      },
      button: {
        backgroundColor: "#457b9d",
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
        marginVertical: 20,
      },
      buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      },
});