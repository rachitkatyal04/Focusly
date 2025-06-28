import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import "react-native-gesture-handler";

// Context and Navigation
import { GTDProvider } from "./src/context/GTDContext";
import AppNavigator from "./src/navigation/AppNavigator";

/**
 * Main App Component
 * Focusly - A personal productivity app based on the Getting Things Done (GTD) methodology
 */
export default function App() {
  return (
    <GTDProvider>
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <AppNavigator />
      </View>
    </GTDProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
});
