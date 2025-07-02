import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as WebBrowser from "expo-web-browser";
import { WebViewMessageEvent } from "react-native-webview";
import { Linking, Platform } from "react-native";

type OnMessageProps = {
  previousUrlRef: React.MutableRefObject<string>;
  currentUrl: string;
};

const onSaveImageAsync = async (imgData: string) => {
  const base64Code = imgData.split("data:image/png;base64,")[1];
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

const OnMessage = ({ previousUrlRef, currentUrl }: OnMessageProps) => {
  return async (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      //이미지 저장
      if (message.type === "screenshot") {
        const imgData = message.data;
        await onSaveImageAsync(imgData);
      }
      //외부 브라우저 처리
      else if (message.type === "external_url") {
        previousUrlRef.current = currentUrl;
        await WebBrowser.openBrowserAsync(message.url);
      }
      //스토어 리뷰페이지 연결
      else if (message.type === "review") {
        let url = "";
        if (Platform.OS === "ios") {
          url =
            "itms-apps://apps.apple.com/app/id6742328947?action=write-review";
        } else {
          url = "";
        }
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  };
};

export default OnMessage;
