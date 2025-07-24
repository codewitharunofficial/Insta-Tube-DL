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
  Alert,
  Platform,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { fetchInstaVideoData } from "@/constants/apiCalls";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function Instagram() {
  const [url, setUrl] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDetails, setVideoDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const theme = useColorScheme();
  const isDark = theme === "dark";

  const fetchVideo = async () => {
    setIsLoading(true);
    const data = await fetchInstaVideoData(url);
    if (data?.data?.media) {
      setVideoUrl(data.data.media);
      setVideoDetails(data.data);
    } else {
      Alert.alert("Error", "Could not fetch video. Please check the URL.");
    }
    setIsLoading(false);
  };

  const downloadVideo = async () => {
    try {
      setDownloading(true);

      // Ask for permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Cannot save video without permission."
        );
        return;
      }

      const fileUri = FileSystem.documentDirectory + "insta_video.mp4";
      const downloadResumable = FileSystem.createDownloadResumable(
        videoUrl,
        fileUri
      );

      const { uri } = await downloadResumable.downloadAsync();

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Downloads", asset, false);

      Alert.alert("Downloaded", "Video saved to Pictures/Downloads.");
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", "Failed to download video.");
    } finally {
      setDownloading(false);
    }
  };

  const player = useVideoPlayer(videoUrl, (video) => {
    if (showVideo) {
      video.play();
    }
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#fff" },
      ]}
    >
      <Text style={[styles.title, { color: isDark ? "white" : "black" }]}>
        Instagram Downloader
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
            style={styles.thumbnail}
          />
          <Feather
            name="play-circle"
            size={64}
            color="lightblue"
            style={styles.playIcon}
          />
        </TouchableOpacity>
      )}

      {showVideo && (
        <>
          <VideoView player={player} style={styles.video} />
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={downloadVideo}
          >
            {downloading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.downloadButtonText}>Download Video</Text>
            )}
          </TouchableOpacity>
        </>
      )}
      {!showVideo && videoUrl && (
        <TouchableOpacity style={styles.downloadButton} onPress={downloadVideo}>
          {downloading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.downloadButtonText}>Download Video</Text>
          )}
        </TouchableOpacity>
      )}
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
    width: width * 0.9,
    height: height * 0.5,
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
    marginTop: 20,
  },
  downloadButton: {
    backgroundColor: "#3CB371",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
