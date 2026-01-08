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
    content: initialContent,
  } = route.params || {};

  const [title, setTitle] = useState(initialTitle || "");
  const [content, setContent] = useState(initialContent || "");
  const [isRecording, setIsRecording] = useState(false);

  useSpeechRecognitionEvent("result", (event) => {
    const transcript = event.results[0]?.transcript;
    if (transcript) {
      setContent((prev) => (prev ? `${prev} ${transcript}` : transcript));
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
      Alert.alert("Aviso", "O título não pode estar vazio.");
      return;
    }

    const cardData = {
      title: title.trim(),
      width: 100,
      content: content.trim(),
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
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
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

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputContainer}>
          <Text style={styles.labelTitle}>Título</Text>
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
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              Texto{" "}
              {isRecording && (
                <Text style={{ color: "#ff4444" }}> (Ouvindo...)</Text>
              )}
            </Text>
            <TouchableOpacity onPress={handleSpeech} style={styles.micButton}>
              <Ionicons
                name={isRecording ? "mic" : "mic-outline"}
                size={24}
                color={isRecording ? "#ff4444" : "#FF8C00"}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.textInput}
            value={content}
            onChangeText={setContent}
            placeholder="Pressione o microfone para ditar ou digite aqui..."
            placeholderTextColor="#666"
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {index !== null && index !== undefined && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
          <TouchableOpacity
            style={styles.prompterButton}
            onPress={() => {
              if (!content.trim()) {
                Alert.alert("Erro", "Adicione texto antes de usar o Prompter.");
                return;
              }
              navigation.navigate("Prompter", {
                content: content.trim(),
              });
            }}
          >
            <Ionicons name="play-circle" size={24} color="#000" />
            <Text style={styles.prompterButtonText}>USAR COMO PROMPTER</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 140, 0, 0.3)",
    position: "relative",
  },
  backButton: {
    padding: 5,
    width: 44,
    alignItems: "flex-start",
  },
  saveButton: {
    padding: 5,
    minWidth: 60,
    alignItems: "flex-end",
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
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  labelTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  micButton: {
    padding: 5,
    marginLeft: 10,
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
  footer: {
    backgroundColor: "rgb(30, 27, 28)",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 140, 0, 0.2)",
    alignItems: "center",
  },
  prompterButton: {
    backgroundColor: "#FF8C00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "100%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  prompterButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 10,
    letterSpacing: 1,
  },
});
