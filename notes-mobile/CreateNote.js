import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
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
        <View style={styles.container}>
            <Text variant="titleMedium" style={styles.heading}>Create a New Note</Text>
            <TextInput label="Title" value={title} onChangeText={setTitle} style={styles.input} />
            <TextInput label="Content" value={content} onChangeText={setContent} style={styles.input} />
            <TextInput label="Tags (comma separated)" value={tags} onChangeText={setTags} style={styles.input} />
            <Button mode="contained" onPress={handleCreate}>Add Note</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginTop: 20, paddingHorizontal: 10 },
    heading: { marginBottom: 10, color: "#111827" },
    input: { marginBottom: 10 },
});