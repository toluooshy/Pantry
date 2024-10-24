import React from "react";
import { Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import Modal from "react-native-modal";
import ArrowWhiteIcon from "../../assets/icons/arrowwhite.svg";
import CheckmarkWhiteIcon from "../../assets/icons/checkmarkwhite.svg";

type Props = {
  drawerVisible: boolean;
  setDrawerVisible: (data: boolean) => void;
  header: string;
  children: any;
  confirmationDrawer?: boolean;
  height?: number;
  micro?: boolean;
};

const Drawer = ({
  drawerVisible,
  setDrawerVisible,
  header,
  children,
  confirmationDrawer = false,
  height,
  micro,
}: Props) => {
  return (
    <Modal
      isVisible={drawerVisible}
      onSwipeComplete={() => {
        setDrawerVisible(false);
      }}
      onBackdropPress={() => setDrawerVisible(false)}
      swipeDirection="down"
      coverScreen={true}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={{ margin: 0 }}
      propagateSwipe
    >
      <SafeAreaView
        style={{
          position: "absolute",
          bottom: 0,
          backgroundColor: "#f9fafb",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          minHeight: !!micro ? 0 : 400,
          height: !!height ? height : null,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#f9fafb",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              height: 45,
              alignItems: "center",
              backgroundColor: "#101010",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            {!!!confirmationDrawer ? (
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
                    setDrawerVisible(false);
                  }}
                >
                  <ArrowWhiteIcon width={28} height={28} />
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
            <Text style={{ fontSize: 17, fontWeight: "600", color: "#ffffff" }}>
              {header}
            </Text>
            {!!confirmationDrawer ? (
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
                    setDrawerVisible(false);
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
          <View style={{ alignItems: "center" }}>{children}</View>
        </View>
      </SafeAreaView>
      <SafeAreaView
        style={{
          flex: 0,
          backgroundColor: "#f9fafb",
        }}
      />
    </Modal>
  );
};

export default Drawer;
