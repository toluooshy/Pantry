import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  View,
  TouchableOpacity,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from "react-native";
import FastImage from "react-native-fast-image";

import Modal from "react-native-modal";

import XmarkWhiteIcon from "../assets/icons/xmarkwhite.svg";
import Video, { VideoRef } from "react-native-video";

type Props = {
  postImageModalVisible: boolean;
  setPostImageModalVisible: (data: boolean) => void;
  uri: string;
  isPlaying: boolean;
  setIsPlaying: (data: boolean) => void;
  isVideo: boolean;
  togglePlay: () => void;
  handleBuffer: () => void;
  handleError: () => void;
};

const PostImageModal = ({
  postImageModalVisible,
  setPostImageModalVisible,
  uri,
  isPlaying,
  setIsPlaying,
  isVideo,
  togglePlay,
  handleBuffer,
  handleError,
}: Props) => {
  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;
  const videoRef = useRef<VideoRef>(null);
  const [sourceWidth, setSourceWidth] = useState<number>(0);
  const [sourceHeight, setSourceHeight] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const onLoad = (data: any) => {
    setDuration(data.duration);
    setSourceWidth(data.naturalSize.width);
    setSourceHeight(data.naturalSize.height);
  };

  const onEnd = () => {
    videoRef.current?.seek(0);
    setProgress(0);
    togglePlay();
  };

  useEffect(() => {
    togglePlay();
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
      <Modal
        isVisible={postImageModalVisible}
        onSwipeComplete={() => setPostImageModalVisible(false)}
        coverScreen={true}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{ margin: 0 }}
        propagateSwipe
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Pressable
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setPostImageModalVisible(false);
                  togglePlay();
                }}
              >
                <XmarkWhiteIcon width={28} height={28} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              {isVideo ? (
                <View>
                  <Video
                    source={{ uri: uri }}
                    ref={videoRef}
                    onBuffer={handleBuffer}
                    onError={handleError}
                    paused={!isPlaying}
                    resizeMode="cover"
                    onLoad={onLoad}
                    onEnd={onEnd}
                    controls={true}
                    style={{
                      width: width - 20,
                      height:
                        !!sourceWidth && !!sourceHeight
                          ? sourceHeight * ((width - 20) / sourceWidth)
                          : 0,
                      maxHeight: height - 200,
                      marginBottom: 30,
                    }}
                  />
                </View>
              ) : (
                <FastImage
                  style={{
                    width: "100%",
                    aspectRatio: 1,
                    margin: 10,
                    marginTop: -65,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                  source={{
                    uri:
                      uri ||
                      "https://wuvu-defaults.s3.amazonaws.com/blankimage.png",
                  }}
                />
              )}
            </View>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </TouchableWithoutFeedback>
  );
};

export default PostImageModal;
