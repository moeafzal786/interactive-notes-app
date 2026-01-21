import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import { API_BASE } from "./api";
import { Card, Title, Paragraph, Button } from "react-native-paper";

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
        <View style={{ flex: 1, marginTop: 20 }}>
            <Button onPress={onLogout}>Logout</Button>
            <Button
                mode="contained"
                onPress={() => navigation.navigate("CreateNote")}
                style={{ marginVertical: 12 }}
            >
                Add New Note
            </Button>
            <FlatList
                data={notes}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Paragraph>No notes yet</Paragraph>}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate("NoteDetail", { note: item })}
                    >
                        <Card style={styles.card}>
                            <Card.Content>
                                <Title style={styles.title}>{item.title}</Title>
                                <Paragraph style={styles.text}>{item.content}</Paragraph>
                                {item.tag_names && item.tag_names.length > 0 && (
                                    <Paragraph style={styles.tags}>
                                        Tags: {item.tag_names.join(", ")}
                                    </Paragraph>
                                )}
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: { marginBottom: 12, backgroundColor: "#f0f4f8", borderRadius: 12 },
    title: { color: "#111827", fontWeight: "bold" },   // darker
    text: { color: "#111827" },                        // darker
    tags: { marginTop: 6, color: "#374151", fontStyle: "italic" }, // medium gray
});