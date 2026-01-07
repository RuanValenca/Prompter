import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

export default function PrompterPage({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { content } = route.params || { content: "Nenhum texto fornecido." };

  const [scrolling, setScrolling] = useState(false);
  const [speed, setSpeed] = useState(30);
  const scrollRef = useRef(null);
  const scrollPos = useRef(0);

  useEffect(() => {
    let interval;
    if (scrolling) {
      interval = setInterval(() => {
        scrollPos.current += 1;
        scrollRef.current?.scrollTo({ y: scrollPos.current, animated: false });
      }, speed);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [scrolling, speed]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.closeButton, { top: insets.top + 10 }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close-circle" size={40} color="rgba(255,255,255,0.5)" />
      </TouchableOpacity>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        onScroll={(e) => {
          if (!scrolling) scrollPos.current = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        <Text style={styles.prompterText}>{content}</Text>
        <View style={{ height: height / 2 }} />
      </ScrollView>

      <View style={[styles.controls, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity onPress={() => setSpeed((s) => Math.min(s + 5, 100))}>
          <Ionicons name="remove-circle-outline" size={40} color="#FF8C00" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => setScrolling(!scrolling)}
        >
          <Ionicons
            name={scrolling ? "pause" : "play"}
            size={40}
            color="#000"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSpeed((s) => Math.max(s - 5, 5))}>
          <Ionicons name="add-circle-outline" size={40} color="#FF8C00" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 30,
    paddingTop: height / 2.5,
  },
  prompterText: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "bold",
    lineHeight: 60,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    zIndex: 10,
  },
  controls: {
    flexDirection: "row",
    backgroundColor: "rgba(30,30,30,0.9)",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  playButton: {
    backgroundColor: "#FF8C00",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
});
