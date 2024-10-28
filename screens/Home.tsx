import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { RefreshControl, ScrollView, View } from "react-native";

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
  homeRefreshTimestamp: number;
};

const Home = ({
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
  homeRefreshTimestamp,
}: Props) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [pantry, setPantry] = useState([] as PostObject[]);
  const [postIds, setPostIds] = useState({} as any);
  const [uniquePosts, setUniquePosts] = useState({} as any);

  const getMastodonPosts = async () => {
    setPantry([]);
    setLoaded(false);

    let allPosts: PostObject[] = [];
    let newPostIds: Record<string, boolean> = {};
    let newUniquePosts: Record<string, string> = {};

    const fetchPosts = async (url: string, limit: number) => {
      try {
        const res = await axios.get(url, { params: { limit: limit } });
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

            if (
              postdata.heatindex > 0 &&
              !newPostIds[postdata.id] &&
              newUniquePosts[postdata.body] !== postdata.authorId
            ) {
              newPostIds[postdata.id] = true;
              newUniquePosts[postdata.body] = postdata.authorId;
              return postdata;
            }
            return null;
          });
          allPosts.push(...(posts.filter(Boolean) as PostObject[]));
        }
      } catch (error) {
        console.error(`Failed to fetch from ${url}`, error);
      }
    };

    // Fetch from instances and tags concurrently
    const instancePromises = Object.keys(currentInstances).map(
      async (instance) => {
        await fetchPosts(`https://${instance}/api/v1/trends/statuses`, 20);
        const tagPromises = Object.keys(currentTopics).map((tag) =>
          fetchPosts(`https://${instance}/api/v1/timelines/tag/${tag}`, 10)
        );
        await Promise.allSettled(tagPromises);
      }
    );

    await Promise.allSettled(instancePromises);

    // Fetch posts from specific authors
    const authorPromises = Object.keys(currentAuthors).map(async (account) => {
      const instance = account.split(":")[1];
      const accountId = account.split(":")[2];
      await fetchPosts(
        `https://${instance}/api/v1/accounts/${accountId}/statuses`,
        15
      );
    });

    await Promise.allSettled(authorPromises);

    // Sort posts once after collection and set state
    allPosts = allPosts.sort((a, b) => b.heatindex - a.heatindex);
    setPostIds(newPostIds);
    setUniquePosts(newUniquePosts);
    setPantry(allPosts);
    setLoaded(true);
  };

  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    getMastodonPosts();
  }, []);

  useEffect(() => {
    onRefresh();
  }, [homeRefreshTimestamp]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getMastodonPosts();

    setRefreshing(false);
  }, [currentAuthors, currentTopics, currentInstances]);

  return !!credentials ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{
        flex: 1,
        padding: 10,
        backgroundColor: "#FEF6F7",
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={"#EA7D87"}
          colors={["#ffffff"]}
        />
      }
    >
      <View style={{ height: 10 }} />
      {loaded
        ? pantry.map((post, index) => (
            <Post
              key={index}
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
              archived={false}
            />
          ))
        : null}
    </ScrollView>
  ) : null;
};

export default Home;
