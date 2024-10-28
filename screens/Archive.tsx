import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
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

const Archive = ({
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
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {!!Object.keys(currentArchive).length ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: "#FEF6F7",
          }}
        >
          <View style={{ height: 10 }} />
          {Object.keys(currentArchive).map((postId: string, index) => (
            <Post
              key={index}
              archived={true}
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
              data={credentials.archive[postId] as PostObject}
            />
          ))}
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            backgroundColor: "#FEF6F7",
          }}
        >
          <Text style={{ textAlign: "center", color: "#888888" }}>
            Archive posts from your feed here!
          </Text>
        </View>
      )}
    </TouchableWithoutFeedback>
  );
};

export default Archive;
