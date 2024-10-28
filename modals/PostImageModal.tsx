import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  View,
  TouchableOpacity,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Image,
} from "react-native";

import {
  PinchGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import Modal from "react-native-modal";

import XmarkWhiteIcon from "../assets/icons/xmarkwhite.svg";
import { Video, Audio, ResizeMode } from "expo-av";

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
  const videoRef = useRef<any>(null);
  const [videoDimensions, setVideoDimensions] = useState<any>({
    width: 0,
    height: 0,
  });

  const scale = useSharedValue(1);

  const pinchGestureHandler = useAnimatedGestureHandler({
    onActive: (event: any) => {
      scale.value = event.scale;
    },
    onEnd: () => {
      scale.value = 1;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    const setupAudio = async () => {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });
    };

    setupAudio();
  }, []);

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
                <Video
                  source={{ uri: uri }}
                  ref={videoRef}
                  onReadyForDisplay={({ naturalSize: { width, height } }) => {
                    setVideoDimensions({
                      width,
                      height,
                    });
                  }}
                  onError={handleError}
                  shouldPlay={true}
                  resizeMode={ResizeMode.STRETCH}
                  useNativeControls={true}
                  style={{
                    width: width - 20,
                    height:
                      !!videoDimensions.width && !!videoDimensions.height
                        ? videoDimensions.height *
                          ((width - 20) / videoDimensions.width)
                        : 0,
                    maxHeight: height - 200,
                    marginBottom: 30,
                  }}
                  isLooping={true}
                />
              ) : (
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
                    <Animated.View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Animated.Image
                        source={{
                          uri:
                            uri ||
                            "https://wuvu-defaults.s3.amazonaws.com/blankimage.png",
                        }}
                        style={[
                          {
                            width: "100%",
                            aspectRatio: 1,
                            margin: 10,
                            marginTop: -65,
                          },
                          animatedStyle,
                        ]}
                        resizeMode="contain"
                      />
                    </Animated.View>
                  </PinchGestureHandler>
                </GestureHandlerRootView>
              )}
            </View>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </TouchableWithoutFeedback>
  );
};

export default PostImageModal;
