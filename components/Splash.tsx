import LottieView from "lottie-react-native";
import { View, StyleSheet } from "react-native";

export default function Splash({ setFinished }: { setFinished: () => void }) {
  return (
    <View style={styles.container}>
      <LottieView
        onAnimationFinish={() => {
          setFinished();
        }}
        source={require("../assets/splash/splash.json")}
        style={styles.lottie}
        autoPlay
        loop={false}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lottie: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
