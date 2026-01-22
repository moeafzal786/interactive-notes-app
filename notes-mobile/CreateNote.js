import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { TextInput, Button, Text } from "react-native-paper";
import { API_BASE } from "./api";
import { refreshAccessToken } from "./auth"; // helper

export default function CreateNote({ token, onNoteCreated, navigation }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");

    const handleCreate = async () => {
        try {
            const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
            const response = await axios.post(
                `${API_BASE}/notes/`,
                { title, content, tags: tagsArray },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (onNoteCreated) onNoteCreated(response.data);
            navigation.navigate("Notes");
        } catch (error) {
            if (error.response?.data?.code === "token_not_valid") {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
                    const response = await axios.post(
                        `${API_BASE}/notes/`,
                        { title, content, tags: tagsArray },
                        { headers: { Authorization: `Bearer ${newToken}` } }
                    );
                    if (onNoteCreated) onNoteCreated(response.data);
                    navigation.navigate("Notes");
                }
            } else {
                console.error("Failed to create note:", error.response?.data || error);
            }
        }
    };

    return (
        <LinearGradient
            colors={["#3498db", "#9b59b6"]}
            style={styles.container}
        >
            <View style={styles.card}>
                <Text style={styles.heading}>Create a New Note</Text>
                <TextInput
                    label="Title"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                    mode="outlined"
                />
                <TextInput
                    label="Content"
                    value={content}
                    onChangeText={setContent}
                    style={styles.input}
                    mode="outlined"
                />
                <TextInput
                    label="Tags (comma separated)"
                    value={tags}
                    onChangeText={setTags}
                    style={styles.input}
                    mode="outlined"
                />
                <Button
                    mode="contained"
                    onPress={handleCreate}
                    style={styles.button}
                >
                    Add Note
                </Button>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    card: {
        width: "95%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    heading: {
        marginBottom: 16,
        color: "#2c3e50",
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
    },
    input: {
        marginBottom: 14,
    },
    button: {
        marginTop: 8,
        backgroundColor: "#6a11cb",
    },
});