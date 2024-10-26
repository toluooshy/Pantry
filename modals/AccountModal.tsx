import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import axios from "axios";

import {
  Credentials,
  PostObject,
  ArchiveObject,
  TopicsObject,
  AuthorsObject,
  InstancesObject,
} from "../types";

import SlideView from "../components/Viewports/SlideView";
import AccountCard from "@/components/Accounts/AccountCard";
import Post from "@/components/Posts/Post";

type Props = {
  account: any;
  accountModalVisible: boolean;
  setAccountModalVisible: (data: boolean) => void;
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

const AccountModal = ({
  account,
  accountModalVisible,
  setAccountModalVisible,
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
  const [accountPosts, setAccountPosts] = useState<any>({});

  useEffect(() => {
    let allPosts: PostObject[] = [];

    axios
      .get(`https://mastodon.social/api/v1/accounts/${account.id}/statuses`)
      .then(async (res) => {
        console.log(res.data);
        if (res.data) {
          const posts = res.data.map((post: any) => {
            const postdata: PostObject = {
              id: post.id,
              originalAuthor: {
                avatar: post.account.avatar || "",
                handle: post.account.acct || "",
              },
              authorId: post.account.id,
              timestamp: post.created_at,
              source:
                post.account.acct.indexOf("threads.net") !== -1
                  ? "threads"
                  : post.account.acct.indexOf("lemmy") !== -1
                  ? "lemmy"
                  : "mastodon",
              server: post.account.avatar
                ? post.account.avatar.match(
                    /(?:https?:\/\/)?(?:\w+\.)?([\w-]+\.[\w.-]+)/
                  )[1]
                : "",
              platform: post.account.uri
                ? post.account.uri.split("//")[1].split("/")[0]
                : "",
              body: post.content,
              tags: post.tags.map((posttag: any) => posttag.name),
              images: post.media_attachments?.map(
                (postimage: any) => postimage.url
              ),
              replies: post.replies_count,
              reposts: post.reblogs_count,
              likes: post.favourites_count,
              url: post.url,
              heatindex:
                post.replies_count + post.reblogs_count + post.favourites_count,
            };

            return postdata;
          });
          allPosts.push(...(posts.filter(Boolean) as PostObject[]));
        }
        setAccountPosts(allPosts);
      });
  }, [accountModalVisible]);

  return !!credentials ? (
    <SlideView
      slideViewVisible={accountModalVisible}
      setSlideViewVisible={setAccountModalVisible}
      header={"My Account"}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <View>
          <AccountCard
            data={account}
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
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 80 }}>
            {!!accountPosts.length ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <View style={{ height: 20 }} />
                {accountPosts.map((post: PostObject, index: number) => (
                  <Post
                    key={index}
                    archived={false}
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
                    data={post}
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
                  No posts from this account yet!
                </Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SlideView>
  ) : null;
};

export default AccountModal;
