import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import Drawer from "expo-router/drawer";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Home - InstaTube",
          drawerIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          title: "About - InstaTube",
          drawerIcon: ({ color }) => <TabBarIcon name="info" color={color} />,
        }}
      />
      <Drawer.Screen
        name="updates"
        options={{
          title: "App-Updates",
          drawerIcon: ({ color }) => <TabBarIcon name="upload" color={color} />,
        }}
      />
    </Drawer>
  );
}
