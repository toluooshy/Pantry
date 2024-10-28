import { useState, useEffect } from "react";

import {
  Text,
  View,
  StatusBar,
  Dimensions,
  SafeAreaView,
  Platform,
  Pressable,
  Image,
} from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LinearGradient } from "expo-linear-gradient";

import Home from "./screens/Home";
import Explore from "./screens/Explore";
import Archive from "./screens/Archive";
import Settings from "./screens/Settings";

import HomeIcon from "./assets/icons/home.svg";
import ExploreIcon from "./assets/icons/explore.svg";
import ArchiveIcon from "./assets/icons/archive.svg";
import SettingsIcon from "./assets/icons/settings.svg";

import {
  Credentials,
  ArchiveObject,
  TopicsObject,
  AuthorsObject,
  InstancesObject,
} from "./types";

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
  const [currentTopics, setCurrentTopics] = useState<TopicsObject>(
    !!credentials ? (credentials.topics as TopicsObject) : ({} as TopicsObject)
  );
  const [currentAuthors, setCurrentAuthors] = useState<AuthorsObject>(
    !!credentials
      ? (credentials.authors as AuthorsObject)
      : ({} as AuthorsObject)
  );
  const [currentInstances, setCurrentInstances] = useState<InstancesObject>(
    !!credentials
      ? (credentials.instances as InstancesObject)
      : ({} as InstancesObject)
  );
  const [homeRefreshTimestamp, setHomeRefreshTimestamp] = useState<number>(
    Date.now()
  );

  const [welcomeModalVisible, setWelcomeModalVisible] =
    useState<boolean>(false);

  const getCredentials = async () => {
    try {
      const data = await AsyncStorage.getItem("pantry-credentials");
      if (!!data) {
        const tempCredentials = JSON.parse(data);
        setCredentials(tempCredentials);
        setCurrentArchive(tempCredentials.archive);
        setCurrentTopics(tempCredentials.topics);
        setCurrentAuthors(tempCredentials.authors);
        setCurrentInstances(tempCredentials.instances);
        setWelcomeModalVisible(false);
      } else {
        setWelcomeModalVisible(true);
        const newCredentials = {
          archive: {},
          topics: {},
          authors: {},
          instances: { "mastodon.social": 1 },
        };
        setCredentials(newCredentials);
        updateCredentials(newCredentials);
        setCurrentArchive(newCredentials.archive);
        setCurrentTopics(newCredentials.topics);
        setCurrentAuthors(newCredentials.authors);
        setCurrentInstances(newCredentials.instances);
        console.log("Welcome to pantry!");
      }
    } catch (error) {
      clearCredentials();
      console.log(error);
    }
  };

  const updateCredentials = async (data: Credentials) => {
    try {
      await AsyncStorage.setItem("pantry-credentials", JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };

  const clearCredentials = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCredentials();
  }, []);

  return (
    <NavigationContainer>
      {!!credentials &&
      !!currentArchive &&
      !!currentTopics &&
      !!currentAuthors &&
      !!currentInstances ? (
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
                      height: Platform.OS === "ios" ? 40 : 57,
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
                    <Image
                      style={{ width: 128, height: 28 }}
                      source={require("./assets/branding/wordmarkcolorful.png")}
                    />
                  </View>
                </SafeAreaView>
              ),
              tabBarButton: (props: any) => (
                <Pressable
                  {...props}
                  onPress={() => {
                    props.onPress();
                    if (props.accessibilityState.selected) {
                      setHomeRefreshTimestamp(Date.now());
                    }
                  }}
                />
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
                currentTopics={currentTopics}
                setCurrentTopics={setCurrentTopics}
                currentAuthors={currentAuthors}
                setCurrentAuthors={setCurrentAuthors}
                currentInstances={currentInstances}
                setCurrentInstances={setCurrentInstances}
                homeRefreshTimestamp={homeRefreshTimestamp}
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
                currentTopics={currentTopics}
                setCurrentTopics={setCurrentTopics}
                currentAuthors={currentAuthors}
                setCurrentAuthors={setCurrentAuthors}
                currentInstances={currentInstances}
                setCurrentInstances={setCurrentInstances}
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
                currentTopics={currentTopics}
                setCurrentTopics={setCurrentTopics}
                currentAuthors={currentAuthors}
                setCurrentAuthors={setCurrentAuthors}
                currentInstances={currentInstances}
                setCurrentInstances={setCurrentInstances}
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
                currentTopics={currentTopics}
                setCurrentTopics={setCurrentTopics}
                currentAuthors={currentAuthors}
                setCurrentAuthors={setCurrentAuthors}
                currentInstances={currentInstances}
                setCurrentInstances={setCurrentInstances}
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
