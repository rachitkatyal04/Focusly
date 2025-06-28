import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useGTD } from "../context/GTDContext";

/**
 * Projects Screen - For viewing and managing projects
 * Projects are multi-step outcomes that require more than one action
 */
export default function ProjectsScreen() {
  const { projects, nextActions, deleteProject, updateProjectProgress } =
    useGTD();
  const [editingProgress, setEditingProgress] = useState(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Get actions count for a project
  const getProjectActionsCount = (projectId) => {
    return nextActions.filter(
      (action) => action.projectId === projectId && !action.completed
    ).length;
  };

  // Get completed actions count for a project
  const getProjectCompletedCount = (projectId) => {
    return nextActions.filter(
      (action) => action.projectId === projectId && action.completed
    ).length;
  };

  // Handle deleting a project
  const handleDeleteProject = (projectId, projectName) => {
    const associatedActions = nextActions.filter(
      (action) => action.projectId === projectId
    );

    let warningMessage = `Are you sure you want to permanently delete the project "${projectName}"?`;

    if (associatedActions.length > 0) {
      warningMessage += `\n\nThis will also delete ${
        associatedActions.length
      } associated action${associatedActions.length !== 1 ? "s" : ""}.`;
    }

    Alert.alert("Delete Project", warningMessage, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteProject(projectId);
          Alert.alert("Success", `Project "${projectName}" deleted!`);
        },
      },
    ]);
  };

  // Handle editing project progress
  const handleEditProgress = (project) => {
    setEditingProgress({
      id: project.id,
      name: project.name,
      currentProgress: project.useManualProgress ? project.manualProgress : 0,
      useManualProgress: project.useManualProgress || false,
    });
  };

  // Handle saving progress
  const handleSaveProgress = (progress, useManual) => {
    if (editingProgress) {
      updateProjectProgress(editingProgress.id, progress, useManual);
      setEditingProgress(null);
      Alert.alert("Success", "Project progress updated!");
    }
  };

  // Toggle between automatic and manual progress
  const toggleProgressMode = (project) => {
    const newUseManual = !project.useManualProgress;
    updateProjectProgress(
      project.id,
      newUseManual ? project.manualProgress || 0 : 0,
      newUseManual
    );
  };

  // Render individual project
  const renderProject = ({ item }) => {
    const actionsCount = getProjectActionsCount(item.id);
    const completedCount = getProjectCompletedCount(item.id);
    const totalActions = actionsCount + completedCount;
    const autoProgressPercentage =
      totalActions > 0 ? (completedCount / totalActions) * 100 : 0;

    // Use manual progress if enabled, otherwise use automatic
    const displayProgress = item.useManualProgress
      ? item.manualProgress || 0
      : autoProgressPercentage;

    return (
      <View style={styles.projectCard}>
        <View style={styles.projectHeader}>
          <View style={styles.projectTitleRow}>
            <View style={styles.projectTitleSection}>
              <Ionicons name="folder" size={24} color="#C2410C" />
              <Text style={styles.projectTitle}>{item.name}</Text>
            </View>
            <View style={styles.projectActions}>
              <TouchableOpacity
                style={styles.editProgressButton}
                onPress={() => handleEditProgress(item)}
              >
                <Ionicons name="create-outline" size={20} color="#EA580C" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteProjectButton}
                onPress={() => handleDeleteProject(item.id, item.name)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>

          {item.description ? (
            <Text style={styles.projectDescription}>{item.description}</Text>
          ) : null}
        </View>

        <View style={styles.projectMeta}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{actionsCount}</Text>
              <Text style={styles.statLabel}>Active Actions</Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statNumber}>{completedCount}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {Math.round(displayProgress)}%
              </Text>
              <Text style={styles.statLabel}>
                {item.useManualProgress ? "Manual" : "Auto"} Progress
              </Text>
            </View>
          </View>

          {/* Progress Mode Toggle */}
          <TouchableOpacity
            style={styles.progressModeToggle}
            onPress={() => toggleProgressMode(item)}
          >
            <Ionicons
              name={item.useManualProgress ? "hand-left" : "sync"}
              size={16}
              color="#EA580C"
            />
            <Text style={styles.progressModeText}>
              {item.useManualProgress ? "Switch to Auto" : "Switch to Manual"}
            </Text>
          </TouchableOpacity>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={["#EA580C", "#FB923C"]}
                style={[styles.progressFill, { width: `${displayProgress}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(displayProgress)}%
            </Text>
          </View>

          <Text style={styles.projectDate}>
            Created: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#d299c2", "#fef9d7"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
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
          <Text style={styles.title}>📁 Projects</Text>
          <Text style={styles.subtitle}>
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </Text>
        </LinearGradient>
      </Animated.View>

      <View style={styles.listContainer}>
        {projects.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="folder-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No projects yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Create projects by processing items from your inbox.
            </Text>
          </View>
        ) : (
          <FlatList
            data={projects}
            renderItem={renderProject}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* Progress Edit Modal */}
      <Modal
        visible={editingProgress !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditingProgress(null)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.9)"]}
            style={styles.modalContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.modalTitle}>
              Edit Progress: {editingProgress?.name}
            </Text>

            <View style={styles.progressSliderContainer}>
              <Text style={styles.progressLabel}>
                Progress: {Math.round(editingProgress?.currentProgress || 0)}%
              </Text>

              {/* Custom Progress Input */}
              <TextInput
                style={styles.progressInput}
                value={editingProgress?.currentProgress?.toString() || "0"}
                onChangeText={(text) => {
                  const value = parseInt(text) || 0;
                  const clampedValue = Math.max(0, Math.min(100, value));
                  setEditingProgress((prev) => ({
                    ...prev,
                    currentProgress: clampedValue,
                  }));
                }}
                keyboardType="numeric"
                placeholder="Enter progress (0-100)"
                placeholderTextColor="#9CA3AF"
                maxLength={3}
              />

              {/* Quick Progress Buttons */}
              <View style={styles.progressButtons}>
                {[0, 25, 50, 75, 100].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.progressButton,
                      editingProgress?.currentProgress === value &&
                        styles.progressButtonActive,
                    ]}
                    onPress={() =>
                      setEditingProgress((prev) => ({
                        ...prev,
                        currentProgress: value,
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.progressButtonText,
                        editingProgress?.currentProgress === value &&
                          styles.progressButtonTextActive,
                      ]}
                    >
                      {value}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setEditingProgress(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={() =>
                  handleSaveProgress(
                    editingProgress?.currentProgress || 0,
                    true
                  )
                }
              >
                <LinearGradient
                  colors={["#EA580C", "#FB923C"]}
                  style={styles.modalSaveGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.modalSaveText}>Save Progress</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
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
    paddingVertical: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#C2410C",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: "#EA580C",
    textAlign: "center",
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  projectCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(194, 65, 12, 0.1)",
  },
  projectHeader: {
    marginBottom: 16,
  },
  projectTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  projectTitleSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#C2410C",
    marginLeft: 12,
    flex: 1,
    letterSpacing: 0.3,
  },
  projectActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editProgressButton: {
    padding: 8,
    backgroundColor: "rgba(234, 88, 12, 0.1)",
    borderRadius: 12,
  },
  deleteProjectButton: {
    padding: 8,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 12,
  },
  projectDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  projectMeta: {
    gap: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  progressModeToggle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(234, 88, 12, 0.1)",
    borderRadius: 15,
    marginVertical: 8,
    gap: 6,
  },
  progressModeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EA580C",
  },
  progressContainer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: "#FED7AA",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#EA580C",
    minWidth: 40,
  },
  projectDate: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9CA3AF",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 25,
    padding: 30,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#C2410C",
    textAlign: "center",
    marginBottom: 30,
    letterSpacing: 0.5,
  },
  progressSliderContainer: {
    marginBottom: 30,
  },
  progressLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#EA580C",
    textAlign: "center",
    marginBottom: 20,
  },
  progressInput: {
    backgroundColor: "rgba(234, 88, 12, 0.1)",
    borderRadius: 15,
    padding: 15,
    fontSize: 18,
    fontWeight: "600",
    color: "#EA580C",
    textAlign: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#FED7AA",
  },
  progressButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  progressButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "rgba(234, 88, 12, 0.1)",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  progressButtonActive: {
    backgroundColor: "#EA580C",
    borderColor: "#FB923C",
  },
  progressButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EA580C",
  },
  progressButtonTextActive: {
    color: "white",
  },
  modalActions: {
    flexDirection: "row",
    gap: 15,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: "rgba(156, 163, 175, 0.2)",
    borderRadius: 15,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  modalSaveButton: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
  },
  modalSaveGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    letterSpacing: 0.5,
  },
});
