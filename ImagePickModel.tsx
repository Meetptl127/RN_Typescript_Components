import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as MediaLibrary from "expo-media-library";

interface ImagePickModelProps {
  visible: boolean;
  onClose: () => void;
  onImageSelect?: (uri: string) => void;
}

const { width } = Dimensions.get("window");
const IMAGE_SIZE = width / 1;

const ImagePickModel: React.FC<ImagePickModelProps> = ({
  visible,
  onClose,
  onImageSelect,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [images, setImages] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      requestPermissionAndLoadImages();
    }
  }, [visible]);

  const requestPermissionAndLoadImages = async () => {
    setLoading(true);
    const { status } = await MediaLibrary.requestPermissionsAsync();
    setHasPermission(status === "granted");

    if (status === "granted") {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: "photo",
        first: 100, // adjust as needed
        sortBy: [["creationTime", false]],
      });
      setImages(media.assets);
    }

    setLoading(false);
  };

  const renderItem = ({ item }: { item: MediaLibrary.Asset }) => (
    <Pressable
      onPress={() => {
        onImageSelect?.(item.uri);
        onClose();
      }}
    >
      <Image
        source={{ uri: item.uri }}
        style={{
          width: IMAGE_SIZE,
          height: IMAGE_SIZE,
        }}
        className="m-0.5 rounded-[10px]"
      />
    </Pressable>
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 bg-white">
        <View className="pt-[50px] px-5 pb-2.5 flex-row justify-between bg-gray-100">
          <Text className="text-xl font-bold">Pick an Image</Text>
          <Pressable onPress={onClose}>
            <Text className="text-base text-blue-500">Close</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator size="large" className="mt-5" />
        ) : hasPermission === false ? (
          <Text className="mt-8 text-center text-base text-red-500">
            Permission to access gallery was denied.
          </Text>
        ) : (
          <FlatList
            data={images}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 2 }}
          />
        )}
      </View>
    </Modal>
  );
};

export default ImagePickModel;
