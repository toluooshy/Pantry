import { useState, useEffect } from "react";
import axios from "axios";

import {
  View,
  Text,
  Button,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";

import Post from "../components/Posts/Post";
import {
  ArchiveObject,
  Credentials,
  PostObject,
  PreferencesObject,
} from "../types";

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

const Archive = ({
  navigation,
  credentials,
  setCredentials,
  updateCredentials,
  currentArchive,
  setCurrentArchive,
  currentPreferences,
  setCurrentPreferences,
}: Props) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{
          flex: 1,
          padding: 10,
          backgroundColor: "#FEF6F7", // "rgba(255,145,104,.25)",
        }}
      >
        {!!Object.keys(currentArchive).length ? (
          Object.keys(currentArchive).map((postId: string, index) => (
            <Post
              key={index}
              archived={true}
              credentials={credentials}
              setCredentials={setCredentials}
              updateCredentials={updateCredentials}
              currentArchive={currentArchive}
              setCurrentArchive={setCurrentArchive}
              currentPreferences={currentPreferences}
              setCurrentPreferences={setCurrentPreferences}
              data={credentials.archive[postId] as PostObject}
            />
          ))
        ) : (
          <Text>Nothing archived yet.</Text>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default Archive;
