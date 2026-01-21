import React, { useState, useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

import NotesList from "./NotesList";
import CreateNote from "./CreateNote";
import NoteDetail from "./NoteDetail";

const Stack = createNativeStackNavigator();

export default function App() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const loadToken = async () => {
            const savedToken = await AsyncStorage.getItem("access");
            if (savedToken) setToken(savedToken);
        };
        loadToken();
    }, []);

    const handleLoginSuccess = async (data) => {
        await AsyncStorage.setItem("access", data.access);
        await AsyncStorage.setItem("refresh", data.refresh);
        setToken(data.access);
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("access");
        await AsyncStorage.removeItem("refresh");
        setToken(null);
    };

    return (
        <PaperProvider>
            <NavigationContainer>
                {!token ? (
                    <Stack.Navigator initialRouteName="Login">
                        <Stack.Screen name="Login">
                            {(props) => <Login {...props} onLogin={handleLoginSuccess} />}
                        </Stack.Screen>
                        <Stack.Screen name="Register" component={Register} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                        <Stack.Screen name="ResetPassword" component={ResetPassword} />
                    </Stack.Navigator>
                ) : (
                    <Stack.Navigator>
                        <Stack.Screen name="Notes">
                            {(props) => (
                                <NotesList
                                    {...props}
                                    token={token}
                                    onLogout={handleLogout}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="CreateNote">
                            {(props) => (
                                <CreateNote
                                    {...props}
                                    token={token}
                                    onNoteCreated={() => { }}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="NoteDetail">
                            {(props) => (
                                <NoteDetail
                                    {...props}
                                    token={token}
                                    onNoteUpdated={() => { }}
                                    onNoteDeleted={() => { }}
                                />
                            )}
                        </Stack.Screen>
                    </Stack.Navigator>
                )}
            </NavigationContainer>
        </PaperProvider>
    );
}