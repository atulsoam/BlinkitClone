import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SectionList,
  Image,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { Ionicons } from "@expo/vector-icons";

const CardsPayment: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [cardType, setCardType] = useState<"credit" | "debit" | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Sample saved card data (without logo)
  const savedCards = [
    {
      type: "credit",
      last4: "1234",
      logo: require("../../assets/icons/credit-debitcard.png"),
      name: "credit",
    },
    {
      type: "debit",
      last4: "5678",
      logo: require("../../assets/icons/credit-debitcard.png"),
      name: "debit",
    },
  ];

  const data = [
    {
      title: "Saved Cards",
      data: savedCards,
    },
    {
      title: "Add Card",
      data: [
        {
          type: "credit",
          name: "Credit Card",
          logo: require("../../assets/icons/credit-debitcard.png"),
          last4: "",
        },
        {
          type: "debit",
          name: "Debit Card",
          logo: require("../../assets/icons/credit-debitcard.png"),
          last4: "",
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <SectionList
        sections={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, section }) =>
          section.title === "Saved Cards" ? (
            <TouchableOpacity
              style={styles.item}
              onPress={() => console.log(`Card ${item.type} selected`)}
            >
              <View style={styles.iconTextContainer}>
                {/* No logo here for saved cards */}
                <Text style={styles.text}>
                  {item.type === "credit" ? "Credit Card" : "Debit Card"} (••••{" "}
                  {item?.last4})
                </Text>
              </View>
            </TouchableOpacity>
          ) : section.title === "Add Card" ? (
            <TouchableOpacity
              style={styles.item}
              onPress={() => toggleAccordion(0)}
            >
              <View style={styles.iconTextContainer}>
                <Image source={item.logo} style={styles.icon} />
                <Text style={styles.text}>{item.name}</Text>
              </View>
              <Ionicons name="add-outline" size={24} color="#000" />
            </TouchableOpacity>
          ) : null
        }
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeaderContainer}>
            <View style={styles.line} />
            <Text style={styles.sectionHeader}>{title}</Text>
            <View style={styles.line} />
          </View>
        )}
        SectionSeparatorComponent={() => <View style={styles.sectionGap} />}
      />

      {/* Collapsible section for adding card details */}
      <Collapsible collapsed={activeIndex !== 0}>
        <View style={styles.accordionContent}>
          <Text style={styles.accordionTitle}>Enter Card Details</Text>

          <TextInput
            style={styles.input}
            placeholder="Card Number"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={setCardNumber}
            placeholderTextColor="#ccc"
          />
          <TextInput
            style={styles.input}
            placeholder="Expiry Date (MM/YY)"
            keyboardType="numeric"
            value={expiryDate}
            onChangeText={setExpiryDate}
            placeholderTextColor="#ccc"
          />
          <TextInput
            style={styles.input}
            placeholder="CVV"
            secureTextEntry
            keyboardType="numeric"
            value={cvv}
            onChangeText={setCvv}
            placeholderTextColor="#ccc"
          />
        </View>
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    justifyContent: "center",
    // backgroundColor: "#f2f2f2", // Section background color
    paddingVertical: 8,
    borderRadius: 8,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "#333",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#fff", // Background for each item
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
    resizeMode: "contain",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  chevron: {
    fontSize: 18,
    color: "#000",
  },
  accordionContent: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: 10,
    borderRadius: 8,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 15,
  },
  sectionGap: {
    marginVertical: 10, // Gap between sections
  },
});

export default CardsPayment;
