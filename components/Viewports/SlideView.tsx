import React from "react";
import { Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import Modal from "react-native-modal";
import ArrowWhiteIcon from "../../assets/icons/arrowwhite.svg";
import CheckmarkWhiteIcon from "../../assets/icons/checkmarkwhite.svg";
import XmarkWhiteIcon from "../../assets/icons/xmarkwhite.svg";

type Props = {
  slideViewVisible: boolean;
  setSlideViewVisible: (data: boolean) => void;
  header: string;
  children: any;
  confirmationSlideView?: boolean;
  cancellationSlideView?: boolean;
};

const SlideView = ({
  slideViewVisible,
  setSlideViewVisible,
  header,
  children,
  confirmationSlideView = false,
  cancellationSlideView = false,
}: Props) => {
  return (
    <Modal
      isVisible={slideViewVisible}
      onSwipeComplete={() => setSlideViewVisible(false)}
      swipeDirection="right"
      coverScreen={true}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      style={{ margin: 0 }}
      propagateSwipe
    >
      <SafeAreaView style={{ flex: 0, backgroundColor: "#EA7D87" }} />
      <SafeAreaView
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          alignItems: "center",
          margin: 0,
          backgroundColor: "#FEF6F7",
        }}
      >
        <View
          style={{
            flex: 0,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            backgroundColor: "#EA7D87",
            paddingTop: 5,
            marginBottom: 10,
            paddingBottom: 5,
          }}
        >
          {!!!confirmationSlideView && !!!cancellationSlideView ? (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: 5,
                width: 28,
              }}
            >
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  setSlideViewVisible(false);
                }}
              >
                <ArrowWhiteIcon width={28} height={28} />
              </TouchableOpacity>
            </View>
          ) : !!cancellationSlideView ? (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: 5,
                width: 28,
              }}
            >
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  setSlideViewVisible(false);
                }}
              >
                <XmarkWhiteIcon width={28} height={28} />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: 5,
                width: 28,
              }}
            />
          )}
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",
              color: "#ffffff",
              padding: 4,
            }}
          >
            {header}
          </Text>
          {!!confirmationSlideView ? (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginRight: 5,
                width: 28,
              }}
            >
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  setSlideViewVisible(false);
                }}
              >
                <CheckmarkWhiteIcon width={28} height={28} />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginRight: 5,
                width: 28,
              }}
            />
          )}
        </View>
        <View style={{ width: "100%", flex: 1 }}>{children}</View>
      </SafeAreaView>
    </Modal>
  );
};

export default SlideView;
