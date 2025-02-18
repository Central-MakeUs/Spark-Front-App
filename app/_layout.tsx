import { WebView } from "react-native-webview";
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { SplashScreen } from "expo-router";
import Splash from "@/components/Splash";
import {
  StyleSheet,
  StatusBar,
  View,
  Platform,
  BackHandler,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import "react-native-reanimated";
import Constants from "expo-constants";

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function RootLayout() {
  SplashScreen.hideAsync();
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener(
          "hardwareBackPress",
          onAndroidBackPress
        );
      };
    }
  }, []);

  return loading ? (
    <>
      <Splash setFinisehd={() => setLoading(false)} />
    </>
  ) : (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <View style={styles.container}>
        <StatusBar barStyle={"default"} animated={true} />
        <WebView
          ref={webViewRef}
          source={{
            uri: "https://www.app-spark.shop/result",
          }}
          javaScriptEnabled
          bounces
          scrollEnabled
          mixedContentMode={"always"}
          allowsBackForwardNavigationGestures
          cacheEnabled={false}
          onContentProcessDidTerminate={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn("Content process terminated, reloading", nativeEvent);
            webViewRef.current?.reload();
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  input: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 50,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
});
