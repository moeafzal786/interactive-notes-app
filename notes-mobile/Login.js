import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TextInput, Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE } from "./api";

export default function Login({ onLogin, navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_BASE}/token/`, {
                username,
                password,
            });
            await AsyncStorage.setItem("access", response.data.access);
            await AsyncStorage.setItem("refresh", response.data.refresh);
            onLogin(response.data);   // ✅ pass full object
        } catch (err) {
            console.error("Login failed:", err.response?.data || err);
        }
    };

    return (
        <LinearGradient
            colors={["#3498db", "#9b59b6"]}
            style={styles.container}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Login</Text>
                <TextInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    mode="outlined"
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    mode="outlined"
                />
                <Button
                    mode="contained"
                    onPress={handleLogin}
                    style={styles.button}
                >
                    Login
                </Button>
                <Text
                    style={styles.link}
                    onPress={() => navigation.navigate("Register")}
                >
                    Register
                </Text>
                <Text
                    style={styles.link}
                    onPress={() => navigation.navigate("ForgotPassword")}
                >
                    Forgot Password?
                </Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: "90%",
        padding: 24,
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        color: "#2c3e50",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        marginBottom: 16,
        backgroundColor: "#6a11cb",
    },
    link: {
        marginTop: 8,
        color: "#1e3a8a",
        textAlign: "center",
        fontSize: 14,
    },
});