import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

import FastImage from "react-native-fast-image";

import {
  Credentials,
  PostObject,
  ArchiveObject,
  TopicsObject,
  AuthorsObject,
  InstancesObject,
} from "../../types";
import AccountModal from "@/modals/AccountModal";

type Props = {
  data: any;
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

const AccountCard = ({
  data,
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
  const accountIdentifier = `${data.acct}:mastodon.social:${data.id}`;
  const [isWatching, setIsWatching] = useState<boolean>(
    !!currentAuthors[accountIdentifier]
  );
  const [accountModalVisible, setAccountModalVisible] =
    useState<boolean>(false);

  const reformatNumber = (num: number) => {
    if (num < 1000) {
      return num.toString();
    } else if (num < 10000) {
      return Math.floor(num).toString();
    } else if (num >= 1000 && num < 1000000) {
      const thousands = num / 1000;
      return `${thousands.toFixed(thousands >= 100 ? 0 : 1)}K`;
    } else if (num >= 1000000 && num < 1000000000) {
      const millions = num / 1000000;
      return `${millions.toFixed(millions >= 100 ? 0 : 2)}M`;
    } else if (num >= 1000000000) {
      const billions = num / 1000000000;
      return `${billions.toFixed(billions >= 100 ? 0 : 2)}B`;
    }
  };

  const truncatedText = (text: string, max: number) => {
    if (text.length > max) {
      return text.slice(0, max - 3) + "...";
    }
    return text;
  };

  const updateAuthors = (author: string) => {
    const tempCredentials = credentials;
    if (isWatching) {
      delete tempCredentials.authors[author];
    } else {
      tempCredentials.authors = {
        ...tempCredentials?.authors,
        [author]: 1,
      };
    }
    setCredentials(tempCredentials);
    updateCredentials(tempCredentials);
    setCurrentTopics(tempCredentials.topics);
    setCurrentAuthors(tempCredentials.authors);
    setCurrentInstances(tempCredentials.instances);
    setIsWatching(!isWatching);
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: "#cccccc",
      }}
    >
      <FastImage
        style={{
          width: 48,
          height: 48,
          borderRadius: 48,
          marginRight: 10,
          borderWidth: 0.5,
          borderColor: "#aaaaaa",
        }}
        resizeMode={FastImage.resizeMode.cover}
        source={{
          uri: data.avatar,
        }}
      />

      <View
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => {
            setAccountModalVisible(true);
          }}
        >
          <Text style={{ fontWeight: 600 }}>
            {truncatedText(data.display_name, 36)}
          </Text>
          <Text style={{ color: "#888888" }}>
            {truncatedText(data.acct, 32)}
          </Text>
          <Text style={{ marginTop: 10 }}>{`${reformatNumber(
            data.followers_count
          )}${data.followers_count !== 1 ? " followers" : " follower"}`}</Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: isWatching ? "#ffffff" : "#EA7D87",
            alignSelf: "center",
            paddingTop: 5,
            paddingBottom: 5,
            borderRadius: 8,
            width: 72,
            borderWidth: isWatching ? 0.5 : 0,
            borderColor: "#cccccc",
          }}
          onPress={() => {
            if (isWatching) {
              updateAuthors(accountIdentifier);
            } else {
              updateAuthors(accountIdentifier);
            }
          }}
        >
          <Text
            style={{
              fontWeight: 600,
              color: isWatching ? "#EA7D87" : "#ffffff",
              textAlign: "center",
            }}
          >
            {isWatching ? "Watching" : "Watch"}
          </Text>
        </Pressable>
      </View>
      {accountModalVisible ? (
        <AccountModal
          account={data}
          accountModalVisible={accountModalVisible}
          setAccountModalVisible={setAccountModalVisible}
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
      ) : null}
    </View>
  );
};

export default AccountCard;
