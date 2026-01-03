import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export default function TextPage({ navigation, route }) {
  const insets = useSafeAreaInsets();

  const {
    index,
    title: initialTitle,
    conteudo: initialConteudo,
  } = route.params || {};

  const [title, setTitle] = useState(initialTitle || "");
  const [conteudo, setConteudo] = useState(initialConteudo || "");
  const [isRecording, setIsRecording] = useState(false);

  useSpeechRecognitionEvent("result", (event) => {
    const transcript = event.results[0]?.transcript;
    if (transcript) {
      setConteudo((prev) => (prev ? `${prev} ${transcript}` : transcript));
    }
  });

  useSpeechRecognitionEvent("end", () => {
    setIsRecording(false);
  });

  const handleSpeech = async () => {
    if (isRecording) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }

    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      Alert.alert(
        "Permissão Negada",
        "O FlexNotes precisa de acesso ao microfone para ditar notas."
      );
      return;
    }

    try {
      setIsRecording(true);

      await ExpoSpeechRecognitionModule.start({
        lang: "pt-BR",
        interimResults: false,
      });
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const handleSave = () => {
    if (title.trim() === "") {
      return;
    }

    const cardData = {
      title: title.trim(),
      width: 100,
      conteudo: conteudo.trim(),
    };

    navigation.navigate("Home", {
      cardData: cardData,
      index: index !== null && index !== undefined ? index : null,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Editor</Text>

        {/* BOTÃO DE VOZ DINÂMICO */}
        <TouchableOpacity onPress={handleSpeech} style={styles.micButtonHeader}>
          <Ionicons
            name={isRecording ? "mic" : "mic-outline"}
            size={26}
            color={isRecording ? "#ff4444" : "#FF8C00"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={title.trim() === ""}
        >
          <Text
            style={[
              styles.saveButtonText,
              title.trim() === "" && styles.saveButtonTextDisabled,
            ]}
          >
            Salvar
          </Text>
        </TouchableOpacity>
      </View>

      {/* ÁREA DE TEXTO */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Digite o título..."
            placeholderTextColor="#666"
            maxLength={100}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Texto{" "}
            {isRecording && (
              <Text style={{ color: "#ff4444" }}> (Ouvindo...)</Text>
            )}
          </Text>
          <TextInput
            style={styles.textInput}
            value={conteudo}
            onChangeText={setConteudo}
            placeholder="Pressione o microfone para ditar ou digite aqui..."
            placeholderTextColor="#666"
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(39, 36, 37)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 140, 0, 0.3)",
  },
  backButton: {
    padding: 5,
  },
  micButtonHeader: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  saveButton: {
    padding: 5,
  },
  saveButtonText: {
    color: "#FF8C00",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonTextDisabled: {
    color: "#666",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  titleInput: {
    backgroundColor: "rgb(30, 27, 28)",
    borderWidth: 2,
    borderColor: "#FF8C00",
    borderRadius: 8,
    padding: 15,
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  textInput: {
    backgroundColor: "rgb(30, 27, 28)",
    borderWidth: 2,
    borderColor: "#FF8C00",
    borderRadius: 8,
    padding: 15,
    color: "#fff",
    fontSize: 16,
    minHeight: 300,
  },
});
