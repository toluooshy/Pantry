import { useState, useEffect } from "react";

import { Text, View, StatusBar, Dimensions, SafeAreaView } from "react-native";
import FastImage from "react-native-fast-image";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import EncryptedStorage from "react-native-encrypted-storage";

import LinearGradient from "react-native-linear-gradient";

import Home from "./screens/Home";
import Archive from "./screens/Archive";
import Settings from "./screens/Settings";

import HomeIcon from "./assets/icons/home.svg";
import ExploreIcon from "./assets/icons/explore.svg";
import ArchiveIcon from "./assets/icons/archive.svg";
import SettingsIcon from "./assets/icons/settings.svg";

import { ArchiveObject, Credentials, PreferencesObject } from "./types";
import Explore from "./screens/Explore";

const Tab = createBottomTabNavigator();
export default function App() {
  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;

  const [credentials, setCredentials] = useState<Credentials>(
    {} as Credentials
  );
  const [currentArchive, setCurrentArchive] = useState<ArchiveObject>(
    !!credentials
      ? (credentials.archive as ArchiveObject)
      : ({} as ArchiveObject)
  );

  const [currentPreferences, setCurrentPreferences] =
    useState<PreferencesObject>(
      !!credentials
        ? (credentials.preferences as PreferencesObject)
        : ({} as PreferencesObject)
    );

  const [welcomeModalVisible, setWelcomeModalVisible] =
    useState<boolean>(false);

  const getCredentials = async () => {
    try {
      const data = await EncryptedStorage.getItem("pantry-credentials");
      if (!!data) {
        const tempCredentials = JSON.parse(data);
        setCredentials(tempCredentials);
        setCurrentArchive(tempCredentials.archive);
        setCurrentPreferences(tempCredentials.preferences);
        setWelcomeModalVisible(false);
      } else {
        setWelcomeModalVisible(true);
        const newCredentials = {
          preferences: {
            topics: {},
            authors: {},
            instances: { "mastodon.social": 1 },
          },
          archive: {},
        };
        setCredentials(newCredentials);
        updateCredentials(newCredentials);
        setCurrentArchive(newCredentials.archive);
        setCurrentPreferences(newCredentials.preferences);
        console.log("Welcome to pantry!");
      }
    } catch (error) {
      clearCredentials();
      console.log(error);
    }
  };

  const updateCredentials = async (data: Credentials) => {
    try {
      await EncryptedStorage.setItem(
        "pantry-credentials",
        JSON.stringify(data)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const clearCredentials = async () => {
    try {
      await EncryptedStorage.clear();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // clearCredentials();
    getCredentials();
  }, []);

  return (
    <NavigationContainer>
      {!!credentials && !!currentPreferences ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerTintColor: "#ffffff",
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerShadowVisible: false,
            tabBarStyle: {
              backgroundColor: "#ffffff",
            },
            tabBarLabelPosition: "below-icon",
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ focused }) => {
              if (route.name === "Home") {
                return <HomeIcon opacity={focused ? 1 : 0.4} />;
              } else if (route.name === "Explore") {
                return <ExploreIcon opacity={focused ? 1 : 0.4} />;
              } else if (route.name === "Archive") {
                return <ArchiveIcon opacity={focused ? 1 : 0.4} />;
              } else if (route.name === "Settings") {
                return <SettingsIcon opacity={focused ? 1 : 0.4} />;
              }
            },
          })}
        >
          <Tab.Screen
            name="Home"
            options={{
              headerTitle: (props) => (
                <SafeAreaView
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <StatusBar barStyle="dark-content" />
                  <View
                    style={{
                      width: width,
                      height: 40,
                      marginLeft: -16,
                      paddingLeft: 10,
                      paddingRight: 10,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottomColor: "#cccccc",
                      borderBottomWidth: 0.2,
                    }}
                  >
                    <FastImage
                      style={{ width: 128, height: 28 }}
                      source={require("./assets/branding/wordmarkcolorful.png")}
                    />
                  </View>
                </SafeAreaView>
              ),
            }}
          >
            {(props) => (
              <Home
                {...props}
                credentials={credentials}
                setCredentials={setCredentials}
                updateCredentials={updateCredentials}
                currentArchive={currentArchive}
                setCurrentArchive={setCurrentArchive}
                currentPreferences={currentPreferences}
                setCurrentPreferences={setCurrentPreferences}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Explore"
            options={{
              headerTitle: (props) => (
                <SafeAreaView
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <StatusBar barStyle="dark-content" />
                  <View
                    style={{
                      width: width,
                      height: 30,
                      marginLeft: -15,
                      paddingLeft: 10,
                      paddingRight: 10,
                      marginTop: -10,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#EA7D87",
                        fontWeight: "600",
                        marginTop: 4,
                        fontSize: 22,
                      }}
                    >
                      Explore
                    </Text>
                  </View>
                </SafeAreaView>
              ),
            }}
          >
            {(props) => (
              <Explore
                {...props}
                credentials={credentials}
                setCredentials={setCredentials}
                updateCredentials={updateCredentials}
                currentArchive={currentArchive}
                setCurrentArchive={setCurrentArchive}
                currentPreferences={currentPreferences}
                setCurrentPreferences={setCurrentPreferences}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Archive"
            options={{
              headerTitle: (props) => (
                <SafeAreaView
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <StatusBar barStyle="dark-content" />
                  <View
                    style={{
                      width: width,
                      height: 30,
                      marginLeft: -15,
                      paddingLeft: 10,
                      paddingRight: 10,
                      marginTop: -10,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#EA7D87",
                        fontWeight: "600",
                        marginTop: 4,
                        fontSize: 22,
                      }}
                    >
                      Archive
                    </Text>
                  </View>
                </SafeAreaView>
              ),
            }}
          >
            {(props) => (
              <Archive
                {...props}
                credentials={credentials}
                setCredentials={setCredentials}
                updateCredentials={updateCredentials}
                currentArchive={currentArchive}
                setCurrentArchive={setCurrentArchive}
                currentPreferences={currentPreferences}
                setCurrentPreferences={setCurrentPreferences}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Settings"
            options={{
              headerTitle: (props) => (
                <SafeAreaView
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <StatusBar barStyle="dark-content" />
                  <View
                    style={{
                      width: width,
                      height: 30,
                      marginLeft: -15,
                      paddingLeft: 10,
                      paddingRight: 10,
                      marginTop: -10,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#EA7D87",
                        fontWeight: "600",
                        marginTop: 4,
                        fontSize: 22,
                      }}
                    >
                      Settings
                    </Text>
                  </View>
                </SafeAreaView>
              ),
            }}
          >
            {(props) => (
              <Settings
                {...props}
                credentials={credentials}
                setCredentials={setCredentials}
                updateCredentials={updateCredentials}
                currentPreferences={currentPreferences}
                setCurrentPreferences={setCurrentPreferences}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      ) : (
        <LinearGradient
          colors={["#F48FCC", "#DF6C41"]}
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            margin: 0,
            justifyContent: "center",
            width: width,
            height: height,
          }}
        ></LinearGradient>
      )}
    </NavigationContainer>
  );
}
