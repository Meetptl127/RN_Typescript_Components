import { SafeAreaView, Platform, StatusBar, View } from "react-native";
import React from "react";

interface CommonSafeAreaViewProps {
  children: React.ReactNode;
  style?: any;
}

const CommonSafeAreaView: React.FC<CommonSafeAreaViewProps> = ({
  children,
  style,
  ...props
}) => {
  if (Platform.OS === "ios") {
    return (
      <SafeAreaView className="flex-1 bg-[#ffffff]" style={style} {...props}>
        {children}
      </SafeAreaView>
    );
  }
  return (
    <View
      className="flex-1"
      style={[
        {
          paddingVertical: StatusBar.currentHeight,
          backgroundColor: "#ffffff",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export default CommonSafeAreaView;
