import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { handleLogin } from "../../firebase/auth";
import { useRouter } from "expo-router";
import BaseURLConfig from '../../config/BaseURLConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

  /**
   * The code related biometric was generated with assistance from chatGPT.
   * Prompt: I want to use expo-local-authentication to login to our app. 
   * Then, I want to Keep using biometric button once the first login happens.
   */
const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [isBioEnabled, setIsBioEnabled] = useState(false);

    const BASE_URL = BaseURLConfig();

    useEffect(() => {
        checkBiometricSupport();
        checkIfBiometricEnabled();
    }, []);

    // Check if the device support biometric authentication
    const checkBiometricSupport = async () => {
        const isSupported = await LocalAuthentication.hasHardwareAsync();
        setIsBiometricSupported(isSupported);
    };

    // Check saved login information
    const checkIfBiometricEnabled = async () => {
        const bioAuthEnabled = await AsyncStorage.getItem('bioAuthEnabled');

        if (bioAuthEnabled === "true") {
            setIsBioEnabled(true);
        }
    };

    // Execute Biometric login
    const handleBiometricAuth = async () => {
        const savedEmail = await AsyncStorage.getItem('userEmail');
        const savedPassword = await AsyncStorage.getItem('userPassword');

        if (!savedEmail || !savedPassword) {
            return Alert.alert("Error", "No saved login info.");
        }

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) {
            return Alert.alert("Register your face or finger print.");
        }

        // Without passcode only using Face ID or finger print
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Use Biometric',
            disableDeviceFallback: false,
        });

        if (result.success) {
            Alert.alert('Authentication Successful');
            loginWithCredentials(savedEmail, savedPassword);
        } else {
            Alert.alert('Failed to Authenticate, please try again');
        }
    };

    // Process Login
    const loginWithCredentials = async (email, password) => {
        
        try {
            // Using Firebase Authentication
            const firebaseUser = await handleLogin(email, password);
            const userDetails = await fetchUserRole(email); // Fetch user role from the database
            console.log("User role:", userDetails);
            
            if (!userDetails || !userDetails.accountId) {
                throw new Error("User not found in the database.");
            }

            // Persist the role locally
            await AsyncStorage.setItem('selectedAccountId', userDetails.accountId.toString());
            await AsyncStorage.setItem('userEmail', email);
            await AsyncStorage.setItem('userPassword', password);
            await AsyncStorage.setItem('userRole', userDetails.role);
            await AsyncStorage.setItem('bioAuthEnabled', "true");

            setIsBioEnabled(true);
            // Navigate to the appropriate screen
            if (userDetails.role === "Manager") {
                router.push('/screens/manager/ManagerScreen');
            } else if (userDetails.role === "Employee") {
                router.push('/screens/employee/EmployeeScreen');
            } else {
                Alert.alert("Error", "Unknown role. Please contact support.");
            }
        } catch (error) {
            Alert.alert("Login Failed", error.message);
        }
    };

    const fetchUserRole = async (email) => { // Fetch the user role from the database using the email provided
        try {
            const response = await fetch(`${BASE_URL}/accounts/user?email=${email}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch user role: ${response.status}`);
            }
            const data = await response.json();
            return {
                role: data.role,
                accountId: data.accountId,
            }
        } catch (error) {
            console.error("Error fetching user details:", error.message);
            throw error;
        }
    };

    const forgotPass = () => {
        router.push('/screens/forgotPassword');
    };

    const onLoginPress = async () => {
    
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password.");
            return;
        }

        loginWithCredentials(email, password);
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
                {isBiometricSupported && isBioEnabled && (
                    <TouchableOpacity style={styles.bioButton} onPress={handleBiometricAuth}>
                        <Text style={styles.buttonText}>Sign In with Biometric</Text>
                    </TouchableOpacity>
                )}
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
      bioButton: {
        backgroundColor: "#1d3557",
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
        marginBottom: 20,
    },
});