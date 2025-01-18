import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Image,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "@/utils/Constants";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "@/components/ui/CustomText";
import UniversalAdd from "@/components/ui/universalAdd";
import { getAllProduct } from "@/services/ProductService";
import { screenHeight } from "@/utils/Scaling";
import withCart from "../cart/WithCart";
import { router } from "expo-router";

// Define a type for the product item with additional details
interface ProductItem {
  _id: string;
  name: string;
  price: string;
  discountPrice: string;
  image: string;
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // Typed as string
  const [filteredItems, setFilteredItems] = useState<ProductItem[]>([]); // Typed as an array of ProductItem
  const [isSearching, setIsSearching] = useState<boolean>(false); // To manage the search status
  const [products, setProducts] = useState<ProductItem[]>([]);

  // Fetch all products
  const FetchAllProducts = async () => {
    setIsSearching(true);
    try {
      const data = await getAllProduct();
      setProducts(data); // Assuming data is an array of ProductItem
    } catch (error) {
      console.log(error, "FetchAllProducts");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    FetchAllProducts(); // Fetch all products on component mount
  }, []);

  useEffect(() => {
    // Only filter results if there's a search term
    if (searchTerm === "") {
      setFilteredItems([]); // Show nothing if search term is empty
    } else {
      setIsSearching(true); // Start the search when typing begins
      const timeout = setTimeout(() => {
        const filtered = products.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(filtered);
        setIsSearching(false); // Stop the loading indicator after search is complete
      }, 500); // Debounce the search for better performance

      return () => clearTimeout(timeout); // Cleanup the timeout on effect cleanup
    }
  }, [searchTerm, products]); // Trigger search effect when products or searchTerm changes

  const handleSearch = (text: string) => {
    setSearchTerm(text); // Update search term
  };

  // Function to highlight the matching part of the name
  const highlightText = (text: string, term: string): JSX.Element[] => {
    if (!term) return [<Text key={text}>{text}</Text>]; // If no search term, return the full text

    const parts = text.split(new RegExp(`(${term})`, "gi")); // Split the text into parts, including the match
    return parts.map((part, index) => {
      // If the part matches the search term, highlight it
      const isMatch = part.toLowerCase() === term.toLowerCase();
      return isMatch ? (
        <Text key={index} style={styles.highlightedText}>
          {part}
        </Text>
      ) : (
        <Text key={index}>{part}</Text>
      );
    });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: ProductItem;
    index: number;
  }) => {
    const isSecondColumn = index % 2 !== 0; // Check if it's the second column
    return (
      <View
        style={[
          styles.container,
          isSecondColumn && { marginRight: 10 }, // Apply margin for second column
        ]}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </View>
        <View style={styles.content}>
          <View style={styles.flexrow}>
            <Image
              source={require("../../assets/icons/clock.png")}
              style={styles.icon}
            />
            <CustomText
              fontSize={RFValue(6)}
              fontFamily={Fonts.Medium}
              variant="h8"
            >
              8 Mins
            </CustomText>
          </View>
          {/* Highlight the matching term in the product name */}
          <CustomText
            variant="h8"
            fontFamily={Fonts.Medium}
            numberOfLines={2}
            style={{ marginVertical: 4 }}
          >
            {highlightText(item.name, searchTerm)}
          </CustomText>
          <View style={styles.priceContainer}>
            <View>
              <CustomText
                variant="h8"
                fontFamily={Fonts.Medium}
                // style={{ color: Colors.primary }}
              >
                ₹ {item?.price}
              </CustomText>
              <CustomText
                variant="h8"
                fontFamily={Fonts.Medium}
                style={{ opacity: 0.8, textDecorationLine: "line-through" }}
              >
                ₹ {item?.discountPrice}
              </CustomText>
            </View>
            <UniversalAdd item={item} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.containersafeAreaView}>
      <View style={styles.searchBarContainer}>
        <Ionicons
          name="chevron-back"
          size={RFValue(20)}
          color={Colors.text} // style={styles.icon}
          onPress={() => {
            router.back();
          }}
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Search for food..."
          value={searchTerm}
          placeholderTextColor="#ccc"
          onChangeText={handleSearch}
        />
      </View>

      {isSearching ? (
        <ActivityIndicator
          size="small"
          color={Colors.text}
          style={styles.activityIndicator}
        />
      ) : filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2} // Render items in 2 columns
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        // No results message only if filteredItems is empty
        searchTerm !== "" && (
          <Text style={styles.noResults}>No results found</Text>
        )
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containersafeAreaView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBarContainer: {
    backgroundColor: "#F3F4F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    borderWidth: 0.6,
    borderColor: Colors.border,
    marginTop: 15,
    overflow: "hidden",
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  searchBar: {
    width: "100%",
    paddingLeft: 10,
    height: 50,
  },
  noResults: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  activityIndicator: {
    marginTop: 20,
    alignSelf: "center",
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  container: {
    width: "48%", // Makes the items take 48% of the width for two columns
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    aspectRatio: 1 / 1,
    resizeMode: "contain",
  },
  imageContainer: {
    height: screenHeight * 0.14,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  icon: {
    height: 15,
    width: 15,
  },
  flexrow: {
    flexDirection: "row",
    padding: 2,
    borderRadius: 4,
    gap: 2,
    backgroundColor: Colors.backgroundSecondary,
    alignSelf: "flex-start",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    paddingVertical: 10,
  },
  highlightedText: {
    backgroundColor: Colors.primary, // Highlight color
    color: "#fff", // White text for the highlight
    paddingHorizontal: 2,
  },
});

export default withCart(SearchPage);
