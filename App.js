import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import Navbar from "./src/components/NavBar";
import CardMenu from "./src/components/CardMenu";
import TextPage from "./src/screens/TextPage";

const Stack = createNativeStackNavigator();

const initialCards = [
  {
    title: "Prompter 1",
    width: 100,
    conteudo:
      "Este é um texto de exemplo para o primeiro prompter. Use para criar suas mensagens.",
  },
  {
    title: "Prompter 2",
    width: 100,
    conteudo:
      "Segundo card com conteúdo de exemplo. Texto curto para demonstração.",
  },
  {
    title: "Prompter 3",
    width: 100,
    conteudo: "Terceiro item da lista. Mini texto para teste do componente.",
  },
];

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
            newCards[index] = cardData;
            return newCards;
          });
        } else {
          setCards((prevCards) => [...prevCards, cardData]);
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
            key={index}
            title={card.title}
            width={cardWidth}
            conteudo={card.conteudo}
            onEdit={() =>
              navigation.navigate("Editor", {
                index: index,
                title: card.title,
                conteudo: card.conteudo,
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
  const [cards, setCards] = useState(initialCards);

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
