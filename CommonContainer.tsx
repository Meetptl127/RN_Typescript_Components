import { View, ViewProps } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";

interface CommonContainerProps extends ViewProps {
  children: React.ReactNode;
}

const CommonContainer: React.FC<CommonContainerProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <View className="flex-1 bg-[#ffffff] mx-4 -my-4" {...props}>
      <StatusBar style="dark" backgroundColor={"#ffffff"} />
      {children}
    </View>
  );
};

export default CommonContainer;
