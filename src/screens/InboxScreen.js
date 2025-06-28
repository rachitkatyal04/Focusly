import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useGTD } from "../context/GTDContext";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

/**
 * Inbox Screen - For capturing all incoming tasks, ideas, and to-dos
 * This is the first step in the GTD methodology: Capture
 */
export default function InboxScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { inboxItems, addInboxItem, removeInboxItem } = useGTD();
  const navigation = useNavigation();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Add new item to inbox
  const handleAddItem = () => {
    if (title.trim()) {
      addInboxItem(title.trim(), description.trim());
      setTitle("");
      setDescription("");
      Alert.alert("Success", "Item added to inbox!");
    } else {
      Alert.alert("Error", "Please enter a title for the item.");
    }
  };

  // Navigate to process item screen
  const handleProcessItem = (item) => {
    navigation.navigate("ProcessItem", { item });
  };

  // Delete item from inbox
  const handleDeleteItem = (id) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => removeInboxItem(id),
      },
    ]);
  };

  // Render individual inbox item
  const renderInboxItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => handleProcessItem(item)}
      >
        <Text style={styles.itemTitle}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.itemDescription}>{item.description}</Text>
        ) : null}
        <Text style={styles.itemDate}>
          Added: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteItem(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={["#ff9a9e", "#fecfef", "#fecfef"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.7)"]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Text style={styles.title}>✨ Inbox</Text>
              <Text style={styles.subtitle}>
                Capture everything on your mind
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick capture form */}
        <Animated.View
          style={[
            styles.captureForm,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.85)"]}
            style={styles.formGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TextInput
              style={styles.titleInput}
              placeholder="What's on your mind? 💭"
              placeholderTextColor="#8B5CF6"
              value={title}
              onChangeText={setTitle}
              returnKeyType="next"
            />
            <TextInput
              style={styles.descriptionInput}
              placeholder="Additional notes (optional)"
              placeholderTextColor="#A855F7"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <LinearGradient
                colors={["#8B5CF6", "#A855F7"]}
                style={styles.addButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="add" size={24} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add to Inbox</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Inbox items list */}
        <View style={styles.listContainer}>
          <Text style={styles.listHeader}>
            Items to Process ({inboxItems.length})
          </Text>
          {inboxItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="checkmark-circle-outline"
                size={64}
                color="#9CA3AF"
              />
              <Text style={styles.emptyStateText}>Your inbox is empty!</Text>
              <Text style={styles.emptyStateSubtext}>
                Start capturing your thoughts and tasks above.
              </Text>
            </View>
          ) : (
            <FlatList
              data={inboxItems}
              renderItem={renderInboxItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={styles.list}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 0,
    marginBottom: 20,
  },
  headerGradient: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContent: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#6B46C1",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: "#8B5CF6",
    textAlign: "center",
    fontWeight: "500",
  },
  captureForm: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  formGradient: {
    borderRadius: 25,
    padding: 25,
  },
  titleInput: {
    borderWidth: 2,
    borderColor: "#E0E7FF",
    borderRadius: 15,
    padding: 18,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#374151",
    fontWeight: "500",
  },
  descriptionInput: {
    borderWidth: 2,
    borderColor: "#E0E7FF",
    borderRadius: 15,
    padding: 18,
    fontSize: 14,
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    minHeight: 100,
    color: "#374151",
    fontWeight: "500",
  },
  addButton: {
    borderRadius: 15,
  },
  addButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 15,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#6B46C1",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.1)",
  },
  itemContent: {
    flex: 1,
    padding: 20,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6B46C1",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  itemDescription: {
    fontSize: 15,
    color: "#8B5CF6",
    marginBottom: 12,
    lineHeight: 22,
    fontWeight: "500",
  },
  itemDate: {
    fontSize: 13,
    color: "#A855F7",
    fontWeight: "600",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#8B5CF6",
    marginTop: 24,
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: "#A855F7",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
  },
});
