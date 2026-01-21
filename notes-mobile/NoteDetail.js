import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import axios from "axios";
import { TextInput, Button, Text } from "react-native-paper";
import { API_BASE } from "./api";
import { refreshAccessToken } from "./auth"; // helper

export default function NoteDetail({ route, navigation, token, onNoteUpdated, onNoteDeleted }) {
    const note = route?.params?.note || { id: null, title: "", content: "", tag_names: [] };

    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [tags, setTags] = useState(note.tag_names ? note.tag_names.join(", ") : "");

    const handleUpdate = async () => {
        if (!note.id) return;
        try {
            const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
            const response = await axios.put(
                `${API_BASE}/notes/${note.id}/`,
                { title, content, tags: tagsArray },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (onNoteUpdated) onNoteUpdated(response.data);
            navigation.navigate("Notes");
        } catch (error) {
            if (error.response?.data?.code === "token_not_valid") {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
                    const response = await axios.put(
                        `${API_BASE}/notes/${note.id}/`,
                        { title, content, tags: tagsArray },
                        { headers: { Authorization: `Bearer ${newToken}` } }
                    );
                    if (onNoteUpdated) onNoteUpdated(response.data);
                    navigation.navigate("Notes");
                }
            } else {
                console.error("Failed to update note:", error.response?.data || error);
            }
        }
    };

    const handleDelete = async () => {
        if (!note.id) return;
        try {
            await axios.delete(`${API_BASE}/notes/${note.id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (onNoteDeleted) onNoteDeleted(note.id);
            navigation.navigate("Notes");
        } catch (error) {
            if (error.response?.data?.code === "token_not_valid") {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    await axios.delete(`${API_BASE}/notes/${note.id}/`, {
                        headers: { Authorization: `Bearer ${newToken}` },
                    });
                    if (onNoteDeleted) onNoteDeleted(note.id);
                    navigation.navigate("Notes");
                }
            } else {
                console.error("Failed to delete note:", error.response?.data || error);
            }
        }
    };

    if (!note.id) {
        return (
            <View style={styles.container}>
                <Text>No note data provided.</Text>
                <Button mode="contained" onPress={() => navigation.navigate("Notes")}>
                    Back to Notes
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text variant="titleMedium" style={styles.heading}>Edit Note</Text>
            <TextInput label="Title" value={title} onChangeText={setTitle} style={styles.input} />
            <TextInput label="Content" value={content} onChangeText={setContent} style={styles.input} />
            <TextInput label="Tags (comma separated)" value={tags} onChangeText={setTags} style={styles.input} />
            <Button mode="contained" onPress={handleUpdate} style={styles.button}>Save Changes</Button>
            <Button mode="contained" onPress={handleDelete} style={styles.deleteButton}>Delete Note</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    heading: { marginBottom: 10, color: "#111827" },
    input: { marginBottom: 10 },
    button: { marginTop: 10, backgroundColor: "#1e3a8a" },
    deleteButton: { marginTop: 10, backgroundColor: "#dc2626" },
});