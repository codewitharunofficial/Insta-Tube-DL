import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Feather } from "@expo/vector-icons";
import { fetchYoutubeToMp3Data } from "@/constants/apiCalls";

const { width, height } = Dimensions.get("window");

export default function YouTubeToMp3Screen() {
  const [url, setUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioDetails, setAudioDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const theme = useColorScheme();
  const isDark = theme === "dark";

  const soundRef = useRef<Audio.Sound | null>(null);

  const fetchAudio = async () => {
    setIsLoading(true);
    try {
      const data = await fetchYoutubeToMp3Data(url);
      if (data?.data?.media) {
        const audioLink = data.data.media[0]?.url;
        setAudioUrl(audioLink);
        setAudioDetails(data.data);

        // unload previous audio if any
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        // load new audio
        const { sound } = await Audio.Sound.createAsync({ uri: audioLink });
        soundRef.current = sound;
      } else {
        Alert.alert("Error", "Could not fetch audio. Please check the URL.");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong while fetching.");
    }
    setIsLoading(false);
  };

  const toggleAudio = async () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const downloadAudio = async () => {
    try {
      setDownloading(true);

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Cannot save audio without permission."
        );
        return;
      }

      const fileUri = FileSystem.documentDirectory + "youtube_audio.mp3";
      const downloadResumable = FileSystem.createDownloadResumable(
        audioUrl,
        fileUri
      );

      const { uri } = await downloadResumable.downloadAsync();

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Downloads", asset, false);

      Alert.alert("Downloaded", "Audio saved to Downloads.");
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", "Failed to download audio.");
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#fff" },
      ]}
    >
      <Text style={[styles.title, { color: isDark ? "white" : "black" }]}>
        YouTube To MP3 Downloader
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? "#1f1f1f" : "#f0f0f0",
            color: isDark ? "white" : "black",
          },
        ]}
        placeholder="Paste YouTube URL"
        placeholderTextColor={isDark ? "#aaa" : "#555"}
        value={url}
        onChangeText={setUrl}
      />

      <TouchableOpacity style={styles.button} onPress={fetchAudio}>
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.buttonText}>Fetch Audio</Text>
        )}
      </TouchableOpacity>

      {audioDetails?.thumbnail && (
        <View style={styles.thumbnailWrapper}>
          <Image
            source={{ uri: audioDetails.thumbnail }}
            resizeMode="contain"
            style={styles.thumbnail}
          />
          <Feather
            name="music"
            size={48}
            color="lightblue"
            style={styles.playIcon}
          />
        </View>
      )}

      {audioUrl && (
        <>
          <TouchableOpacity
            style={styles.audioControlButton}
            onPress={toggleAudio}
          >
            <Feather
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={32}
              color="white"
            />
            <Text style={styles.audioControlText}>
              {isPlaying ? "Pause" : "Play"} Preview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.downloadButton}
            onPress={downloadAudio}
          >
            {downloading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.downloadButtonText}>Download Audio</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

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
    height: height * 0.45,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    width: width * 0.9,
    height: height * 0.45,
    borderRadius: 16,
  },
  playIcon: {
    position: "absolute",
  },
  audioControlButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    backgroundColor: "#444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  audioControlText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  downloadButton: {
    backgroundColor: "#3CB371",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
