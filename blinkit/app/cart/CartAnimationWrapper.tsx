import { View, Text, Animated } from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import { hocStyles } from "@/components/global/GlobelStyles";

interface CartAnimationWrapperPrope {
  cartCount: number;
  children: React.ReactNode;
}

const CartAnimationWrapper: FC<CartAnimationWrapperPrope> = ({
  cartCount,
  children,
}) => {
  const slideanim = useRef(new Animated.Value(0)).current;

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (cartCount > 0 && !hasAnimated) {
      Animated.timing(slideanim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setHasAnimated(true);
      });
    } else if (cartCount == 0 && hasAnimated) {
      Animated.timing(slideanim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setHasAnimated(false);
      });
    }
  }, [cartCount, hasAnimated]);

  const slideUpStyle = {
    transform: [
      {
        translateY: slideanim.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
    opacity: slideanim,
  };
  return (
    <Animated.View style={[hocStyles.cartContainer, slideUpStyle]}>
      {children}
    </Animated.View>
  );
};

export default CartAnimationWrapper;
