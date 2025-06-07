import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  PanResponder,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Add this interface definition before the component
interface FactsProps {
  onToolbarVisibilityChange?: (visible: boolean) => void;
}

// Add these interfaces after your imports:

interface FactDetails {
  commonName: string;
  scientificName: string;
  type: string;
  diet: string;
  groupName: string;
  averageLifeSpan: string;
  size: string;
  weight: string;
  longDescription: string;
}

interface Fact {
  id: number;
  image: any;
  category: string;
  location: string;  
  title: string;
  description: string;
  author: {
    name: string;
    date: string;
  };
  details: FactDetails;
}

interface FactWithDisplay extends Fact {
  isFromGallery?: boolean;
}

interface FactsProps {
  onToolbarVisibilityChange?: (visible: boolean) => void;
}

// Sample data - replace with your actual data
const funFactsData = [
  {
    id: 1,
    image: require("../../assets/images/salmon.jpg"),
    category: "Marine Life",
    location: "British Columbia",
    title: "Sockeye Salmon",
    description: "The name sockeye comes from a poor attempt to translate the word suk-kegh from British Columbia's native Coast Salish language.",
    author: { name: "Author", date: "1 Date" },
    details: {
      commonName: "Sockeye Salmon",
      scientificName: "Oncorhynchus nerka",
      type: "Fish",
      diet: "Omnivore",
      groupName: "Bind, run",
      averageLifeSpan: "3-5 years",
      size: "Up to 33 inches",
      weight: "5-15 pounds",
      longDescription: "Like all other Pacific salmon, they are born in fresh water. However, sockeye require a lake nearby to rear in. Once hatched, juvenile sockeyes will stay in their natal habitat for up to three years, more than any other salmon."
    }
  },
  {
    id: 2,
    image: require("../../assets/images/turtle.jpg"),
    category: "Marine Life",
    location: "Pacific Ocean",
    title: "Sea Turtles",
    description: "Sea turtles can hold their breath for up to 7 hours while sleeping underwater.",
    author: { name: "Author", date: "1 Date" },
    details: {
      commonName: "Sea Turtle",
      scientificName: "Cheloniidae",
      type: "Reptile",
      diet: "Varies by species",
      groupName: "Bale",
      averageLifeSpan: "50+ years",
      size: "2-6 feet",
      weight: "70-1500 pounds",
      longDescription: "Sea turtles are ancient mariners that have been swimming the world's oceans for over 100 million years."
    }
  },
  {
    id: 3,
    image: require("../../assets/images/otter.jpg"),
    category: "Marine Life",
    location: "North Pacific",
    title: "Sea Otters",
    description: "Sea otters use rocks to crack open shellfish, making them...",
    author: { name: "Author", date: "1 Date" },
    details: {
      commonName: "Sea Otter",
      scientificName: "Enhydra lutris",
      type: "Mammal",
      diet: "Carnivore",
      groupName: "Raft",
      averageLifeSpan: "10-15 years",
      size: "4 feet",
      weight: "45-65 pounds",
      longDescription: "Sea otters are keystone species in their ecosystem."
    }
  },
  {
    id: 4,
    image: require("../../assets/images/water-footprint.jpg"),
    category: "Conservation",
    location: "Global",
    title: "What's Your Water Footprint?",
    description: "Many of us have no idea what our daily water usage is. Do you know how much?",
    author: { name: "Author", date: "1 Date" },
    details: {
      commonName: "Water Conservation",
      scientificName: "N/A",
      type: "Environmental",
      diet: "N/A",
      groupName: "N/A",
      averageLifeSpan: "N/A",
      size: "Average: 80-100 gallons",
      weight: "N/A",
      longDescription: "Understanding your water footprint is crucial for conservation."
    }
  },
];




export default function Facts({ onToolbarVisibilityChange }: FactsProps) {
  const navigation = useNavigation();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Marine Life");
  const [viewMode, setViewMode] = useState("gallery"); // "gallery" or "tinder"
  const [selectedFact, setSelectedFact] = useState<FactWithDisplay | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const nextCardScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current; // Add this
  

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Reset card index when category changes
  useEffect(() => {
    setCurrentCardIndex(0);
  }, [selectedCategory]);

  

  const handleSettingsPress = () => {
    router.push("/settings");
  };

  const categories = ["Marine Life", "Conservation", "Canada"];
  
  // Filter facts based on selected category
  const filteredFacts = funFactsData.filter((fact) => {
    if (selectedCategory === "Canada") {
      // For Canada category, show facts that have the Canada tag
      return fact.category === "Marine Life" && fact.id < 3;
    }
    return fact.category === selectedCategory;
  });

  

  // Pan responder for swiping right on detail view
  const detailPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          hideFactDetails();
        }
      },
    })
  ).current;

  // Create pan responder for Tinder-style cards
  const createTinderPanResponder = () => {
  return PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 5;
    },
    onPanResponderMove: (evt, gestureState) => {
      swipeAnim.setValue(gestureState.dx);
    },
    onPanResponderRelease: (evt, gestureState) => {
      const screenWidth = Dimensions.get('window').width;
      const swipeThreshold = screenWidth * 0.25;
      
      if (gestureState.dx < -swipeThreshold) {
        // First, start fading out
        Animated.parallel([
          Animated.timing(swipeAnim, {
            toValue: -screenWidth,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200, // Slightly faster than swipe
            useNativeDriver: true,
          })
        ]).start(() => {
          // Make sure card is fully invisible before changing content
          fadeAnim.setValue(0);
          
          // Update index
          if (currentCardIndex < filteredFacts.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
          } else {
            setCurrentCardIndex(0);
          }
          
          // Reset position while still invisible
          swipeAnim.setValue(0);
          
          // Small delay before fading in to ensure content has updated
          setTimeout(() => {
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }).start();
          }, 50); // 50ms delay
        });
      } else {
        // Return to center
        Animated.spring(swipeAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });
};

  // Create pan responder for each card (used in old quizlet mode, kept for compatibility)
  const createPanResponder = (fact: Fact) => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && viewMode === "tinder";
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50) {
          showFactDetails(fact, false);
        }
      },
    });
  };

  const showFactDetails = (fact: Fact, isFromGallery: boolean = false) => {
    setSelectedFact({ ...fact, isFromGallery });
    
    if (isFromGallery && onToolbarVisibilityChange) {
      onToolbarVisibilityChange(false);
    }
    
    if (isFromGallery) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

const hideFactDetails = () => {
    if (selectedFact?.isFromGallery && onToolbarVisibilityChange) {
      onToolbarVisibilityChange(true);
    }
    
    if (selectedFact?.isFromGallery) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        setSelectedFact(null);
      });
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setSelectedFact(null);
      });
    }
  };

  const DetailView = ({ fact }: { fact: FactWithDisplay }) => {
    const isGallery = fact.isFromGallery;
    
    if (isGallery) {
      return (
        <>
          <Animated.View 
            style={[
              styles.modalOverlay,
              { opacity: opacityAnim }
            ]}
          >
            <TouchableOpacity 
              style={StyleSheet.absoluteFillObject} 
              onPress={hideFactDetails}
              activeOpacity={1}
            />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.modalDetailContainer,
              {
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
              },
            ]}
          >
            <TouchableOpacity style={styles.modalCloseButton} onPress={hideFactDetails}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            
            <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
              <Image source={fact.image} style={styles.modalDetailImage} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLocation}>{fact.location}</Text>
                <Text style={styles.detailTitle}>{fact.title}</Text>
                <View style={styles.didYouKnowCard}>
                  <Text style={styles.didYouKnowTitle}>Did you know?</Text>
                  <Text style={styles.didYouKnowText}>{fact.description}</Text>
                </View>
                <View style={styles.factsCard}>
                  {Object.entries({
                    'Common Name': fact.details.commonName,
                    'Scientific Name': fact.details.scientificName,
                    'Type': fact.details.type,
                    'Diet': fact.details.diet,
                    'Group Name': fact.details.groupName,
                    'Average Life Span': fact.details.averageLifeSpan,
                    'Size': fact.details.size,
                    'Weight': fact.details.weight,
                  }).map(([label, value]) => (
                    <View key={label} style={styles.factRow}>
                      <Text style={styles.factLabel}>{label}:</Text>
                      <Text style={styles.factValue}>{value}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.longDescription}>{fact.details.longDescription}</Text>
              </View>
            </ScrollView>
          </Animated.View>
        </>
      );
    } else {
      return (
        <Animated.View 
          style={[
            styles.detailContainer,
            { transform: [{ translateX: slideAnim }] }
          ]}
          {...detailPanResponder.panHandlers}
        >
          <TouchableOpacity style={styles.backButton} onPress={hideFactDetails}>
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          
          <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
            <Image source={fact.image} style={styles.detailImage} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLocation}>{fact.location}</Text>
              <Text style={styles.detailTitle}>{fact.title}</Text>
              <View style={styles.didYouKnowCard}>
                <Text style={styles.didYouKnowTitle}>Did you know?</Text>
                <Text style={styles.didYouKnowText}>{fact.description}</Text>
              </View>
              <View style={styles.factsCard}>
                {Object.entries({
                  'Common Name': fact.details.commonName,
                  'Scientific Name': fact.details.scientificName,
                  'Type': fact.details.type,
                  'Diet': fact.details.diet,
                  'Group Name': fact.details.groupName,
                  'Average Life Span': fact.details.averageLifeSpan,
                  'Size': fact.details.size,
                  'Weight': fact.details.weight,
                }).map(([label, value]) => (
                  <View key={label} style={styles.factRow}>
                    <Text style={styles.factLabel}>{label}:</Text>
                    <Text style={styles.factValue}>{value}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.longDescription}>{fact.details.longDescription}</Text>
            </View>
          </ScrollView>
        </Animated.View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fun Facts</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.viewModeToggle} 
            onPress={() => {
              const newMode = viewMode === "gallery" ? "tinder" : "gallery";
              setViewMode(newMode);
              
              // Reset animations when switching to tinder
              if (newMode === "tinder") {
                setCurrentCardIndex(0);
                fadeAnim.setValue(1);
                swipeAnim.setValue(0);
              }
            }}
          >
            <Ionicons 
              name={viewMode === "gallery" ? "grid-outline" : "copy-outline"} 
              size={20} 
              color="#FF6B35" 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettingsPress}>
            <Ionicons name="settings-outline" size={24} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <Ionicons name="filter" size={20} color="#666" style={styles.filterIcon} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryTab, selectedCategory === category && styles.categoryTabActive]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Fun Facts - Different layouts for different modes */}
      {viewMode === "gallery" ? (
        // Gallery Mode - Grid Layout
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={[styles.factsGrid, styles.factsGridGallery]}>
            {filteredFacts.map((fact) => (
              <View
                key={fact.id}
                style={[styles.factCard, styles.factCardGallery]}
              >
                <TouchableOpacity
                  onPress={() => showFactDetails(fact, true)}
                  activeOpacity={0.7}
                >
                  <Image 
                    source={fact.image} 
                    style={[styles.factImage, styles.factImageGallery]} 
                  />
                  <View style={styles.factContent}>
                    <View style={styles.authorRow}>
                      <Text style={styles.authorText}>{fact.author.name} | {fact.author.date}</Text>
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
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        // Tinder Mode - Card Stack
        <View style={styles.tinderContainer}>
          {filteredFacts.length > 0 && (
            <>
              
              {/* Current card */}
              <Animated.View
                {...createTinderPanResponder().panHandlers}
                style={[
                  styles.factCard,
                  styles.tinderCard,
                  {
                    opacity: fadeAnim, // This creates the fade effect
                    transform: [
                      { translateX: swipeAnim },
                      {
                        rotate: swipeAnim.interpolate({
                          inputRange: [-200, 0, 200],
                          outputRange: ['-10deg', '0deg', '10deg'],
                        })
                      }
                    ]
                  }
                ]}
              >
                <TouchableOpacity
                  onPress={() => showFactDetails(filteredFacts[currentCardIndex], false)}
                  activeOpacity={0.9}
                  style={{ flex: 1 }} 
                >
                  <Image 
                    source={filteredFacts[currentCardIndex].image} 
                    style={styles.factImage} 
                  />
                  <View style={styles.factContent}>
                    <View style={styles.authorRow}>
                      <Text style={styles.authorText}>
                        {filteredFacts[currentCardIndex].author.name} | {filteredFacts[currentCardIndex].author.date}
                      </Text>
                    </View>
                    <Text style={styles.factTitle}>{filteredFacts[currentCardIndex].title}</Text>
                    <Text style={styles.factDescription}>
                      {filteredFacts[currentCardIndex].description}
                    </Text>
                    {filteredFacts[currentCardIndex].category === "Marine Life" && (
                      <View style={styles.tagContainer}>
                        <View style={styles.tag}>
                          <Text style={styles.tagText}>{filteredFacts[currentCardIndex].category}</Text>
                        </View>
                        {filteredFacts[currentCardIndex].id < 3 && (
                          <View style={[styles.tag, styles.canadaTag]}>
                            <Text style={styles.tagText}>Canada</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
              
              {/* Swipe indicators */}
              <View style={styles.swipeIndicators}>
                <Text style={styles.swipeText}>← Swipe for next card</Text>
                <Text style={styles.cardCounter}>
                  {currentCardIndex + 1} / {filteredFacts.length}
                </Text>
              </View>
            </>
          )}
        </View>
      )}

      {selectedFact && <DetailView fact={selectedFact} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 65,
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
    paddingBottom: 100,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  factCardGallery: {
    width: "47%",
    margin: "1.5%",
    marginBottom: 15,
  },
  tinderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: Dimensions.get('window').height * 0.15,
  },
  tinderCard: {
    position: "absolute",
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height * 0.63,
    marginBottom: 0,
  },
  nextCard: {
    opacity: 1.0,
    transform: [{ scale: 1 }],
  },
  swipeIndicators: {
    position: "absolute",
    bottom: -Dimensions.get('window').height * 0.025,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  swipeText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  cardCounter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center", // Do - 15 for adjustment
    marginLeft: ((Dimensions.get('window').width - 40) / 2) - 15,
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    
  },
  factImage: {
    width: "100%",
    height: Dimensions.get('window').height * 0.35,
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
  factTitleGallery: {
    fontSize: 16,
  },
  factDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 24,
    marginBottom: 20,
  },
  factDescriptionGallery: {
    fontSize: 13,
    lineHeight: 18,
  },
  tagContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    overflow: "hidden",
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
  swipeHint: {
    position: "absolute",
    bottom: 20,
    right: 20,
    opacity: 0.5,
  },
  swipeHintText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  detailContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: "#FFFFFF",
    zIndex: 1000,
  },
  backButton: {
    position: "absolute",
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
    left: 10,
    padding: 10,
    zIndex: 1001,
  },
  detailScroll: {
    flex: 1,
  },
  detailImage: {
    width: "100%",
    height: 300,
  },
  detailContent: {
    padding: 20,
  },
  detailLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  detailTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  didYouKnowCard: {
    backgroundColor: "#FFF5F0",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  didYouKnowTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B35",
    marginBottom: 10,
  },
  didYouKnowText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  factsCard: {
    backgroundColor: "#F8F8F8",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  factRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  factLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
  factValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  longDescription: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 40,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  modalDetailContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    bottom: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    zIndex: 1000,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1001,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
  },
  modalDetailImage: {
    width: "100%",
    height: 250,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});