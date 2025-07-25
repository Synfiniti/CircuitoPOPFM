import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, StyleSheet } from "react-native";
import styled from "styled-components/native";

export default function RadioScreen() {
  //States
  const [horaLocal, setHoraLocal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false); 

  //Visualizer start
  const Visualizer = ({ isPlaying }) => {
    const animatedHeights = useRef(
      Array.from({ length: 12 }, () => new Animated.Value(10))
    ).current;

    useEffect(() => {
      let interval;
      if (isPlaying) {
        interval = setInterval(() => {
          animatedHeights.forEach((animatedValue) => {
            Animated.timing(animatedValue, {
              toValue: Math.floor(Math.random() * 40) + 10,
              duration: 150,
              useNativeDriver: false,
            }).start();
          });
        }, 200);
      } else {
        animatedHeights.forEach((animatedValue) => {
          Animated.timing(animatedValue, {
            toValue: 5,
            duration: 150,
            useNativeDriver: false,
          }).start();
        });
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }, [isPlaying]);

    return (
      <VisualizerContainer>
        {animatedHeights.map((height, index) => (
          <AnimatedBar
            key={index}
            style={{
              height,
              backgroundColor: barGradient(index),
            }}
          />
        ))}
      </VisualizerContainer>
    );
  };

  const barGradient = (index) => {
    const colors = ["#ed00e7", "#d100d4", "#b300b8", "#97009e", "#7b007e"];
    return colors[index % colors.length];
  };

  const soundRef = useRef(null);
  const streamUrl = "TU LINK SOURCE";

  useEffect(() => {
    const updateHora = () => {
      const now = new Date();
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "America/Caracas",
      };
      const horaFormateada = new Intl.DateTimeFormat("es-VE", options).format(
        now
      );
      setHoraLocal(horaFormateada);
    };

    updateHora();
    const interval = setInterval(updateHora, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const toggleAudio = async () => {
    if (!soundRef.current) {
      try {
        setIsLoading(true);
        setError(false); // Reiniciamos error

        const { sound } = await Audio.Sound.createAsync(
          { uri: streamUrl },
          { shouldPlay: true }
        );

        soundRef.current = sound;

        setTimeout(() => {
          setIsLoading(false);
          setIsPlaying(true);
        }, 500);
      } catch (error) {
        console.error("Error al cargar el audio:", error);
        setIsLoading(false);
        setError(true); // Ponemos error true si falla
      }
    } else {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setIsPlaying(false);
      setIsLoading(false);
      setError(false);
    }
  };

  return (
    <ContainerRadio style={styles.container}>
      <ContainerHeader>
        <ButtonBack onPress={() => router.back()}>
          <LinearGradient colors={["#ED00E7", "#630063"]} style={styles.button}>
            <FontAwesome5 name="long-arrow-alt-left" size={35} color="white" />
          </LinearGradient>
        </ButtonBack>

        <ContainerLive>
          <ViewView>
            <EnVivoText>EN VIVO</EnVivoText>
            <ImageLive source={require("../assets/images/live.png")} />
          </ViewView>
          <HoraText>{horaLocal}</HoraText>
        </ContainerLive>
      </ContainerHeader>
      <ContainerMain>
        <LogoPop source={require("../assets/images/logo.png")} />
        <RadioText>105.9FM</RadioText>
        <ButtonPlay onPress={toggleAudio}>
          <LinearGradient
            colors={["#ED00E7", "#630063"]}
            style={styles.ButtonPlay}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={40}
              color="#fff"
            />
          </LinearGradient>
        </ButtonPlay>

        {isLoading ? (
          <ActivityContainer>
            <ActivityIndicator size="large" color="#ED00E7" />
          </ActivityContainer>
        ) : error ? (
          <ErrorContainer>
            <ErrorText>
              Ocurrió un problema con la conexión, intente de nuevo más tarde.
            </ErrorText>
          </ErrorContainer>
        ) : (
          <Visualizer isPlaying={isPlaying} />
        )}
      </ContainerMain>
    </ContainerRadio>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0B",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: 7,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 20,
    paddingRight: 20,
  },
  ButtonPlay: {
    borderRadius: 50,
    padding: 25,
    marginTop: 30,
  },
});

const ContainerRadio = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #0b0b0b;
  gap: 50px;
  position: relative;
`;

const ContainerHeader = styled.View`
  width: 300px;
  position: absolute;
  top: 90;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ButtonBack = styled.TouchableOpacity``;

const ContainerLive = styled.View``;

const ViewView = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const ImageLive = styled.Image`
  width: 30px;
  height: 30px;
`;

const ContainerMain = styled.View`
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding-top: 130px;
  margin-top: 50px;
`;

const EnVivoText = styled.Text`
  color: white;
  font-family: "Folks-Normal";
  font-size: 25px;
`;

const HoraText = styled.Text`
  color: white;
  font-size: 18px;
  font-family: "Folks-Light";
  margin-left: 10px;
`;

const RadioText = styled.Text`
  color: white;
  font-size: 35px;
  font-family: "Folks-Bold";
`;

const ButtonPlay = styled.TouchableOpacity`
  padding: 20px;
`;

const LogoPop = styled.Image`
  width: 290px;
  height: 210px;
`;

const VisualizerContainer = styled.View`
  flex-direction: row;
  gap: 5px;
  margin-top: 20px;
  height: 50px;
  align-items: flex-end;
`;

const AnimatedBar = styled(Animated.View)`
  width: 6px;
  border-radius: 3px;
`;

const ActivityContainer = styled.View`
  height: 50px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const ErrorContainer = styled.View`
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  margin-top: 20px;
`;

const ErrorText = styled.Text`
  color: white;
  font-size: 16px;
  text-align: center;
`;
