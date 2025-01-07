import { FC, useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import CartAnimationWrapper from "./CartAnimationWrapper";
import { imageData } from "../../utils/dummyData";
import CartSummary from "./CartSummary";
import { useCartStore } from "@/state/cartStore";

const withCart = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): FC<P> => {
  const WithCartComponent: FC<P> = (props) => {
    const cart = useCartStore((state) => state.cart);
    const count = cart.reduce((acc, item) => acc + item.count, 0);

    const { addItem, removeItem } = useCartStore();

    return (
      <View style={styles.container}>
        <WrappedComponent {...props} />
        <CartAnimationWrapper cartCount={count}>
          <CartSummary
            cartCount={count}
            cartImage={cart![0]?.item.image || null}
          />
        </CartAnimationWrapper>
      </View>
    );
  };
  return WithCartComponent;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withCart;
