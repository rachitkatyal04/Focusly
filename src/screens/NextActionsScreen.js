import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useGTD } from "../context/GTDContext";

const { width } = Dimensions.get("window");

/**
 * Next Actions Screen - For viewing and managing next actions
 * This is the third step in the GTD methodology: Engage
 */
export default function NextActionsScreen() {
  const {
    nextActions,
    projects,
    contexts,
    completeNextAction,
    deleteNextAction,
    deleteCompletedActions,
  } = useGTD();
  const [selectedContext, setSelectedContext] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);

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

  // Filter next actions based on selected context, project, and completion status
  const filteredActions = useMemo(() => {
    return nextActions.filter((action) => {
      // Filter by completion status
      if (!showCompleted && action.completed) return false;
      if (showCompleted && !action.completed) return false;

      // Filter by context
      if (selectedContext && action.contextId !== selectedContext) return false;

      // Filter by project
      if (selectedProject && action.projectId !== selectedProject) return false;

      return true;
    });
  }, [nextActions, selectedContext, selectedProject, showCompleted]);

  // Get context name by ID
  const getContextName = (contextId) => {
    const context = contexts.find((c) => c.id === contextId);
    return context ? context.name : null;
  };

  // Get context color by ID
  const getContextColor = (contextId) => {
    const context = contexts.find((c) => c.id === contextId);
    return context ? context.color : "#6B7280";
  };

  // Get project name by ID
  const getProjectName = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : null;
  };

  // Handle action completion
  const handleCompleteAction = (actionId) => {
    Alert.alert("Complete Action", "Mark this action as completed?", [
      { text: "Cancel", style: "cancel" },
      { text: "Complete", onPress: () => completeNextAction(actionId) },
    ]);
  };

  // Handle deleting individual action
  const handleDeleteAction = (actionId, actionTitle) => {
    Alert.alert(
      "Delete Action",
      `Are you sure you want to permanently delete "${actionTitle}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteNextAction(actionId),
        },
      ]
    );
  };

  // Handle bulk delete of completed actions
  const handleDeleteCompletedActions = () => {
    const completedCount = nextActions.filter(
      (action) => action.completed
    ).length;

    if (completedCount === 0) {
      Alert.alert(
        "No Completed Actions",
        "There are no completed actions to delete."
      );
      return;
    }

    Alert.alert(
      "Delete All Completed Actions",
      `Are you sure you want to permanently delete all ${completedCount} completed action${
        completedCount !== 1 ? "s" : ""
      }?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: `Delete ${completedCount}`,
          style: "destructive",
          onPress: () => {
            deleteCompletedActions();
            Alert.alert(
              "Success",
              `${completedCount} completed action${
                completedCount !== 1 ? "s" : ""
              } deleted!`
            );
          },
        },
      ]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedContext(null);
    setSelectedProject(null);
  };

  // Render individual next action
  const renderNextAction = ({ item }) => {
    const contextName = getContextName(item.contextId);
    const contextColor = getContextColor(item.contextId);
    const projectName = getProjectName(item.projectId);

    return (
      <View style={[styles.actionCard, item.completed && styles.completedCard]}>
        <View style={styles.actionHeader}>
          <View style={styles.actionTitleRow}>
            <Text
              style={[
                styles.actionTitle,
                item.completed && styles.completedText,
              ]}
            >
              {item.title}
            </Text>
            <View style={styles.actionButtons}>
              {!item.completed && (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => handleCompleteAction(item.id)}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color="#10B981"
                  />
                </TouchableOpacity>
              )}
              {item.completed && (
                <View style={styles.completedIndicator}>
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                </View>
              )}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteAction(item.id, item.title)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>

          {item.description ? (
            <Text
              style={[
                styles.actionDescription,
                item.completed && styles.completedText,
              ]}
            >
              {item.description}
            </Text>
          ) : null}
        </View>

        <View style={styles.actionMeta}>
          <View style={styles.tagRow}>
            {contextName && (
              <View
                style={[styles.contextTag, { backgroundColor: contextColor }]}
              >
                <Text style={styles.contextTagText}>{contextName}</Text>
              </View>
            )}

            {projectName && (
              <View style={styles.projectTag}>
                <Ionicons name="folder-outline" size={14} color="#6B7280" />
                <Text style={styles.projectTagText}>{projectName}</Text>
              </View>
            )}
          </View>

          <Text style={styles.actionDate}>
            {item.completed
              ? `Completed: ${new Date(item.completedAt).toLocaleDateString()}`
              : `Created: ${new Date(item.createdAt).toLocaleDateString()}`}
          </Text>
        </View>
      </View>
    );
  };

  const activeFiltersCount =
    (selectedContext ? 1 : 0) + (selectedProject ? 1 : 0);

  return (
    <LinearGradient
      colors={["#a8edea", "#fed6e3"]}
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
          <Text style={styles.title}>⚡ Next Actions</Text>
          <Text style={styles.subtitle}>
            {filteredActions.length} action
            {filteredActions.length !== 1 ? "s" : ""}
          </Text>
        </LinearGradient>
      </Animated.View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
          style={styles.filterScrollView}
        >
          {/* Show/Hide Completed Toggle */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              showCompleted && styles.activeFilterChip,
            ]}
            onPress={() => setShowCompleted(!showCompleted)}
          >
            <Ionicons
              name={showCompleted ? "eye" : "eye-off"}
              size={16}
              color={showCompleted ? "#FFFFFF" : "#6B7280"}
            />
            <Text
              style={[
                styles.filterChipText,
                showCompleted && styles.activeFilterChipText,
              ]}
            >
              {showCompleted ? "Completed" : "Active"}
            </Text>
          </TouchableOpacity>

          {/* Context Filters */}
          {contexts.map((context) => (
            <TouchableOpacity
              key={context.id}
              style={[
                styles.filterChip,
                selectedContext === context.id && {
                  backgroundColor: context.color,
                },
              ]}
              onPress={() =>
                setSelectedContext(
                  selectedContext === context.id ? null : context.id
                )
              }
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedContext === context.id && { color: "#FFFFFF" },
                ]}
              >
                {context.name}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Project Filters */}
          {projects.map((project) => (
            <TouchableOpacity
              key={project.id}
              style={[
                styles.filterChip,
                selectedProject === project.id && styles.activeFilterChip,
              ]}
              onPress={() =>
                setSelectedProject(
                  selectedProject === project.id ? null : project.id
                )
              }
            >
              <Ionicons
                name="folder-outline"
                size={16}
                color={selectedProject === project.id ? "#FFFFFF" : "#6B7280"}
              />
              <Text
                style={[
                  styles.filterChipText,
                  selectedProject === project.id && styles.activeFilterChipText,
                ]}
              >
                {project.name}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={clearFilters}
            >
              <Ionicons name="close" size={16} color="#EF4444" />
              <Text style={styles.clearFiltersText}>Clear</Text>
            </TouchableOpacity>
          )}

          {/* Delete Completed Actions */}
          {nextActions.some((action) => action.completed) && (
            <TouchableOpacity
              style={styles.deleteCompletedButton}
              onPress={handleDeleteCompletedActions}
            >
              <Ionicons name="trash" size={16} color="#EF4444" />
              <Text style={styles.deleteCompletedText}>Delete Completed</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Actions List */}
      <View style={styles.listContainer}>
        {filteredActions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name={
                showCompleted
                  ? "checkmark-done-circle-outline"
                  : "flash-outline"
              }
              size={64}
              color="#9CA3AF"
            />
            <Text style={styles.emptyStateText}>
              {showCompleted ? "No completed actions" : "No next actions"}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {showCompleted
                ? "Complete some actions to see them here."
                : activeFiltersCount > 0
                ? "Try adjusting your filters or add new actions from the inbox."
                : "Process items from your inbox to create next actions."}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredActions}
            renderItem={renderNextAction}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
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
    color: "#059669",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: "#047857",
    textAlign: "center",
    fontWeight: "600",
  },
  filterSection: {
    marginBottom: 20,
  },
  filterScrollView: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginHorizontal: 10,
    borderRadius: 25,
    paddingVertical: 15,
    minHeight: 60,
  },
  filterScrollContent: {
    flexDirection: "row",
    paddingHorizontal: 15,
    gap: 10,
    alignItems: "center",
    paddingRight: 25,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 25,
    gap: 6,
    borderWidth: 2,
    borderColor: "rgba(5, 150, 105, 0.2)",
    minWidth: 90,
    minHeight: 40,
  },
  activeFilterChip: {
    backgroundColor: "#059669",
    borderColor: "#047857",
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeFilterChipText: {
    color: "#FFFFFF",
  },
  clearFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#FEF2F2",
    borderRadius: 25,
    gap: 6,
    minWidth: 80,
    minHeight: 40,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#EF4444",
  },
  deleteCompletedButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#FEF2F2",
    borderRadius: 25,
    gap: 6,
    minWidth: 130,
    minHeight: 40,
  },
  deleteCompletedText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#EF4444",
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  actionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(5, 150, 105, 0.1)",
  },
  completedCard: {
    opacity: 0.6,
    backgroundColor: "rgba(243, 244, 246, 0.9)",
  },
  actionHeader: {
    marginBottom: 16,
  },
  actionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  actionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#059669",
    lineHeight: 26,
    letterSpacing: 0.3,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  completeButton: {
    padding: 10,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 20,
  },
  completedIndicator: {
    padding: 8,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 20,
  },
  actionDescription: {
    fontSize: 15,
    color: "#047857",
    lineHeight: 22,
    fontWeight: "500",
  },
  actionMeta: {
    gap: 8,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  contextTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  contextTagText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  projectTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    gap: 4,
  },
  projectTagText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  actionDate: {
    fontSize: 12,
    color: "#9CA3AF",
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
});
