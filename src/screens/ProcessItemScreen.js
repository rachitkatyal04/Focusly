import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useGTD } from "../context/GTDContext";
import { useNavigation, useRoute } from "@react-navigation/native";

/**
 * Process Item Screen - For organizing items from the inbox
 * This is the second step in the GTD methodology: Process & Organize
 */
export default function ProcessItemScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;

  const { removeInboxItem, addProject, addNextAction, projects, contexts } =
    useGTD();

  const [actionTitle, setActionTitle] = useState(item.title);
  const [actionDescription, setActionDescription] = useState(item.description);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedContext, setSelectedContext] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
    ]).start();
  }, []);

  // Create new project
  const handleCreateNewProject = () => {
    if (newProjectName.trim()) {
      const projectId = addProject(newProjectName.trim());
      setSelectedProject(projectId);
      setNewProjectName("");
      setShowNewProjectModal(false);
      Alert.alert("Success", "New project created!");
    } else {
      Alert.alert("Error", "Please enter a project name.");
    }
  };

  // Convert to Next Action
  const handleCreateNextAction = () => {
    if (actionTitle.trim()) {
      addNextAction(
        actionTitle.trim(),
        actionDescription.trim(),
        selectedProject,
        selectedContext
      );

      // Create success message with context/project info
      let successMessage = "Next Action created!";
      const selectedContextName = selectedContext
        ? contexts.find((c) => c.id === selectedContext)?.name
        : null;
      const selectedProjectName = selectedProject
        ? projects.find((p) => p.id === selectedProject)?.name
        : null;

      if (selectedContextName || selectedProjectName) {
        successMessage += "\n\n";
        if (selectedContextName) {
          successMessage += `Context: ${selectedContextName}`;
        }
        if (selectedProjectName) {
          successMessage += `${
            selectedContextName ? "\n" : ""
          }Project: ${selectedProjectName}`;
        }
      }

      removeInboxItem(item.id);
      Alert.alert("Success", successMessage, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert("Error", "Please enter an action title.");
    }
  };

  // Convert to Project
  const handleCreateProject = () => {
    if (actionTitle.trim()) {
      addProject(actionTitle.trim(), actionDescription.trim());
      removeInboxItem(item.id);
      Alert.alert("Success", "Project created!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert("Error", "Please enter a project name.");
    }
  };

  // Discard item
  const handleDiscard = () => {
    Alert.alert("Discard Item", "Are you sure you want to discard this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => {
          removeInboxItem(item.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <LinearGradient
      colors={["#89f7fe", "#66a6ff"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView style={styles.scrollContainer}>
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#1E40AF" />
            </TouchableOpacity>
            <Text style={styles.title}>🔄 Process Item</Text>
          </LinearGradient>
        </Animated.View>

        {/* Original item display */}
        <View style={styles.originalItem}>
          <Text style={styles.sectionTitle}>Original Item</Text>
          <View style={styles.itemCard}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            {item.description ? (
              <Text style={styles.itemDescription}>{item.description}</Text>
            ) : null}
          </View>
        </View>

        {/* Action/Project details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What will you do with this?</Text>

          <TextInput
            style={styles.input}
            placeholder="Action/Project title"
            value={actionTitle}
            onChangeText={setActionTitle}
          />

          <TextInput
            style={styles.textArea}
            placeholder="Description (optional)"
            value={actionDescription}
            onChangeText={setActionDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Project selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assign to Project (Optional)</Text>

          <TouchableOpacity
            style={styles.createProjectButton}
            onPress={() => setShowNewProjectModal(true)}
          >
            <Ionicons name="add" size={20} color="#3B82F6" />
            <Text style={styles.createProjectText}>Create New Project</Text>
          </TouchableOpacity>

          <View style={styles.projectList}>
            <TouchableOpacity
              style={[
                styles.projectOption,
                selectedProject === null && styles.selectedOption,
              ]}
              onPress={() => setSelectedProject(null)}
            >
              <Text style={styles.projectOptionText}>No Project</Text>
              {selectedProject === null && (
                <Ionicons name="checkmark" size={20} color="#3B82F6" />
              )}
            </TouchableOpacity>

            {projects.map((project) => (
              <TouchableOpacity
                key={project.id}
                style={[
                  styles.projectOption,
                  selectedProject === project.id && styles.selectedOption,
                ]}
                onPress={() => setSelectedProject(project.id)}
              >
                <Text style={styles.projectOptionText}>{project.name}</Text>
                {selectedProject === project.id && (
                  <Ionicons name="checkmark" size={20} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Context selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Context (Optional)</Text>
          <Text style={styles.sectionSubtitle}>
            Choose where or how you'll work on this action
          </Text>

          <View style={styles.contextList}>
            <TouchableOpacity
              style={[
                styles.contextOption,
                selectedContext === null && styles.selectedNoContextOption,
              ]}
              onPress={() => setSelectedContext(null)}
            >
              <Text
                style={[
                  styles.contextOptionText,
                  selectedContext === null && styles.selectedContextText,
                ]}
              >
                No Context
              </Text>
              {selectedContext === null && (
                <Ionicons name="checkmark" size={16} color="#3B82F6" />
              )}
            </TouchableOpacity>

            {contexts.map((context) => (
              <TouchableOpacity
                key={context.id}
                style={[
                  styles.contextOption,
                  {
                    backgroundColor:
                      selectedContext === context.id
                        ? context.color
                        : "#F3F4F6",
                    borderWidth: selectedContext === context.id ? 2 : 1,
                    borderColor:
                      selectedContext === context.id ? "#FFFFFF" : "#E5E7EB",
                  },
                ]}
                onPress={() => setSelectedContext(context.id)}
              >
                <Text
                  style={[
                    styles.contextOptionText,
                    selectedContext === context.id && {
                      color: "#FFFFFF",
                      fontWeight: "600",
                    },
                  ]}
                >
                  {context.name}
                </Text>
                {selectedContext === context.id && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {selectedContext && (
            <View style={styles.selectedContextIndicator}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.selectedContextLabel}>
                Selected: {contexts.find((c) => c.id === selectedContext)?.name}
              </Text>
            </View>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.nextActionButton}
            onPress={handleCreateNextAction}
          >
            <Ionicons name="flash" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Create Next Action</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.projectButton}
            onPress={handleCreateProject}
          >
            <Ionicons name="folder" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Create Project</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.discardButton}
            onPress={handleDiscard}
          >
            <Ionicons name="trash" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Discard</Text>
          </TouchableOpacity>
        </View>

        {/* New Project Modal */}
        <Modal
          visible={showNewProjectModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowNewProjectModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create New Project</Text>

              <TextInput
                style={styles.input}
                placeholder="Project name"
                value={newProjectName}
                onChangeText={setNewProjectName}
                autoFocus
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowNewProjectModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalCreateButton}
                  onPress={handleCreateNewProject}
                >
                  <Text style={styles.modalCreateText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 0,
    marginBottom: 20,
  },
  headerGradient: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
    backgroundColor: "rgba(30, 64, 175, 0.1)",
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1E40AF",
    letterSpacing: 0.5,
  },
  originalItem: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginTop: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 20,
  },
  itemCard: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginTop: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
    minHeight: 80,
  },
  createProjectButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#EBF4FF",
    borderRadius: 8,
    marginBottom: 16,
  },
  createProjectText: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  projectList: {
    gap: 8,
  },
  projectOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: "#EBF4FF",
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  projectOptionText: {
    fontSize: 16,
    color: "#1F2937",
  },
  contextList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  contextOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
  },
  selectedNoContextOption: {
    backgroundColor: "#EBF4FF",
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  contextOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  selectedContextText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  selectedContextIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    gap: 8,
  },
  selectedContextLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#059669",
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  nextActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 8,
  },
  projectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 8,
  },
  discardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    padding: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancelText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "500",
  },
  modalCreateButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    alignItems: "center",
  },
  modalCreateText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
