import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import axios from "axios";
import { API_BASE } from "./api";

export default function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState("");

    const handleForgot = async () => {
        try {
            await axios.post(`${API_BASE}/password-reset/`, { email });
            alert("Reset link sent to your email");
        } catch (err) {
            console.error("Reset failed:", err.response?.data || err);
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="titleLarge">Reset Password</Text>
            <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} />
            <Button mode="contained" onPress={handleForgot}>
                Send Reset Link
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