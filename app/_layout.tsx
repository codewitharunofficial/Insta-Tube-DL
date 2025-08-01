import * as Linking from "expo-linking";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "@/components/useColorScheme";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(drawer)",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      console.log("Received URL:", event.url);

      const { hostname, path, queryParams } = Linking.parse(event.url);
      console.log("Parsed URL:", { hostname, path, queryParams });

      const sharedUrl = event.url.toLowerCase();

      if (
        sharedUrl.includes("youtube.com") ||
        sharedUrl.includes("youtu.be") ||
        sharedUrl.includes("m.youtube.com")
      ) {
        console.log("Navigating to YouTube screen with URL:", sharedUrl);
        router.push({ pathname: "/youtube", params: { url: sharedUrl } });
      } else if (sharedUrl.includes("instagram.com")) {
        console.log("Navigating to Instagram screen with URL:", sharedUrl);
        router.push({ pathname: "/instagram", params: { url: sharedUrl } });
      } else {
        console.log("Unhandled URL:", sharedUrl);
      }
    };

    // Add event listener for deep links
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Handle initial URL or shared text (cold start)
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      console.log("Initial URL:", initialUrl);

      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      } else if (Platform.OS === "android") {
        // Android: Check for shared text via Intent
        try {
          const intentUrl = await Linking.getInitialURL();
          if (intentUrl) {
            console.log("Android Intent URL:", intentUrl);
            handleDeepLink({ url: intentUrl });
          }
        } catch (error) {
          console.log("Error getting Android intent:", error);
        }
      } else if (Platform.OS === "ios") {
        // iOS: Fallback to checking share sheet data
        try {
          const url = await Linking.getInitialURL();
          if (url) {
            console.log("iOS Shared URL:", url);
            handleDeepLink({ url });
          }
        } catch (error) {
          console.log("Error getting iOS shared data:", error);
        }
      }
    })();

    return () => {
      subscription.remove();
    };
  }, [router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen
          name="instagram"
          options={{ title: "Instagram Downloader", headerShown: true }}
        />
        <Stack.Screen
          name="youtube"
          options={{ title: "YouTube Downloader", headerShown: true }}
        />
        <Stack.Screen
          name="ytToMp3"
          options={{ title: "YouTube to MP3", headerShown: true }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default RootLayoutNav;
