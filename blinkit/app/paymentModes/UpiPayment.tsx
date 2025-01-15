import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  SectionList,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { Ionicons } from "@expo/vector-icons";

const UpiPayment: React.FC<{ setPaymentMode: (paymentMode: any) => void }> = ({
  setPaymentMode,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [upiID, setUpiID] = useState("");

  // Sample saved UPI data with 'name' property added
  const savedUpi = [
    {
      name: "user1@upi",
      mode: "upi",
      logo: require("../../assets/icons/upi.png"),
    },
    {
      name: "user1@upi",
      mode: "upi",
      logo: require("../../assets/icons/upi.png"),
    },
    {
      name: "user1@upi",
      mode: "upi",
      logo: require("../../assets/icons/upi.png"),
    },
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const data = [
    {
      title: "Saved UPI",
      data: savedUpi,
    },
    {
      title: "UPI Apps",
      data: [
        {
          name: "PhonePe",
          logo: require("../../assets/icons/phonePay-logo.png"),
          mode: "phonePe",
        },
        {
          name: "Google Pay",
          logo: require("../../assets/icons/googlePay-logo.png"),
          mode: "googlepay",
        },
        {
          name: "Paytm",
          logo: require("../../assets/icons/paytm-logo.png"),
          mode: "paytm",
        },
      ],
    },
    {
      title: "Enter UPI Manually",
      data: [{ name: "Add UPI", logo: require("../../assets/icons/upi.png") }],
    },
  ];

  

  return (
    <View style={styles.container}>
      <SectionList
        sections={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, section }) =>
          section.title === "Saved UPI" ? (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                setPaymentMode(item);
                console.log(item, "upipayment");
              }}
            >
              <View style={styles.iconTextContainer}>
                <Image source={item.logo} style={styles.icon} />
                <Text style={styles.text}>{item.name} </Text>
              </View>
            </TouchableOpacity>
          ) : section.title === "UPI Apps" ? (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                setPaymentMode(item);
                console.log(item, "upipayment");
              }}
            >
              <View style={styles.iconTextContainer}>
                <Image source={item.logo} style={styles.icon} />
                <Text style={styles.text}>{item.name}</Text>
              </View>
              <Text style={styles.chevron}>→</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.item}
              onPress={() => toggleAccordion(0)}
            >
              <View style={styles.iconTextContainer}>
                <Image source={item.logo} style={styles.icon} />
                <Text style={styles.text}>{item.name}</Text>
              </View>
              <Ionicons name="add-circle" size={24} color="#000" />
            </TouchableOpacity>
          )
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

      {/* Collapsible section for entering UPI */}
      <Collapsible collapsed={activeIndex !== 0}>
        <View style={styles.accordionContent}>
          <Text style={styles.accordionTitle}>Enter your UPI ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter UPI ID"
            value={upiID}
            onChangeText={setUpiID}
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
  },
  sectionGap: {
    marginVertical: 10, // Gap between sections
  },
});

export default UpiPayment;
