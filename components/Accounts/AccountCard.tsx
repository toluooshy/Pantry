import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

import FastImage from "react-native-fast-image";

import {
  ArchiveObject,
  Credentials,
  PostObject,
  PreferencesObject,
} from "../../types";

type Props = {
  data: any;
  credentials: Credentials;
  setCredentials: (data: Credentials) => void;
  updateCredentials: (data: Credentials) => void;
  currentArchive: ArchiveObject;
  setCurrentArchive: (data: ArchiveObject) => void;
  currentPreferences: PreferencesObject;
  setCurrentPreferences: (data: PreferencesObject) => void;
};

const AccountCard = ({
  data,
  credentials,
  setCredentials,
  updateCredentials,
  currentArchive,
  setCurrentArchive,
  currentPreferences,
  setCurrentPreferences,
}: Props) => {
  const accountIdentifier = `${data.acct}:mastodon.social:${data.id}`;
  const [isWatching, setIsWatching] = useState<boolean>(
    !!currentPreferences.authors[accountIdentifier]
  );

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

  const updateAuthors = (author: string) => {
    const tempCredentials = credentials;
    if (isWatching) {
      delete tempCredentials.preferences.authors[author];
    } else {
      tempCredentials.preferences.authors = {
        ...tempCredentials?.preferences?.authors,
        [author]: 1,
      };
    }
    setCredentials(tempCredentials);
    updateCredentials(tempCredentials);
    setCurrentPreferences(tempCredentials.preferences);
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
        <View>
          <Text style={{ fontWeight: 600 }}>{data.display_name}</Text>
          <Text style={{ color: "#888888" }}>{data.acct}</Text>
          <Text style={{ marginTop: 10 }}>{`${reformatNumber(
            data.followers_count
          )}${data.followers_count !== 1 ? " followers" : " follower"}`}</Text>
        </View>
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
    </View>
  );
};

export default AccountCard;
