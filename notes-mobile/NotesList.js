import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { API_BASE } from "./api";
import { Card, Title, Paragraph, Button, FAB, Chip } from "react-native-paper";

export default function NotesList({ token, navigation, onLogout }) {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.get(`${API_BASE}/notes/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNotes(response.data);
            } catch (error) {
                console.error("Failed to fetch notes:", error);
            }
        };
        fetchNotes();
    }, [token]);

    return (
        <LinearGradient colors={["#3498db", "#9b59b6"]} style={styles.container}>
            <Button
                mode="outlined"
                onPress={onLogout}
                style={styles.logout}
                textColor="#e74c3c"
            >
                Logout
            </Button>

            <FlatList
                data={notes}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Paragraph style={{ color: "#fff" }}>No notes yet</Paragraph>}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate("NoteDetail", { note: item })}
                    >
                        <Card style={styles.card}>
                            <Card.Content>
                                <Title style={styles.title}>{item.title}</Title>
                                <Paragraph style={styles.text}>{item.content}</Paragraph>
                                {item.tag_names && item.tag_names.length > 0 && (
                                    <View style={styles.tagsContainer}>
                                        {item.tag_names.map((tag, idx) => (
                                            <Chip key={idx} style={styles.chip}>{tag}</Chip>
                                        ))}
                                    </View>
                                )}
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                )}
            />

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => navigation.navigate("CreateNote")}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    logout: {
        marginBottom: 12,
        borderColor: "#2c3e50", // darker border for contrast
        borderWidth: 1.5,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    card: {
        marginBottom: 16,
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    title: { color: "#2c3e50", fontWeight: "bold", fontSize: 18 },
    text: { color: "#555", marginTop: 4 },
    tagsContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
    chip: { marginRight: 6, marginBottom: 6, backgroundColor: "#3498db" },
    fab: {
        position: "absolute",
        right: 16,
        bottom: 16,
        backgroundColor: "#3498db", // blue so it pops against purple
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
});