import { useState, useEffect } from "react";
import axios from "axios";

import {
  View,
  Text,
  Button,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import Post from "../components/Posts/Post";
import {
  AuthorsObject,
  Credentials,
  InstancesObject,
  PreferencesObject,
  TopicsObject,
} from "../types";
import DocumentPicker from "react-native-document-picker";
import Papa from "papaparse";
import PostAuthor from "@/components/Accounts/AccountChip";

import PlusIcon from "../assets/icons/plus.svg";
import MinusIcon from "../assets/icons/minus.svg";

type Props = {
  navigation: any;
  credentials: Credentials;
  setCredentials: (data: Credentials) => void;
  updateCredentials: (data: Credentials) => void;
  currentPreferences: PreferencesObject;
  setCurrentPreferences: (data: PreferencesObject) => void;
};

const Settings = ({
  navigation,
  credentials,
  setCredentials,
  updateCredentials,
  currentPreferences,
  setCurrentPreferences,
}: Props) => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [jsonData, setJsonData] = useState<any>(null);
  const [mastodonAccounts, setMastodonAccounts] = useState<any>({});

  const [currentTopics, setCurrentTopics] = useState<TopicsObject>(
    currentPreferences.topics
  );
  const [currentAuthors, setCurrentAuthors] = useState<AuthorsObject>(
    currentPreferences.authors
  );
  const [currentInstances, setCurrentInstances] = useState<InstancesObject>(
    currentPreferences.instances
  );

  useEffect(() => {
    console.log("preferences updated");
  }, [currentTopics, currentAuthors, currentInstances]);

  const updatePreferences = (
    preference: string,
    item: string,
    incrementing: boolean
  ) => {
    const tempCredentials = credentials;
    if (
      Object.keys(tempCredentials.preferences[preference]).indexOf(item) !== -1
    ) {
      tempCredentials.preferences[preference][item] += incrementing ? 1 : -1;
    } else {
      tempCredentials.preferences[preference] = {
        ...tempCredentials?.preferences?.[preference],
        [item]: incrementing ? 1 : -1,
      };
    }
    setCredentials(tempCredentials);
    updateCredentials(tempCredentials);
    setCurrentPreferences(tempCredentials.preferences);
    setCurrentTopics(tempCredentials.preferences.topics);
    setCurrentAuthors(tempCredentials.preferences.authors);
    setCurrentInstances(tempCredentials.preferences.instances);
  };

  const handleFileSelect = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // Specify allowed file types
      });

      const response = await fetch(res[0].uri);
      const csvText = await response.text();

      Papa.parse(csvText, {
        complete: (results: any) => {
          setJsonData(results.data);
        },
        header: true, // Set to true if the first row contains headers
      });

      jsonData.forEach(async (entry: any) => {
        const instance = entry["Account address"].split("@")[1];
        const username = entry["Account address"].split("@")[0];
        await axios
          .get(`https://${instance}/api/v1/accounts/lookup?acct=${username}`)
          .then((response: any) => {
            setMastodonAccounts((prevMastodonAccounts: any) => ({
              ...prevMastodonAccounts,
              [`${entry["Account address"]}`]: {
                id: response.data[`id`],
                instance: instance,
                username: username,
              },
            }));
          });
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        throw err;
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{
          display: "flex",
          flex: 1,
          padding: 10,
          backgroundColor: "#FEF6F7",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 10,
              color: "#EA7D87",
            }}
          >
            Topics
          </Text>
          {/* <View>
            <Button title="Import Authors" onPress={handleFileSelect} />
          </View> */}
        </View>
        <ScrollView
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}
          style={{
            height: 180,
            backgroundColor: "#ffffff",
            paddingTop: 10,
          }}
        >
          {Object.keys(currentTopics).map((item, index) => (
            <View
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                margin: 10,
                paddingBottom: 10,
                borderBottomWidth: 1,
              }}
            >
              <View style={{ alignContent: "center" }}>
                <Text>"{item}"</Text>
              </View>
              <View style={{ marginTop: -10 }}>
                <Text
                  style={{
                    color: "#EA7D87",
                    fontSize: 10,
                    marginBottom: 2,
                    textAlign: "center",
                  }}
                >
                  Priority
                </Text>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignSelf: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      updatePreferences("topics", item, false);
                    }}
                  >
                    <Text>-</Text>
                  </TouchableOpacity>
                  <Text style={{ width: 30, textAlign: "center" }}>
                    {currentTopics[item]}
                  </Text>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      updatePreferences("topics", item, true);
                    }}
                  >
                    <Text>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginTop: 20,
              marginBottom: 10,
              color: "#EA7D87",
            }}
          >
            Authors
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}
          style={{
            height: 180,
            padding: 10,
            backgroundColor: "#ffffff", // "rgba(255,145,104,.25)",
          }}
        >
          {Object.keys(currentAuthors).map((item, index) => (
            <View
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                margin: 10,
                paddingBottom: 10,
                borderBottomWidth: 1,
              }}
            >
              <View style={{ alignContent: "center" }}>
                <PostAuthor
                  server={item.split(":")[1]}
                  id={item.split(":")[2]}
                />
              </View>
              <View style={{ marginTop: -10 }}>
                <Text
                  style={{
                    color: "#EA7D87",
                    fontSize: 10,
                    marginBottom: 2,
                    textAlign: "center",
                  }}
                >
                  Priority
                </Text>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignSelf: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      updatePreferences("authors", item, true);
                    }}
                  >
                    <Text>-</Text>
                  </TouchableOpacity>
                  <Text style={{ width: 30, textAlign: "center" }}>
                    {currentAuthors[item]}
                  </Text>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      updatePreferences("authors", item, true);
                    }}
                  >
                    <Text>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginTop: 20,
              marginBottom: 10,
              color: "#EA7D87",
            }}
          >
            Instances
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}
          style={{
            height: 180,
            padding: 10,
            backgroundColor: "#ffffff",
          }}
        >
          {Object.keys(currentInstances).map((item, index) => (
            <View
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                margin: 10,
                paddingBottom: 10,
                borderBottomWidth: 1,
              }}
            >
              <View style={{ alignContent: "center" }}>
                <Text>{item}</Text>
              </View>
              <View style={{ marginTop: -10 }}>
                <Text
                  style={{
                    color: "#EA7D87",
                    fontSize: 10,
                    marginBottom: 2,
                    textAlign: "center",
                  }}
                >
                  Priority
                </Text>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignSelf: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      updatePreferences("instances", item, false);
                    }}
                  >
                    <Text>-</Text>
                  </TouchableOpacity>
                  <Text style={{ width: 30, textAlign: "center" }}>
                    {currentInstances[item]}
                  </Text>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      updatePreferences("instances", item, true);
                    }}
                  >
                    <Text>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default Settings;
