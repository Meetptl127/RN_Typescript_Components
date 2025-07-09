// components/ImageCard.tsx
import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import LargeText from "./Text/LargeText";
import { ImageCardProps } from "../types/Index";

const ImageCard: React.FC<ImageCardProps> = ({
  images,
  text,
  className = "",
  onPress,
}) => {
  return (
    <TouchableOpacity className="flex-1" onPress={onPress}>
      <View
        /* flex‑1 lets the card stretch / shrink with its siblings  */
        className={`flex-1 items-center justify-center
                  border-2 border-[#dadada] rounded-xl my-2
                  bg-[#f2f2f2] p-4 ${className}`}
      >
        {/*  ── 60 % of card height, stays square ── */}
        <Image
          source={images[0]}
          resizeMode="center"
          style={{ height: "70%", aspectRatio: 1 }}
        />

        <LargeText text={text} />
      </View>
    </TouchableOpacity>
  );
};

export default ImageCard;
