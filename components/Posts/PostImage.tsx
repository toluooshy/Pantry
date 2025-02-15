"use es6";

import React, { useState } from "react";
import { View, TouchableOpacity, Pressable, Image } from "react-native";
import { Video, ResizeMode } from "expo-av";

import PostImageModal from "../../modals/PostImageModal";

import PlayIcon from "../../assets/icons/play.svg";

type Props = {
  width: any;
  height: any;
  uri: string;
  index: any;
  catalogLength: number;
};

const PostImage = ({
  width,
  height,
  uri,
  index = null,
  catalogLength = 0,
}: Props) => {
  const [postImageModalVisible, setPostImageModalVisible] =
    useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const fileType = uri.split(".").pop();
  const isVideo =
    fileType === "mp4" ||
    fileType === "mpeg" ||
    fileType === "wmv" ||
    fileType === "mov" ||
    fileType === "avi" ||
    fileType === "webm";

  const togglePlay = async () => {
    setIsPlaying(!isPlaying);
  };

  const handleBuffer = async () => {};

  const handleError = async () => {};

  return (
    <View>
      {isVideo ? (
        <View
          style={{
            width: width,
            height: height,
            backgroundColor: "#000000",
            borderRadius: 8,
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setPostImageModalVisible(true);
            }}
            style={{
              zIndex: 2,
              opacity: 0.85,
              position: "absolute",
              top: height / 2 - 50,
              left: width / 2 - 50,
            }}
          >
            <PlayIcon
              width={100}
              height={100}
              style={{
                shadowColor: "#888888",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
              }}
            />
          </TouchableOpacity>
          <Video
            source={{
              uri: uri,
            }}
            onError={handleError}
            resizeMode={ResizeMode.CONTAIN}
            style={{
              width: width,
              height: height,
            }}
          />
        </View>
      ) : (
        <Pressable
          onPress={() => {
            if (!!uri) {
              setPostImageModalVisible(true);
            }
          }}
        >
          <Image
            style={{
              borderWidth: 0.5,
              borderColor: "#aaaaaa",
              width: width,
              height: height,
              borderRadius: 8,
              marginTop: 10,
              marginRight:
                catalogLength > 1 && index !== catalogLength - 1 ? 10 : 0,
            }}
            resizeMode={"cover"}
            source={{
              uri: uri,
            }}
          />
        </Pressable>
      )}
      {!!postImageModalVisible ? (
        <PostImageModal
          postImageModalVisible={postImageModalVisible}
          setPostImageModalVisible={setPostImageModalVisible}
          uri={uri}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          isVideo={isVideo}
          togglePlay={togglePlay}
          handleBuffer={handleBuffer}
          handleError={handleError}
        />
      ) : null}
    </View>
  );
};

export default PostImage;
