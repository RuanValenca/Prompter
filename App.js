import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import Navbar from "./src/components/NavBar";
import CardMenu from "./src/components/CardMenu";
import TextPage from "./src/screens/TextPage";
import PrompterPage from "./src/screens/PrompterPage";

const Stack = createNativeStackNavigator();

const STORAGE_KEY = "@flexnotes_cards";

function HomeScreen({ navigation, route, cards, setCards }) {
  const { width } = useWindowDimensions();
  const cardWidth = width - 40;

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.cardData) {
        const { index, cardData } = route.params;
        if (index !== null && index >= 0) {
          setCards((prevCards) => {
            const newCards = [...prevCards];

            newCards[index] = {
              ...cardData,
              id: prevCards[index]?.id || Date.now(),
            };
            return newCards;
          });
        } else {
          setCards((prevCards) => [
            ...prevCards,
            { ...cardData, id: Date.now() },
          ]);
        }
        navigation.setParams({ cardData: undefined });
      }
    }, [route.params, navigation])
  );

  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView contentContainerStyle={styles.cardsList}>
        <TouchableOpacity
          style={[styles.createButton, { width: cardWidth }]}
          onPress={() => navigation.navigate("Editor", { index: null })}
        >
          <Ionicons name="add-circle-outline" size={24} color="#FF8C00" />
          <Text style={styles.createButtonText}>Criar Novo</Text>
        </TouchableOpacity>

        {cards.map((card, index) => (
          <CardMenu
            key={card.id || index}
            title={card.title}
            width={cardWidth}
            content={card.content}
            onEdit={() =>
              navigation.navigate("Editor", {
                index: index,
                title: card.title,
                content: card.content,
              })
            }
          />
        ))}
      </ScrollView>

      <StatusBar style="light" />
    </View>
  );
}

export default function App() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const cardsWithIds = parsed.map((card, idx) => ({
              id: card.id || Date.now() + idx,
              title: card.title || "",
              width: card.width || 100,
              content: card.content || card.conteudo || "",
            }));
            setCards(cardsWithIds);
          }
        }
      } catch (error) {
        console.warn("Erro ao carregar notas do AsyncStorage:", error);
      }
    };

    loadCards();
  }, []);

  useEffect(() => {
    const saveCards = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
      } catch (error) {
        console.warn("Erro ao salvar notas no AsyncStorage:", error);
      }
    };

    saveCards();
  }, [cards]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">
            {(props) => (
              <HomeScreen {...props} cards={cards} setCards={setCards} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Editor" component={TextPage} />
          <Stack.Screen name="Prompter" component={PrompterPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(39, 36, 37)",
  },
  cardsList: {
    padding: 20,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#FF8C00",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "rgb(30, 27, 28)",
  },
  createButtonText: {
    color: "#FF8C00",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});
