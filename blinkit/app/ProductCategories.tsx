import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState, FC, useEffect } from "react";
import CustomHeader from "@/components/ui/CustomHeader";
import { Colors } from "@/utils/Constants";
import SideBar from "./category/SideBar";
import {
  getAllCategories,
  getProductByCategoryId,
} from "@/services/ProductService";
import ProductList from "./category/ProductList";
import withCart from "./cart/WithCart";
// import { categories } from '../utils/dummyData';

const ProductCategories: FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);

  const FetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(data);
      if (data && data.length > 0) {
        setSelectedCategory(data[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const FetchPorducts = async (catagoryID: string) => {
    setProductsLoading(true);
    try {
      const data = await getProductByCategoryId(catagoryID);
      setProducts(data);
      //   if (data && data.length > 0) {
      //     setProducts(data[0]);
      //   }
    } catch (error) {
      console.log(error);
    } finally {
      setProductsLoading(false);
    }
  };
  useEffect(() => {
    FetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory?._id) {
      FetchPorducts(selectedCategory._id);
    }
  }, [selectedCategory]);

  return (
    <View style={styles.mainContainer}>
      <CustomHeader title={selectedCategory?.name || "categories"} search />
      <View style={styles.subContainer}>
        {categoriesLoading ? (
          <ActivityIndicator size="small" color={Colors.border} />
        ) : (
          <SideBar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryPress={(category: any) => setSelectedCategory(category)}
          />
        )}
        {productsLoading ? (
          <ActivityIndicator size="small" color={Colors.border} />
        ) : (
          <ProductList data={products || []} />
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  subContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default withCart(ProductCategories);
