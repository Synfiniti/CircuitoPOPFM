import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Linking, Platform, StyleSheet, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export default function Index() {
  //fuentes
  const [fontsLoaded] = useFonts({
    "Folks-Bold": require("../assets/fonts/Folks-Bold.ttf"),
    "Folks-Normal": require("../assets/fonts/Folks-Normal.ttf"),
    "Folks-Light": require("../assets/fonts/Folks-Light.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ContainerIndex>
      <LinearGradient
        // Background Linear Gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={["rgba(169,0,165,100)", "rgba(90,0,92,100)"]}
        style={styles.background}
      />
      <ContainerGeneral>
        <Caramelo3 source={require("../assets/images/caramelos3.png")} />
        <Caramelo4 source={require("../assets/images/caramelos4.png")} />
        <GrajeaAmarilla
          source={require("../assets/images/grajeaamarilla.png")}
        />
        <GrajeaAzul source={require("../assets/images/grajeaazul.png")} />
        <GrajeaRoja source={require("../assets/images/grajearoja.png")} />
        <GrajeaVerde source={require("../assets/images/grajeaverde.png")} />

        <LogoImage source={require("../assets/images/logo.png")} />
        <ContainerButtons>
          <TouchableOpacity onPress={() => router.push("/radio")}>
            <ButtonRadio source={require("../assets/images/radio.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/tv")}>
            <ButtonTv source={require("../assets/images/tv.png")} />
          </TouchableOpacity>
        </ContainerButtons>
        <ContainerInstagram
          onPress={() =>
            Linking.openURL("https://www.instagram.com/circuitopop/")
          }
        >
          <LogoInstagram source={require("../assets/images/instagram.png")} />
          <TextoInstagram>@circuitopop</TextoInstagram>
        </ContainerInstagram>
      </ContainerGeneral>
    </ContainerIndex>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 1000,
  },
});

const ContainerIndex = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TextoInstagram = styled.Text`
  font-size: 15px;
  color: white;
  font-family: "Folks-Bold";
`;

const ContainerGeneral = styled.View`
  position: relative;
  flex-direction: col;
  justify-content: space-around;
  padding-top: 100px;
  gap: 10px;
`;

const LogoImage = styled.Image`
  width: 290px;
  height: 210px;
`;

const ButtonRadio = styled.Image`
  width: 180px;
  height: 180px;
  ${Platform.OS === "ios" &&
  `
    shadow-color: #000;
    shadow-offset: 0px 4px;
    shadow-opacity: 0.3;
    shadow-radius: 4.65px;
  `}
`;

const ButtonTv = styled.Image`
  width: 180px;
  height: 180px;
`;

const LogoInstagram = styled.Image`
  margin-top: 2px;
  width: 16px;
  height: 16px;
`;

const ContainerButtons = styled.View`
  flex-direction: col;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding-bottom: 20px;
`;

const ContainerInstagram = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
  padding-bottom: 50px;
  gap: 5px;
`;

const Caramelo1 = styled.Image`
  position: absolute;
  width: 400px;
  height: 800px;
  top: 27;
  left: -35;
`;

const Caramelo2 = styled.Image`
  position: absolute;
  width: 400px;
  height: 800px;
  top: 27;
  left: -35;
`;

const Caramelo3 = styled.Image`
  position: absolute;
  width: 500px;
  height: 800px;
  top: 12;
  left: -35;
`;

const Caramelo4 = styled.Image`
  position: absolute;
  width: 400px;
  height: 800px;
  top: 10;
  left: -70;
`;

const GrajeaAmarilla = styled.Image`
  position: absolute;
  width: 79px;
  height: 70px;
  top: 300;
  left: -10;
`;

const GrajeaRoja = styled.Image`
  position: absolute;
  width: 100px;
  height: 100px;
  bottom: 220;
  left: -35;
`;

const GrajeaAzul = styled.Image`
  position: absolute;
  width: 80px;
  height: 80px;
  bottom: 180;
  right: -35;
`;

const GrajeaVerde = styled.Image`
  position: absolute;
  width: 70px;
  height: 70px;
  bottom: 400;
  right: -20;
`;
