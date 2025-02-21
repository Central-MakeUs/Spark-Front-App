import { WebView } from "react-native-webview";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
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

export default function RootLayout() {
  SplashScreen.hideAsync();
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);
  const imageRef = useRef<View>(null);

  if (status === null) {
    requestPermission();
  }

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

  const onSaveImageAsync = async (imgData: any) => {
    const base64Code = imgData.split("data:image/png;base64,")[1];
    console.log(FileSystem.documentDirectory);
    const filename =
      FileSystem.documentDirectory + "spark_strategy_screenshot.png";
    try {
      await FileSystem.writeAsStringAsync(filename, base64Code, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await MediaLibrary.createAssetAsync(filename); // 이미지를 미디어 라이브러리에 저장
    } catch (e) {
      console.log(e);
    }
  };

  const onMessage = async (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      console.log(message.type);
      if (message.type === "screenshot") {
        const imgData = message.data;
        await onSaveImageAsync(imgData);
        console.log("is it successful");
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  };

  return loading ? (
    <>
      <Splash setFinisehd={() => setLoading(false)} />
    </>
  ) : (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <View style={styles.container} ref={imageRef}>
        <StatusBar barStyle={"default"} animated={true} />
        <WebView
          ref={webViewRef}
          source={{
            uri: "https://www.app-spark.shop",
          }}
          javaScriptEnabled
          bounces
          scrollEnabled
          mixedContentMode={"always"}
          allowsBackForwardNavigationGestures
          cacheEnabled={false}
          onMessage={onMessage}
          userAgent={"SparkAgent"}
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
