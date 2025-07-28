import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";

const logos = [
  {
    name: "Instagram",
    screen: "instagram",
    icon: require("@/assets/images/insta.png"),
  },
  {
    name: "YouTube",
    screen: "youtube",
    icon: require("@/assets/images/youtube.png"),
  },
  {
    name: "YT to MP3",
    screen: "ytToMp3",
    icon: require("@/assets/images/mp3.png"),
  },
];

export default function HomeScreen() {
  const router = useRouter();

  const theme = useColorScheme();

  return (
    <View style={styles.container}>
      <Text
        style={[styles.title, { color: theme === "dark" ? "white" : "black" }]}
      >
        Insta-Tube-DL
      </Text>
      {logos.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={[
            styles.card,
            { shadowColor: theme === "dark" ? "lightblue" : "#000" },
          ]}
          onPress={() => router.push({ pathname: item.screen })}
        >
          <Image
            source={item.icon}
            style={[styles.icon, { objectFit: "fill" }]}
            resizeMethod="resize"
          />
          <Text style={styles.label}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "lightblue",
    padding: 16,
    borderRadius: 16,
    marginVertical: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: { width: 40, height: 40, resizeMode: "contain" },
  label: { fontSize: 20, marginLeft: 20 },
});
