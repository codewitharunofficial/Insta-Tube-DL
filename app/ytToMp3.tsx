import React, { useState, useEffect } from "react";
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
  ScrollView,
} from "react-native";
import { useAudioPlayer } from "expo-audio";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Feather } from "@expo/vector-icons";
import { fetchYoutubeToMp3Data } from "@/constants/apiCalls";
import { useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

export default function YouTubeToMp3Screen() {
  const { url: sharedUrl } = useLocalSearchParams();
  const [url, setUrl] = useState(sharedUrl || "");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioDetails, setAudioDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const player = useAudioPlayer(audioUrl ? { uri: audioUrl } : null);
  const isDark = useColorScheme() === "dark";

  const fetchAudio = async (inputUrl) => {
    setIsLoading(true);
    try {
      const data = await fetchYoutubeToMp3Data(inputUrl);
      if (data?.data?.media) {
        setAudioUrl(data.data.media.url);
        setAudioDetails(data.data);
      } else {
        Alert.alert("Error", "Could not fetch audio. Please check the URL.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong while fetching.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (sharedUrl && typeof sharedUrl === "string") {
      setUrl(sharedUrl);
      fetchAudio(sharedUrl);
    }
  }, [sharedUrl]);

  const toggleAudio = async () => {
    if (!player.isLoaded) return;
    player.playing ? await player.pause() : await player.play();
  };

  const downloadAudio = async () => {
    try {
      setDownloading(true);

      if (Platform.OS === "web") {
        const link = document.createElement("a");
        link.href = audioUrl;

        // Safari fallback → just open in new tab
        if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
          link.target = "_blank";
        } else {
          link.download = `${audioDetails.title}.mp3`;
        }

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloading(false);
        return;
      }

      // Native
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Cannot save audio without permission."
        );
        return;
      }

      const fileUri = FileSystem.documentDirectory + "youtube_audio.mp3";
      const { uri } = await FileSystem.downloadAsync(audioUrl, fileUri);
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Downloads", asset, false);

      Alert.alert("Downloaded", "Audio saved to Downloads.");
    } catch (error) {
      Alert.alert("Error", "Failed to download audio.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#fff" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={[styles.title, { color: isDark ? "white" : "black" }]}>
        🎵 YouTube to MP3
      </Text>

      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? "#1f1f1f" : "#f9f9f9" },
        ]}
      >
        <TextInput
          style={[styles.input, { color: isDark ? "white" : "black" }]}
          placeholder="Paste YouTube URL"
          placeholderTextColor={isDark ? "#aaa" : "#555"}
          value={url}
          onChangeText={setUrl}
        />
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => fetchAudio(url)}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Feather name="search" size={18} color="white" />
          )}
          <Text style={styles.btnText}>Fetch</Text>
        </TouchableOpacity>
      </View>

      {audioDetails?.thumbnail && (
        <View style={styles.previewCard}>
          <Image
            source={{ uri: audioDetails.thumbnail }}
            style={styles.thumbnail}
          />
          <TouchableOpacity style={styles.playBtn} onPress={toggleAudio}>
            <Feather
              name={player.playing ? "pause" : "play"}
              size={28}
              color="white"
            />
          </TouchableOpacity>
          <Text style={styles.songTitle}>{audioDetails.title}</Text>
        </View>
      )}

      {audioUrl && (
        <TouchableOpacity style={styles.downloadBtn} onPress={downloadAudio}>
          {downloading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Feather name="download" size={18} color="white" />
          )}
          <Text style={styles.btnText}>Download MP3</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    elevation: 2,
  },
  input: { flex: 1, fontSize: 16 },
  actionBtn: {
    backgroundColor: "#FF3C5F",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  btnText: { color: "white", fontWeight: "600", fontSize: 15 },
  previewCard: {
    marginTop: 20,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#000",
    alignItems: "center",
    position: "relative",
  },
  thumbnail: { width: width - 40, height: 200 },
  playBtn: {
    position: "absolute",
    top: "40%",
    left: "45%",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 50,
    padding: 8,
  },
  songTitle: {
    color: "white",
    padding: 10,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "#222",
    width: "100%",
  },
  downloadBtn: {
    marginTop: 20,
    backgroundColor: "#3CB371",
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});
