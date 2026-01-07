import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CardMenu({ title, width, content, onEdit, onDelete }) {
  return (
    <View style={[styles.card, { width: width }]}>
      <View style={styles.contentContainer}>
        <Text style={styles.navbarTitle}>{title}</Text>
        {content && (
          <Text
            style={styles.contentText}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {content}
          </Text>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={onEdit}>
          <Ionicons name="options-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 15,
    minHeight: 90,
    borderWidth: 2,
    borderColor: "#FF8C00",
    borderRadius: 12,
    backgroundColor: "rgb(30, 27, 28)",
  },
  contentContainer: {
    flex: 1,
    marginRight: 10,
  },
  navbarTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  contentText: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    marginTop: 2,
  },
  deleteButton: {
    marginTop: 2,
  },
});
