import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
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
        <View style={styles.container}>
            <Text variant="titleLarge">Login</Text>
            <TextInput label="Username" value={username} onChangeText={setUsername} style={styles.input} />
            <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
            <Button mode="contained" onPress={handleLogin}>Login</Button>
            <Text style={styles.link} onPress={() => navigation.navigate("Register")}>Register</Text>
            <Text style={styles.link} onPress={() => navigation.navigate("ForgotPassword")}>Forgot Password?</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    input: { marginBottom: 12 },
    link: { marginTop: 8, color: "#1e3a8a", textAlign: "center" },
});