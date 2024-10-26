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
  Credentials,
  PostObject,
  ArchiveObject,
  TopicsObject,
  AuthorsObject,
  InstancesObject,
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
  currentTopics: TopicsObject;
  setCurrentTopics: (data: TopicsObject) => void;
  currentAuthors: AuthorsObject;
  setCurrentAuthors: (data: AuthorsObject) => void;
  currentInstances: InstancesObject;
  setCurrentInstances: (data: InstancesObject) => void;
};

const Explore = ({
  navigation,
  credentials,
  setCredentials,
  updateCredentials,
  currentArchive,
  setCurrentArchive,
  currentTopics,
  setCurrentTopics,
  currentAuthors,
  setCurrentAuthors,
  currentInstances,
  setCurrentInstances,
}: Props) => {
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any>({
    accounts: [],
    statuses: [],
    hashtags: [],
  });
  const [resultType, setResultType] = useState<string>("accounts");

  const truncatedText = (text: string, max: number) => {
    if (text.length > max) {
      return text.slice(0, max - 3) + "...";
    }
    return text;
  };

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
                    currentTopics={currentTopics}
                    setCurrentTopics={setCurrentTopics}
                    currentAuthors={currentAuthors}
                    setCurrentAuthors={setCurrentAuthors}
                    currentInstances={currentInstances}
                    setCurrentInstances={setCurrentInstances}
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
                        #
                        {truncatedText(
                          result.name + "12345678901234567890",
                          36
                        )}
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
