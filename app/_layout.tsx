import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import "react-native-reanimated";
import { useColorScheme } from "@/components/useColorScheme";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { hostname, path, queryParams } = Linking.parse(event.url);

      const sharedUrl = event.url;

      if (sharedUrl.includes("youtube.com") || sharedUrl.includes("youtu.be")) {
        router.push({ pathname: "/youtube", params: { url: sharedUrl } });
      } else if (sharedUrl.includes("instagram.com")) {
        router.push({ pathname: "/instagram", params: { url: sharedUrl } });
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Also handle initial URL (cold start)
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    })();

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Drawer.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen
          name="instagram"
          options={{
            title: "Instagram Downloader",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="youtube"
          options={{
            title: "YouTube Downloader",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="ytToMp3"
          options={{
            title: "YouTube to MP3",
            headerShown: true,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
