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
  ProgressBarAndroid,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import {
  fetchInstaVideoData,
  fetchYoutubeVideoData,
} from "@/constants/apiCalls";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function Instagram() {
  const [url, setUrl] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDetails, setVideoDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [hasPermission, requestPermission] = MediaLibrary.usePermissions();

  const theme = useColorScheme();
  const isDark = theme === "dark";

  const fetchVideo = async () => {
    try {
      setIsLoading(true);
      const data = await fetchYoutubeVideoData(url); // keep consistent with your API
      if (data?.data?.media) {
        setVideoUrl(data.data.media[0]?.url);
        setVideoDetails(data.data);
      } else {
        Alert.alert("Error", "Could not fetch video. Please check the URL.");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong while fetching the video.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadVideo = async () => {
    try {
      if (!videoUrl) return;
      setDownloading(true);
      setDownloadProgress(0);

      if (Platform.OS === "web") {
        const a = document.createElement("a");
        a.href = videoUrl;
        a.download = "youtube_video.mp4";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        alert("Download started in your browser.");
        setDownloading(false);
        return;
      }

      if (!hasPermission?.granted) {
        const { granted } = await requestPermission();
        if (!granted) {
          Alert.alert(
            "Permission required",
            "Storage permission is needed to save the video."
          );
          setDownloading(false);
          return;
        }
      }

      const fileUri = FileSystem.documentDirectory + "insta_video.mp4";
      const downloadResumable = FileSystem.createDownloadResumable(
        videoUrl,
        fileUri,
        {},
        (progress) => {
          const pct =
            progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
          setDownloadProgress(pct);
        }
      );

      const { uri } = await downloadResumable.downloadAsync();
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Downloads", asset, false);

      Alert.alert("Success", "Video saved successfully!");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to download video.");
    } finally {
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  const player = useVideoPlayer(videoUrl, (video) => {
    if (showVideo) video.play();
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#fff" },
      ]}
    >
      <Text style={[styles.title, { color: isDark ? "white" : "black" }]}>
        YouTube Downloader
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
            resizeMode="cover"
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
            disabled={downloading}
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
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={downloadVideo}
          disabled={downloading}
        >
          {downloading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.downloadButtonText}>Download Video</Text>
          )}
        </TouchableOpacity>
      )}

      {downloading && (
        <View style={styles.progressWrapper}>
          {Platform.OS === "android" ? (
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              progress={downloadProgress}
              color="#3CB371"
            />
          ) : (
            <Text style={styles.progressText}>
              Downloading... {Math.floor(downloadProgress * 100)}%
            </Text>
          )}
        </View>
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
    height: height * 0.4,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#000",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  playIcon: {
    position: "absolute",
    top: "40%",
    left: "40%",
  },
  video: {
    width: width * 0.9,
    height: height * 0.4,
    borderRadius: 16,
    marginTop: 20,
    backgroundColor: "#000",
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
  progressWrapper: {
    width: "90%",
    marginTop: 20,
  },
  progressText: {
    color: "#3CB371",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
