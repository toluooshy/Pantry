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
  Pressable,
} from "react-native";

import Post from "../components/Posts/Post";
import {
  ArchiveObject,
  Credentials,
  PostObject,
  PreferencesObject,
} from "../types";
import SearchBar from "@/components/Search/SearchBar";
import AccountCard from "@/components/Accounts/AccountCard";

type Props = {
  navigation: any;
  credentials: Credentials;
  setCredentials: (data: Credentials) => void;
  updateCredentials: (data: Credentials) => void;
  currentArchive: ArchiveObject;
  setCurrentArchive: (data: ArchiveObject) => void;
  currentPreferences: PreferencesObject;
  setCurrentPreferences: (data: PreferencesObject) => void;
};

const Explore = ({
  navigation,
  credentials,
  setCredentials,
  updateCredentials,
  currentArchive,
  setCurrentArchive,
  currentPreferences,
  setCurrentPreferences,
}: Props) => {
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any>({
    accounts: [],
    statuses: [],
    hashtags: [],
  });
  const [resultType, setResultType] = useState<string>("accounts");

  const searchMastodon = (instances: string[], query: string) => {};

  useEffect(() => {
    searchMastodon(Object.keys(currentPreferences.instances), currentQuery);
  }, [currentQuery]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff", // "rgba(255,145,104,.25)",
      }}
    >
      <View>
        <SearchBar
          query={currentQuery}
          setQuery={setCurrentQuery}
          entries={searchResults}
          setEntries={setSearchResults}
          placeholder={"Search the fediverse..."}
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 4,
        }}
      >
        {["Accounts", "Hashtags"].map((type) => (
          <Pressable
            key={type}
            style={{
              flex: 1,
              backgroundColor:
                resultType === type.toLowerCase() ? "#EA7D87" : "#ffffff",
              padding: 15,
              borderBottomWidth: 0.5,
              borderBottomColor: "#cccccc",
            }}
            onPress={() => {
              setResultType(type.toLowerCase());
            }}
          >
            <Text
              style={{
                color:
                  resultType === type.toLowerCase() ? "#ffffff" : "#EA7D87",
                fontWeight: 600,
                textAlign: "center",
                alignContent: "center",
              }}
            >
              {type}
            </Text>
          </Pressable>
        ))}
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View>
            {searchResults?.[resultType]?.map((result: any) => (
              <View>
                {resultType === "accounts" ? (
                  <AccountCard
                    data={result}
                    credentials={credentials}
                    setCredentials={setCredentials}
                    updateCredentials={updateCredentials}
                    currentArchive={currentArchive}
                    setCurrentArchive={setCurrentArchive}
                    currentPreferences={currentPreferences}
                    setCurrentPreferences={setCurrentPreferences}
                  />
                ) : (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      padding: 10,
                      borderBottomWidth: 0.5,
                      borderBottomColor: "#cccccc",
                    }}
                  >
                    <Pressable
                      onPress={() => {
                        console.log(result.url);
                        console.log(result.history);
                      }}
                    >
                      <Text
                        style={{
                          color: "#EA7D87",
                          fontWeight: 600,
                          fontSize: 18,
                        }}
                      >
                        #{result.name}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Explore;
