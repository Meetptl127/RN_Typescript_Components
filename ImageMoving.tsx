// PaywallModel.tsx

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Animated from "react-native-reanimated";

// Import your plan components and SVG
import { Plus } from "./Plus";
import { Ultra } from "./Ultra";
import PaywallClose from "../../../assets/SVG/PaywallClose.svg";

const carouselImages = [
  require("../../../assets/Pic3.png"),
  require("../../../assets/Pic1.png"),
  require("../../../assets/Pic2.png"),
  require("../../../assets/Pic4.png"),
];

const NUM_ROWS = 2;

const splitImages = (images: any[], numRows: number) => {
  const rows: any[][] = Array.from({ length: numRows }, () => []);
  images.forEach((img, idx) => {
    rows[idx % numRows].push(img);
  });
  return rows;
};

type TabType = "Plus" | "Ultra";

interface PaywallModelProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseSuccess?: () => void;
}

export const PaywallModel = ({
  visible,
  onClose,
  onPurchaseSuccess,
}: PaywallModelProps) => {
  const { width: screenWidth } = Dimensions.get("window");
  const imageSize = (screenWidth - 10) / 3; // 3 images per row, 10px margin

  const [selectedTab, setSelectedTab] = useState<TabType>("Plus");

  const imageRows = splitImages(carouselImages, NUM_ROWS);
  // Duplicate each row 3 times for seamless looping
  const extendedRows = imageRows.map((row) => [...row, ...row, ...row]);

  // Refs for FlatLists and scroll offsets
  const flatListRefs = useRef<any[]>([]);
  const scrollOffsets = useRef<number[]>(Array(NUM_ROWS).fill(0));
  const scrollSpeeds = [0.5, 0.3]; // px per frame, adjust for each row

  useEffect(() => {
    let animationFrameIds: number[] = [];
    const animate = () => {
      extendedRows.forEach((row, rowIdx) => {
        const flatListRef = flatListRefs.current[rowIdx];
        if (flatListRef) {
          scrollOffsets.current[rowIdx] += scrollSpeeds[rowIdx];
          const maxOffset = (row.length / 3) * (imageSize + 10);
          if (scrollOffsets.current[rowIdx] > maxOffset) {
            scrollOffsets.current[rowIdx] = 0;
            flatListRef.scrollToOffset({ offset: 0, animated: false });
          } else {
            flatListRef.scrollToOffset({
              offset: scrollOffsets.current[rowIdx],
              animated: false,
            });
          }
        }
      });
      animationFrameIds.push(requestAnimationFrame(animate));
    };
    animationFrameIds.push(requestAnimationFrame(animate));
    return () => {
      animationFrameIds.forEach((id) => cancelAnimationFrame(id));
    };
  }, [imageSize, screenWidth]);

  const handleTabPress = (tab: TabType) => {
    setSelectedTab(tab);
  };

  const renderSelectedPlan = () => {
    switch (selectedTab) {
      case "Plus":
        return <Plus onPurchase={onPurchaseSuccess} />;
      case "Ultra":
        return <Ultra onPurchase={onPurchaseSuccess} />;
      default:
        return <Plus onPurchase={onPurchaseSuccess} />;
    }
  };

  const renderImageItem = ({ item, index }: { item: any; index: number }) => (
    <View
      key={`image-${index}`}
      style={{
        width: imageSize,
        height: imageSize,
        marginRight: 10,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <Image
        source={item}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </View>
  );

  const renderAnimatedRow = (rowData: any[], rowIdx: number) => (
    <View
      key={rowIdx}
      style={{
        height: imageSize,
        marginVertical: 5,
        marginHorizontal: 10,
        overflow: "hidden",
      }}
    >
      <Animated.FlatList
        ref={(ref) => (flatListRefs.current[rowIdx] = ref)}
        data={rowData}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(_, index) => `image-${rowIdx}-${index}`}
        renderItem={renderImageItem}
        getItemLayout={(_, index) => ({
          length: imageSize + 10,
          offset: (imageSize + 10) * index,
          index,
        })}
        initialScrollIndex={0}
        windowSize={3}
        maxToRenderPerBatch={rowData.length}
        removeClippedSubviews={true}
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <StatusBar barStyle="light-content" translucent={false} />
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={onClose}>
            <Text
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 20,
                fontWeight: "400",
              }}
            >
              Restore
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <PaywallClose />
          </TouchableOpacity>
        </View>

        {/* Animated Image Rows */}
        {extendedRows.map((row, rowIdx) => renderAnimatedRow(row, rowIdx))}

        {/* Tab Navigation and Plan Rendering */}
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 16,
              justifyContent: "flex-start",
            }}
          >
            {(["Plus", "Ultra"] as TabType[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => handleTabPress(tab)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  marginHorizontal: 4,
                  borderRadius: 24,
                  backgroundColor: selectedTab === tab ? "#fff" : "#27272a",
                  borderWidth: selectedTab === tab ? 0 : 1,
                  borderColor: "#52525b",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: selectedTab === tab ? "#000" : "#fff",
                    }}
                  >
                    {tab}
                  </Text>
                  {tab === "Plus" && (
                    <Text
                      style={{
                        borderRadius: 999,
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        marginLeft: 8,
                        fontSize: 12,
                        fontWeight: "500",
                        color: selectedTab === tab ? "#fff" : "#000",
                        backgroundColor: selectedTab === tab ? "#000" : "#fff",
                      }}
                    >
                      Populer
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {renderSelectedPlan()}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default PaywallModel;
