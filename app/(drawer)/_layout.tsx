import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Drawer } from "expo-router/drawer";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import Colors from "@/constants/Colors";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginRight: -5 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
        drawerType: "slide", // smoother drawer
        drawerStyle: {
          backgroundColor: colorScheme === "dark" ? Colors.dark.background : "#fff",
          width: 260,
        },
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: "600",
        },
        drawerActiveTintColor: Colors[colorScheme ?? "light"].tint,
        drawerInactiveTintColor: colorScheme === "dark" ? "#aaa" : "#555",
        drawerActiveBackgroundColor:
          colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
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
          drawerIcon: ({ color }) => <TabBarIcon name="info-circle" color={color} />,
        }}
      />
      <Drawer.Screen
        name="updates"
        options={{
          title: "App Updates",
          drawerIcon: ({ color }) => <TabBarIcon name="upload" color={color} />,
        }}
      />
    </Drawer>
  );
}
