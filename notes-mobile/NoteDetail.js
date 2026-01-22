import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
                <Text style={{ color: "#111827" }}>No note data provided.</Text>
                <Button mode="contained" onPress={() => navigation.navigate("Notes")}>
                    Back to Notes
                </Button>
            </View>
        );
    }

    return (
        <LinearGradient
            colors={["#3498db", "#9b59b6"]}
            style={styles.container}
        >
            <View style={styles.card}>
                <Text style={styles.heading}>Edit Note</Text>
                <TextInput
                    label="Title"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                    mode="outlined"
                    theme={{
                        colors: {
                            text: "#111827",
                            placeholder: "#6a11cb", // purple accent for label
                            primary: "#3498db",     // blue accent when focused
                        },
                    }}
                />
                <TextInput
                    label="Content"
                    value={content}
                    onChangeText={setContent}
                    style={styles.input}
                    mode="outlined"
                    theme={{
                        colors: {
                            text: "#111827",
                            placeholder: "#6a11cb",
                            primary: "#3498db",
                        },
                    }}
                />
                <TextInput
                    label="Tags (comma separated)"
                    value={tags}
                    onChangeText={setTags}
                    style={styles.input}
                    mode="outlined"
                    theme={{
                        colors: {
                            text: "#111827",
                            placeholder: "#6a11cb",
                            primary: "#3498db",
                        },
                    }}
                />
                <Button
                    mode="contained"
                    onPress={handleUpdate}
                    style={styles.button}
                >
                    Save Changes
                </Button>
                <Button
                    mode="contained"
                    onPress={handleDelete}
                    style={styles.deleteButton}
                >
                    Delete Note
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
        color: "#111827", // dark gray for readability
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
    },
    input: {
        marginBottom: 14,
    },
    button: {
        marginTop: 10,
        backgroundColor: "#1e3a8a",
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: "#dc2626",
    },
});