import React, { useEffect, useState } from "react";
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
import { Feather } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams } from "expo-router";
import { Video } from "@/constants/types";

const { width, height } = Dimensions.get("window");

export default function Instagram() {


  const [url, setUrl] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDetails, setVideoDetails] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasPermission, requestPermission] = MediaLibrary.usePermissions();

  const theme = useColorScheme();
  const isDark = theme === "dark";

  const params = useLocalSearchParams();

  useEffect(() => {
    if (params?.url && typeof params.url === "string") {
      setUrl(params.url);
      fetchVideo(params.url);
    }
  }, [params]);

  const fetchVideo = async (passedUrl?: string) => {
    try {
      setIsLoading(true);
      const inputUrl = passedUrl || url;
      const data = await fetchInstaVideoData(inputUrl);
      if (data?.data?.media) {
        setVideoUrl(data.data.media);
        setVideoDetails(data.data);
        setShowVideo(false);
      } else {
        Alert.alert(
          "Error",
          "Unable to fetch video. Make sure the URL is valid."
        );
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const player = useVideoPlayer(videoUrl, (video) => {
    if (showVideo) {
      video.play();
    }
  });

  const downloadVideo = async () => {
    try {
      if (!videoUrl) return;
      setIsDownloading(true);
      if (Platform.OS === "web") {
        const a = document.createElement("a");
        a.href = videoUrl;
        a.download = "insta_video.mp4";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        alert("Download started in your browser.");
      } else {
        if (!hasPermission?.granted) {
          const { granted } = await requestPermission();
          if (!granted) {
            Alert.alert(
              "Permission required",
              "Storage permission is needed to save the video."
            );
            return;
          }
        }

        const fileUri = FileSystem.documentDirectory + "insta_video.mp4";
        const downloadResumable = FileSystem.createDownloadResumable(
          videoUrl,
          fileUri
        );
        const { uri }: any = await downloadResumable.downloadAsync();

        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("Downloads", asset, false);
        setIsDownloading(false);
        Alert.alert("Success", "Video saved successfully");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to download video.");
      setIsDownloading(false);

    }
  };

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

      <TouchableOpacity style={styles.button} onPress={() => fetchVideo()}>
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

      {videoUrl && (
        <TouchableOpacity
          onPress={downloadVideo}
          style={[styles.button, { marginTop: 10, flexDirection: 'row', gap: 3 }]}
        >
          {
            isDownloading && (
              <ActivityIndicator size={"small"} color={"#fff"} />
            )
          }
          <Text style={styles.buttonText}>{isDownloading ? "Downloading..." : "Download"}</Text>
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
  },
});
