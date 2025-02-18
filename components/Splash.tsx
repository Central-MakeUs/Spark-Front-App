import LottieView from "lottie-react-native";
import { View, TextInput, StyleSheet } from "react-native";

export default function Splash({ setFinisehd }) {
  return (
    <View style={styles.container}>
      <LottieView
        onAnimationFinish={() => {
          setFinisehd();
        }}
        source={require("../assets/splash/Splash.json")}
        style={{ width: "100%", height: "100%" }}
        autoPlay={true}
        loop={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
