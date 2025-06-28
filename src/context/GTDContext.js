import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Context creation
const GTDContext = createContext();

// Initial state
const initialState = {
  inboxItems: [],
  projects: [],
  contexts: [
    { id: "1", name: "@computer", color: "#3B82F6" },
    { id: "2", name: "@home", color: "#10B981" },
    { id: "3", name: "@errands", color: "#F59E0B" },
    { id: "4", name: "@phone", color: "#EF4444" },
  ],
  nextActions: [],
  loading: false,
};

// Action types
const ACTIONS = {
  SET_LOADING: "SET_LOADING",
  LOAD_DATA: "LOAD_DATA",
  ADD_INBOX_ITEM: "ADD_INBOX_ITEM",
  REMOVE_INBOX_ITEM: "REMOVE_INBOX_ITEM",
  ADD_PROJECT: "ADD_PROJECT",
  UPDATE_PROJECT: "UPDATE_PROJECT",
  UPDATE_PROJECT_PROGRESS: "UPDATE_PROJECT_PROGRESS",
  DELETE_PROJECT: "DELETE_PROJECT",
  ADD_CONTEXT: "ADD_CONTEXT",
  ADD_NEXT_ACTION: "ADD_NEXT_ACTION",
  UPDATE_NEXT_ACTION: "UPDATE_NEXT_ACTION",
  COMPLETE_NEXT_ACTION: "COMPLETE_NEXT_ACTION",
  DELETE_NEXT_ACTION: "DELETE_NEXT_ACTION",
  DELETE_COMPLETED_ACTIONS: "DELETE_COMPLETED_ACTIONS",
};

// Reducer function
function gtdReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTIONS.LOAD_DATA:
      return { ...state, ...action.payload };

    case ACTIONS.ADD_INBOX_ITEM:
      return {
        ...state,
        inboxItems: [...state.inboxItems, action.payload],
      };

    case ACTIONS.REMOVE_INBOX_ITEM:
      return {
        ...state,
        inboxItems: state.inboxItems.filter(
          (item) => item.id !== action.payload
        ),
      };

    case ACTIONS.ADD_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };

    case ACTIONS.UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id
            ? { ...project, ...action.payload }
            : project
        ),
      };

    case ACTIONS.UPDATE_PROJECT_PROGRESS:
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id
            ? {
                ...project,
                manualProgress: action.payload.progress,
                useManualProgress: action.payload.useManualProgress,
              }
            : project
        ),
      };

    case ACTIONS.DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(
          (project) => project.id !== action.payload
        ),
        // Also remove any next actions associated with this project
        nextActions: state.nextActions.filter(
          (nextAction) => nextAction.projectId !== action.payload
        ),
      };

    case ACTIONS.ADD_CONTEXT:
      return {
        ...state,
        contexts: [...state.contexts, action.payload],
      };

    case ACTIONS.ADD_NEXT_ACTION:
      return {
        ...state,
        nextActions: [...state.nextActions, action.payload],
      };

    case ACTIONS.UPDATE_NEXT_ACTION:
      return {
        ...state,
        nextActions: state.nextActions.map((nextAction) =>
          nextAction.id === action.payload.id
            ? { ...nextAction, ...action.payload }
            : nextAction
        ),
      };

    case ACTIONS.COMPLETE_NEXT_ACTION:
      return {
        ...state,
        nextActions: state.nextActions.map((nextAction) =>
          nextAction.id === action.payload
            ? { ...nextAction, completed: true, completedAt: new Date() }
            : nextAction
        ),
      };

    case ACTIONS.DELETE_NEXT_ACTION:
      return {
        ...state,
        nextActions: state.nextActions.filter(
          (nextAction) => nextAction.id !== action.payload
        ),
      };

    case ACTIONS.DELETE_COMPLETED_ACTIONS:
      return {
        ...state,
        nextActions: state.nextActions.filter(
          (nextAction) => !nextAction.completed
        ),
      };

    default:
      return state;
  }
}

// GTD Provider component
export function GTDProvider({ children }) {
  const [state, dispatch] = useReducer(gtdReducer, initialState);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever state changes
  useEffect(() => {
    saveData();
  }, [state.inboxItems, state.projects, state.nextActions]);

  const loadData = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });

      const [inboxData, projectsData, nextActionsData] = await Promise.all([
        AsyncStorage.getItem("inboxItems"),
        AsyncStorage.getItem("projects"),
        AsyncStorage.getItem("nextActions"),
      ]);

      const loadedData = {
        inboxItems: inboxData ? JSON.parse(inboxData) : [],
        projects: projectsData ? JSON.parse(projectsData) : [],
        nextActions: nextActionsData ? JSON.parse(nextActionsData) : [],
      };

      dispatch({ type: ACTIONS.LOAD_DATA, payload: loadedData });
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem("inboxItems", JSON.stringify(state.inboxItems)),
        AsyncStorage.setItem("projects", JSON.stringify(state.projects)),
        AsyncStorage.setItem("nextActions", JSON.stringify(state.nextActions)),
      ]);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Action creators
  const addInboxItem = (title, description = "") => {
    const newItem = {
      id: Date.now().toString(),
      title,
      description,
      createdAt: new Date(),
    };
    dispatch({ type: ACTIONS.ADD_INBOX_ITEM, payload: newItem });
  };

  const removeInboxItem = (id) => {
    dispatch({ type: ACTIONS.REMOVE_INBOX_ITEM, payload: id });
  };

  const addProject = (name, description = "") => {
    const newProject = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: new Date(),
      completed: false,
      manualProgress: 0,
      useManualProgress: false,
    };
    dispatch({ type: ACTIONS.ADD_PROJECT, payload: newProject });
    return newProject.id;
  };

  const addNextAction = (
    title,
    description = "",
    projectId = null,
    contextId = null
  ) => {
    const newAction = {
      id: Date.now().toString(),
      title,
      description,
      projectId,
      contextId,
      createdAt: new Date(),
      completed: false,
    };
    dispatch({ type: ACTIONS.ADD_NEXT_ACTION, payload: newAction });
  };

  const completeNextAction = (id) => {
    dispatch({ type: ACTIONS.COMPLETE_NEXT_ACTION, payload: id });
  };

  const deleteProject = (id) => {
    dispatch({ type: ACTIONS.DELETE_PROJECT, payload: id });
  };

  const deleteNextAction = (id) => {
    dispatch({ type: ACTIONS.DELETE_NEXT_ACTION, payload: id });
  };

  const deleteCompletedActions = () => {
    dispatch({ type: ACTIONS.DELETE_COMPLETED_ACTIONS });
  };

  const updateProjectProgress = (
    projectId,
    progress,
    useManualProgress = true
  ) => {
    dispatch({
      type: ACTIONS.UPDATE_PROJECT_PROGRESS,
      payload: {
        id: projectId,
        progress: Math.max(0, Math.min(100, progress)), // Clamp between 0-100
        useManualProgress,
      },
    });
  };

  const value = {
    ...state,
    addInboxItem,
    removeInboxItem,
    addProject,
    addNextAction,
    completeNextAction,
    deleteProject,
    deleteNextAction,
    deleteCompletedActions,
    updateProjectProgress,
  };

  return <GTDContext.Provider value={value}>{children}</GTDContext.Provider>;
}

// Custom hook to use GTD context
export function useGTD() {
  const context = useContext(GTDContext);
  if (!context) {
    throw new Error("useGTD must be used within a GTDProvider");
  }
  return context;
}
