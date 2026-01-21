import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import axios from "axios";
import { API_BASE } from "./api";

export default function Register({ navigation }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            await axios.post(`${API_BASE}/register/`, {
                username,
                email,
                password,
            });
            alert("Registration successful. Please login.");
            navigation.navigate("Login");
        } catch (err) {
            console.error("Register failed:", err.response?.data || err);
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="titleLarge">Create Account</Text>
            <TextInput label="Username" value={username} onChangeText={setUsername} style={styles.input} />
            <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} />
            <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
            <Button mode="contained" onPress={handleRegister}>
                Register
            </Button>
            <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
                Already have an account? Login
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    input: { marginBottom: 12 },
    link: { marginTop: 8, color: "#1e3a8a", textAlign: "center" },
});