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
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import {
  fetchInstaVideoData,
  fetchYoutubeVideoData,
} from "@/constants/apiCalls";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function Instagram() {
  const [url, setUrl] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDetails, setVideoDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useColorScheme();
  const isDark = theme === "dark";

  const fetchVideo = async () => {
    setIsLoading(true);
    const data = await fetchYoutubeVideoData(url);
    console.log(data.data.media[0].url);
    if (data) {
      setVideoUrl(data.data.media[0].url);
      setVideoDetails(data.data);
    }
    setIsLoading(false);
  };

  const player = useVideoPlayer(videoUrl, (video) => {
    video.play();
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#fff" },
      ]}
    >
      <Text style={[styles.title, { color: isDark ? "white" : "black" }]}>
        Youtube Downloader
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? "#1f1f1f" : "#f0f0f0",
            color: isDark ? "white" : "black",
          },
        ]}
        placeholder="Paste Instagram URL"
        placeholderTextColor={isDark ? "#aaa" : "#555"}
        value={url}
        onChangeText={setUrl}
      />

      <TouchableOpacity style={styles.button} onPress={fetchVideo}>
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.buttonText}>Fetch Video</Text>
        )}
      </TouchableOpacity>

      {videoDetails?.thumbnail && !showVideo && (
        <TouchableOpacity
          onPress={() => setShowVideo(true)}
          style={styles.thumbnailWrapper}
        >
          <Image
            source={{ uri: videoDetails.thumbnail }}
            resizeMode="contain"
            style={[
              styles.thumbnail,
              {
                width: width * 0.9,
                height: height * 0.5,
                marginTop: height * 0.05,
                borderRadius: 16,
              },
            ]}
          />
          <Feather
            name="play-circle"
            size={64}
            color="lightblue"
            style={styles.playIcon}
          />
        </TouchableOpacity>
      )}

      {showVideo && <VideoView player={player} style={styles.video} />}
      <Text
        style={[
          styles.title,
          { color: isDark ? "white" : "black", fontSize: 18, marginTop: 20 },
        ]}
      >
        {videoDetails?.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF3C5F",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  thumbnailWrapper: {
    position: "relative",
    width: width * 0.9,
    height: height * 0.5,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  playIcon: {
    position: "absolute",
    top: "50%",
    left: "40%",
  },
  video: {
    width: width * 0.9,
    height: height * 0.5,
    borderRadius: 16,
  },
});
