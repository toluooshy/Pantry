"use es6";

import { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, Platform, TextInput } from "react-native";

import LetterIcon from "../../assets/icons/letter.svg";
import ClockIcon from "../../assets/icons/clock.svg";
import FireIcon from "../../assets/icons/fire.svg";
import LetterWhiteIcon from "../../assets/icons/letterwhite.svg";
import ClockWhiteIcon from "../../assets/icons/clockwhite.svg";
import FireWhiteIcon from "../../assets/icons/firewhite.svg";
import SearchIcon from "../../assets/icons/search.svg";
import axios from "axios";

type Props = {
  query: string;
  setQuery: (data: string) => void;
  entries: any[];
  setEntries: (data: any) => void;
  placeholder: string;
};

const SearchBar = ({
  query,
  setQuery,
  entries,
  setEntries,
  placeholder,
}: Props) => {
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const searchQuery = async (text: string) => {
    await axios
      .get(`https://mastodon.social/api/v2/search`, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        params: { q: text },
      })
      .then((res) => {
        if (!!res.data) {
          setEntries(res.data);
        } else {
          setEntries({
            accounts: [],
            statuses: [],
            hashtags: [],
          });
        }
      });
  };
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      searchQuery(query);
    }, 50);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 5,
        marginRight: 5,
      }}
    >
      <View
        style={{
          flex: 1,
          height: 48,
        }}
      >
        <TextInput
          style={{
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#98a2b3",
            marginTop: 5,
            marginBottom: 2,
            paddingTop: Platform.OS === "ios" ? 10 : 5,
            paddingBottom: Platform.OS === "ios" ? 10 : 5,
            paddingLeft: 36,
            paddingRight: 10,
            backgroundColor: "#f9fafb",
          }}
          maxLength={36}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={placeholder}
          onChangeText={(value) => {
            setQuery(value);
          }}
          value={query}
        />
        <SearchIcon
          width={20}
          height={20}
          style={{ marginTop: -31, marginLeft: 10 }}
        />
      </View>
    </View>
  );
};

export default SearchBar;
