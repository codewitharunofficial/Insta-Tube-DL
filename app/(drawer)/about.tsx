import { StyleSheet, Linking, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open link:", err)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Insta-Tube-DL</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <Text style={styles.description}>
        Insta-Tube-DL lets you download Instagram reels, posts, stories, and
        YouTube videos and shorts easily. Enjoy fast and reliable downloads with
        a clean, user-friendly interface.
      </Text>

      <Text style={styles.featuresTitle}>Key Features:</Text>
      <Text style={styles.feature}>
        • Instagram Reels, Posts & Stories Downloader
      </Text>
      <Text style={styles.feature}>• YouTube Videos & Shorts Downloader</Text>
      <Text style={styles.feature}>• Video Preview Before Download</Text>
      <Text style={styles.feature}>• Smooth & Modern UI</Text>

      <View style={styles.linkSection}>
        <TouchableOpacity
          onPress={() =>
            openLink("https://github.com/yourusername/insta-tube-dl")
          }
        >
          <Text style={styles.link}>🌐 Visit GitHub Repo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => openLink("mailto:support@instatubedl.app")}
        >
          <Text style={styles.link}>✉️ Contact Support</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openLink("https://codewitharun-portfolio.vercel.app")}>
          <Text style={styles.link}>👨‍💻 Developer Profile</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  separator: {
    marginVertical: 16,
    height: 1,
    width: "100%",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  feature: {
    fontSize: 15,
    color: "#444",
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  linkSection: {
    marginTop: 30,
    width: "100%",
  },
  link: {
    fontSize: 16,
    color: "#007AFF",
    marginVertical: 8,
    textAlign: "center",
  },
  version: {
    fontSize: 13,
    color: "#aaa",
    marginTop: 40,
  },
});
