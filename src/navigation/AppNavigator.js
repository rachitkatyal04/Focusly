import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// Screen imports
import InboxScreen from "../screens/InboxScreen";
import NextActionsScreen from "../screens/NextActionsScreen";
import ProjectsScreen from "../screens/ProjectsScreen";
import ProcessItemScreen from "../screens/ProcessItemScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main tab navigation
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Inbox") {
            iconName = focused ? "mail" : "mail-outline";
          } else if (route.name === "NextActions") {
            iconName = focused ? "flash" : "flash-outline";
          } else if (route.name === "Projects") {
            iconName = focused ? "folder" : "folder-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#7C3AED",
        tabBarInactiveTintColor: "#A78BFA",
        tabBarStyle: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          shadowColor: "transparent",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "700",
          letterSpacing: 0.3,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Inbox"
        component={InboxScreen}
        options={{
          tabBarLabel: "Inbox",
        }}
      />
      <Tab.Screen
        name="NextActions"
        component={NextActionsScreen}
        options={{
          tabBarLabel: "Actions",
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{
          tabBarLabel: "Projects",
        }}
      />
    </Tab.Navigator>
  );
}

// Root stack navigator
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#F9FAFB" },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="ProcessItem"
          component={ProcessItemScreen}
          options={{
            presentation: "modal",
            cardStyle: { backgroundColor: "#F9FAFB" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
