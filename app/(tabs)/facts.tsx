import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Sample data - replace with your actual data
const funFactsData = [
  {
    id: 1,
    image: require("../../assets/images/salmon.jpg"), // Replace with your image
    category: "Marine Life",
    title: "Sockeye Salmon",
    description: "The name sockeye comes from a poor attempt to translate the word suk-kegh from British Columbia's native Coast Salish language.",
    author: { name: "Author", date: "1 Date" },
  },
  {
    id: 2,
    image: require("../../assets/images/turtle.jpg"), // Replace with your image
    category: "Marine Life",
    title: "Sea Turtles",
    description: "Sea turtles can hold their breath for up to 7 hours while sleeping underwater.",
    author: { name: "Author", date: "1 Date" },
  },
  {
    id: 3,
    image: require("../../assets/images/otter.jpg"), // Replace with your image
    category: "Marine Life",
    title: "Sea Otters",
    description: "Sea otters use rocks to crack open shellfish, making them...",
    author: { name: "Author", date: "1 Date" },
  },
  {
    id: 4,
    image: require("../../assets/images/water-footprint.jpg"), // Replace with your image
    category: "Conservation",
    title: "What's Your Water Footprint?",
    description: "Many of us have no idea what our daily water usage is. Do you know how much?",
    author: { name: "Author", date: "1 Date" },
  },
];

export default function Facts() {
  const navigation = useNavigation();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Marine Life");
  const [viewMode, setViewMode] = useState("gallery"); // "gallery" or "quizlet"

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleSettingsPress = () => {
    router.push("/settings");
  };

  const categories = ["Marine Life", "Conservation", "Canada"];

  // Filter facts based on selected category
  const filteredFacts = funFactsData.filter(
    (fact) => fact.category === selectedCategory
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fun Facts</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.viewModeToggle} 
            onPress={() => setViewMode(viewMode === "gallery" ? "quizlet" : "gallery")}
          >
            <Ionicons 
              name={viewMode === "gallery" ? "grid-outline" : "list-outline"} 
              size={20} 
              color="#FF6B35" 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettingsPress}>
            <Ionicons name="settings-outline" size={24} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        <Ionicons
          name="filter"
          size={20}
          color="#666"
          style={styles.filterIcon}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                selectedCategory === category && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Fun Facts Grid */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[
          styles.factsGrid, 
          viewMode === "gallery" && styles.factsGridGallery
        ]}>
          {filteredFacts.map((fact) => (
            <TouchableOpacity 
              key={fact.id} 
              style={[
                styles.factCard,
                viewMode === "gallery" && styles.factCardGallery
              ]}
            >
              <Image 
                source={fact.image} 
                style={[
                  styles.factImage,
                  viewMode === "gallery" && styles.factImageGallery
                ]} 
              />
              <View style={styles.factContent}>
                <View style={styles.authorRow}>
                  <Text style={styles.authorText}>
                    {fact.author.name} | {fact.author.date}
                  </Text>
                </View>
                <Text style={styles.factTitle}>{fact.title}</Text>
                <Text style={styles.factDescription} numberOfLines={3}>
                  {fact.description}
                </Text>
                {fact.category === "Marine Life" && (
                  <View style={styles.tagContainer}>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>{fact.category}</Text>
                    </View>
                    {fact.id < 3 && (
                      <View style={[styles.tag, styles.canadaTag]}>
                        <Text style={styles.tagText}>Canada</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0", // Changed to white
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 65, // Adjusted for status bar
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6B4423",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingRight: 10,
  },
  viewModeToggle: {
    padding: 5,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  filterIcon: {
    marginRight: 15,
  },
  categoryScroll: {
    flexDirection: "row",
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
  },
  categoryTabActive: {
    backgroundColor: "#6B4423",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  factsGrid: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Added extra padding for toolbar
  },
  factsGridGallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  factCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: Dimensions.get('window').height - 300, // Nearly full screen height
  },
  factCardGallery: {
    width: "47%",
    margin: "1.5%",
    marginBottom: 15,
    minHeight: 'auto',
  },
  factImage: {
    width: "100%",
    height: Dimensions.get('window').height * 0.4, // 40% of screen height
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  factImageGallery: {
    height: 150,
  },
  factContent: {
    padding: 20,
    flex: 1,
    justifyContent: "space-between",
  },
  authorRow: {
    marginBottom: 8,
  },
  authorText: {
    fontSize: 12,
    color: "#999",
  },
  factTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  factDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 20,
  },
  tagContainer: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  canadaTag: {
    backgroundColor: "#E74C3C",
  },
  tagText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "500",
  },
});