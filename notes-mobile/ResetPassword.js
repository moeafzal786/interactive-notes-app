import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import axios from "axios";
import { API_BASE } from "./api";

export default function ResetPassword({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleReset = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            await axios.post(`${API_BASE}/password-reset-confirm/`, {
                username,
                password,
            });
            alert("Password reset successful. Please login.");
            navigation.navigate("Login");
        } catch (err) {
            console.error("Reset failed:", err.response?.data || err);
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="titleLarge">Set New Password</Text>
            <TextInput label="Username" value={username} onChangeText={setUsername} style={styles.input} />
            <TextInput label="New Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
            <TextInput label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
            <Button mode="contained" onPress={handleReset}>
                Reset Password
            </Button>
            <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
                Back to Login
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    input: { marginBottom: 12 },
    link: { marginTop: 8, color: "#1e3a8a", textAlign: "center" },
});