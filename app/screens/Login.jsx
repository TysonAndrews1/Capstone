import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert} from 'react-native';
import React, { useState } from 'react';
import { handleLogin } from "../firebase/auth";
import { useRouter } from "expo-router";

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLoginPress = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password.");
            return;
        }

        try {
            await handleLogin(email, password);
            router.push('/screens/ManagerScreen');
        } catch (error) {
            Alert.alert("Login Failed", error.message);
        }
    };
  return (
    <View style={styles.container}>
        <Text style={styles.heading}>Sign In</Text>

        <View style={styles.card}>
            
            {/* Username Input */}
            <Text style={styles.inputText}>Email</Text>
            <View style={styles.inputGroup}>
                {/* put an icon */}
                <TextInput style={styles.input} placeholder="email" placeholderTextColor="#aaa"
                value={email} onChangeText={setEmail} />
            </View>
            
            {/* Password Input */}
            <Text style={styles.inputText}>Password</Text>
            <View style={styles.inputGroup}>
                {/* put an icon */}
                <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry
                 value={password} onChangeText={setPassword} />
            </View>

            {/* Login BUtton */}
            <TouchableOpacity style={styles.button} onPress={onLoginPress}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <Text style={styles.inputText}>Forgot password?</Text>
        </View>
    </View>
  )
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