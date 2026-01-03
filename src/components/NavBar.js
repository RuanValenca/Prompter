import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Navbar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.navbar, { paddingTop: insets.top + 15 }]}>
      <View style={styles.titleContainer}>
        <Text style={styles.navbarTitle}>FlexNotes</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    width: "100%",
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 10,
  },

  titleContainer: {
    flex: 0.7,
  },

  navbarTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "orange",
  },

  iconButton: {
    flex: 0.15,
    alignItems: "center",
    justifyContent: "center",
  },
});
