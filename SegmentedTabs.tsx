import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import LargeText from "./Text/LargeText";
import { SegmentedTabsProps, TabItem } from "../types/Index";
import XXLText from "./Text/XXLText";

const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs = [],
  initialIndex = 0,
  onChange = () => {},
  style,
  tabStyle,
  title,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex);

  const handlePress = (index: number) => {
    if (index !== selectedIndex) {
      setSelectedIndex(index);
      onChange(index);
    }
  };

  if (!tabs.length) return null;

  return (
    <View className="flex-col  gap-5">
      <XXLText text={title || ""} className="justify-left px-3" />

      <View className="flex-row justify-center w-full" style={style}>
        {(tabs as (string | TabItem)[]).map((tab, index) => {
          const isSelected = index === selectedIndex;
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => handlePress(index)}
              className={`flex-1 mx-2 px-2 py-4 bg-hover rounded-2xl justify-center items-center bg-gray-100 ${
                isSelected
                  ? "border-2 border-#000000"
                  : "border border-gray-300"
              } ${tabStyle || ""}`}
            >
              <LargeText text={typeof tab === "string" ? tab : tab.label} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// <XSText text="HomeScreens" />
// export default SegmentedTabs;

// <SegmentedTabs
// title="Select Baby's Gender"
// tabs={tabs}
// initialIndex={0}
// onChange={() => {}}
// />
