// screens/Instagram.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  useColorScheme,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video"; // ✅ expo-video import

export default function Instagram() {
  const [url, setUrl] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const fetchVideo = () => {
    // Replace with actual API call
    setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4");
  };

  const player = useVideoPlayer(videoUrl, (player) => {
    // player.play();
  });

  const theme = useColorScheme();

  return (
    <View style={styles.container}>
      <Text
        style={[styles.title, { color: theme === "dark" ? "white" : "black" }]}
      >
        Youtube To Mp3
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Paste Youtube URL"
        placeholderTextColor="#aaa"
        value={url}
        onChangeText={setUrl}
      />
      <TouchableOpacity style={styles.button} onPress={fetchVideo}>
        <Text style={styles.buttonText}>Fetch Video</Text>
      </TouchableOpacity>

      {videoUrl && !showVideo && (
        <TouchableOpacity onPress={() => setShowVideo(true)}>
          <Image
            source={{
              uri: "https://via.placeholder.com/300x200.png?text=Instagram+Thumbnail",
            }}
            style={styles.thumbnail}
          />
          <Text style={styles.playIcon}>▶</Text>
        </TouchableOpacity>
      )}

      {showVideo && <VideoView player={player} style={styles.video} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,

    marginBottom: 20,
    backgroundColor: "lightgray",
  },
  button: {
    backgroundColor: "#FF3C5F",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  thumbnail: { width: "100%", height: 200, borderRadius: 12, marginBottom: 10 },
  playIcon: {
    position: "absolute",
    top: "45%",
    left: "45%",
    color: "white",
    fontSize: 32,
  },
  video: { width: "100%", height: 200, borderRadius: 12 },
});
