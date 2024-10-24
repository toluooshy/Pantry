import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Text,
  View,
  Alert,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  Share,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  AnimateStyle,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { LongPressGestureHandler } from "react-native-gesture-handler";

import HTMLView from "react-native-htmlview";
import nlp from "compromise";
import { htmlToText } from "html-to-text";

import {
  ArchiveObject,
  Credentials,
  PostObject,
  PreferencesObject,
} from "../../types";

import PlusIcon from "../../assets/icons/plus.svg";
import MinusIcon from "../../assets/icons/minus.svg";
import FastImage from "react-native-fast-image";
import PostImage from "./PostImage";

type Props = {
  credentials: Credentials;
  setCredentials: (data: Credentials) => void;
  updateCredentials: (data: Credentials) => void;
  currentArchive: ArchiveObject;
  setCurrentArchive: (data: ArchiveObject) => void;
  currentPreferences: PreferencesObject;
  setCurrentPreferences: (data: PreferencesObject) => void;
  data: PostObject;
  archived: boolean;
};

const stopWords = new Set([
  "i",
  "me",
  "my",
  "myself",
  "we",
  "our",
  "ours",
  "ourselves",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "he",
  "him",
  "his",
  "himself",
  "she",
  "her",
  "hers",
  "herself",
  "it",
  "its",
  "itself",
  "they",
  "them",
  "their",
  "theirs",
  "themselves",
  "what",
  "which",
  "who",
  "whom",
  "the",
  "this",
  "that",
  "these",
  "those",
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "having",
  "do",
  "does",
  "did",
  "doing",
  "a",
  "an",
  "the",
  "and",
  "but",
  "if",
  "or",
  "because",
  "as",
  "until",
  "while",
  "of",
  "at",
  "by",
  "for",
  "with",
  "about",
  "against",
  "between",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "to",
  "from",
  "up",
  "down",
  "in",
  "out",
  "on",
  "off",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "s",
  "t",
  "can",
  "will",
  "just",
  "don",
  "should",
  "now",
]);

const Post = ({
  credentials,
  setCredentials,
  updateCredentials,
  currentArchive,
  setCurrentArchive,
  currentPreferences,
  setCurrentPreferences,
  data,
  archived = false,
}: Props) => {
  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;
  const swipeableRef = useRef<any>(null);

  const [curationMode, setCurationMode] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [author, setAuthor] = useState<any>(null);

  const text = data.body;
  const [keywords, setKeywords] = useState<any>(null);

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);

    if (!isNaN(past.getTime())) {
      const diffInSeconds: number = Math.floor(
        (now.getTime() - past.getTime()) / 1000
      );
      const diffInDays = Math.floor(diffInSeconds / 86400);

      const options = { month: "short", day: "numeric" } as any;
      if (now.getFullYear() !== past.getFullYear()) {
        options.year = "numeric";
      }

      if (diffInDays > 7) {
        return past.toLocaleDateString(undefined, options as any);
      }

      const intervals = [
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
      ];

      for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count > 0) {
          return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
        }
      }

      return "just now";
    } else {
      console.error("Invalid date string format.");
    }
  };

  const getSignificantWords = (text: string, topN = 5) => {
    const doc = nlp(text) as any;

    // Extract nouns and verbs as significant words
    const significantWords = doc
      .not("#Adjective")
      .not("#Pronoun")
      .nouns()
      .out("array")
      .concat(doc.not("#Adjective").not("#Pronoun").verbs().out("array"));

    // Count frequencies of words excluding stop words
    const wordCounts = significantWords.reduce((counts: any, word: string) => {
      const lowerWord = word.toLowerCase();
      if (!stopWords.has(lowerWord)) {
        counts[lowerWord] = (counts[lowerWord] || 0) + 1;
      }
      return counts;
    }, {});

    // Sort by frequency and get the top N significant words
    return Object.entries(wordCounts)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, topN)
      .map(
        ([word]) =>
          word
            .replace(/['",.!?;:\-\(\)\[\]{}]/g, "") // Remove all punctuation marks
            .replace(/['’](s|d)\b/g, "") // Remove 's and 'd at the end of words
            .replace(/\s{2,}/g, " ") // Replace multiple spaces with a single space
            .trim() // Trim leading and trailing whitespace
      )
      .filter((word) => word.length < 24);
  };

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
  };

  const updateArchive = (adding: boolean) => {
    const tempCredentials = credentials;
    if (adding) {
      tempCredentials["archive"] = {
        ...tempCredentials?.archive,
        [data.id]: data,
      };

      setCredentials(tempCredentials);
      updateCredentials(tempCredentials);
      setCurrentArchive(tempCredentials.archive);
    } else {
      Alert.alert(
        "Remove post from archive?",
        "Are you sure you want to remove this entry from your personal library of archived posts?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Remove",
            onPress: () => {
              delete tempCredentials["archive"][data.id];
              setCredentials(tempCredentials);
              updateCredentials(tempCredentials);
              setCurrentPreferences(tempCredentials.preferences);
              setIsDeleted(true);
            },
            style: "destructive",
          },
        ],
        {
          cancelable: true,
          onDismiss: () => {},
        }
      );
    }
  };

  const LeftAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value - 100 }],
      };
    });

    return (
      <Reanimated.View style={styleAnimation}>
        <TouchableOpacity
          onPress={() => {
            updateArchive(archived ? false : true);
            if (swipeableRef.current) {
              swipeableRef.current.close();
            }
          }}
        >
          <View
            style={{
              display: "flex",
              width: 100,
              height: "100%",
              justifyContent: "center",
              backgroundColor: archived ? "#FF3B30" : "#34C759",
            }}
          >
            <Text
              style={{
                fontWeight: 600,
                textAlign: "center",
                color: "#ffffff",
              }}
            >
              {archived ? "Remove" : "Archive"}
            </Text>
          </View>
        </TouchableOpacity>
      </Reanimated.View>
    );
  };

  const RightAction = (
    prog: SharedValue<number>,
    drag: SharedValue<number>
  ) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 100 }],
      };
    });

    return (
      <Reanimated.View style={styleAnimation}>
        <TouchableOpacity
          onPress={() => {
            updateArchive(archived ? false : true);
            if (swipeableRef.current) {
              swipeableRef.current.close();
            }
          }}
        >
          <View
            style={{
              display: "flex",
              width: 100,
              height: "100%",
              justifyContent: "center",
              backgroundColor: archived ? "#FF3B30" : "#34C759",
            }}
          >
            <Text
              style={{
                fontWeight: 600,
                textAlign: "center",
                color: "#ffffff",
              }}
            >
              {archived ? "Remove" : "Archive"}
            </Text>
          </View>
        </TouchableOpacity>
      </Reanimated.View>
    );
  };

  const onShare = async (url: string) => {
    try {
      const result = await Share.share({
        message: url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const getAuthor = async (server: string, id: string) => {
    await axios
      .get(`https://${server}/api/v1/accounts/${id}`)
      .then(async (res) => {
        setAuthor({
          avatar: res.data.avatar,
          handle: res.data.acct,
        });
      });
  };

  useEffect(() => {
    setKeywords(getSignificantWords(htmlToText(text), 5));
  }, []);

  useEffect(() => {
    if (archived) {
      getAuthor(data.server, data.authorId);
    } else {
      setAuthor(data.originalAuthor);
    }
  }, []);

  return !isDeleted ? (
    <View>
      {!!author ? (
        <View>
          {!curationMode ? (
            <GestureHandlerRootView>
              <View
                style={{
                  marginBottom: 10,
                  elevation: 4,
                  borderRadius: 8,
                  backgroundColor: "#ffffff",
                  shadowColor: "#888888",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}
              >
                <ReanimatedSwipeable
                  ref={swipeableRef}
                  friction={1}
                  enableTrackpadTwoFingerGesture
                  leftThreshold={10}
                  rightThreshold={0}
                  renderLeftActions={LeftAction}
                  renderRightActions={RightAction}
                  overshootLeft={false}
                  overshootRight={false}
                >
                  <LongPressGestureHandler
                    onHandlerStateChange={({ nativeEvent }) => {
                      if (nativeEvent.state === 4) {
                        // 5 represents the END state
                        setCurationMode(true);
                      }
                    }}
                    minDurationMs={250} // Optional: Set the minimum duration for the long press
                  >
                    <View
                      style={{
                        width: "100%",
                        backgroundColor: "#ffffff",
                        padding: 10,
                        borderRadius: 8,
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 10,
                        }}
                      >
                        <View style={{ display: "flex", flexDirection: "row" }}>
                          <FastImage
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 36,
                              marginRight: 10,
                              borderWidth: 0.5,
                              borderColor: "#aaaaaa",
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                            source={{
                              uri: author?.avatar,
                            }}
                          />
                          <View>
                            <View
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <View>
                                <Text>{author?.handle}</Text>
                              </View>
                            </View>
                            <View>
                              <Text style={{ color: "#888888" }}>
                                {timeAgo(data.timestamp)}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View>
                          <FastImage
                            style={{
                              width: 16,
                              height: 16,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                            source={{
                              uri:
                                data.source === "mastodon"
                                  ? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Mastodon_logotype_%28simple%29_new_hue.svg/2048px-Mastodon_logotype_%28simple%29_new_hue.svg.png"
                                  : data.source === "threads"
                                  ? "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Threads_%28app%29_logo.svg/512px-Threads_%28app%29_logo.svg.png"
                                  : data.source === "lemmy"
                                  ? "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Lemmy_logo.svg/223px-Lemmy_logo.svg.png"
                                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Bluesky_Logo.svg/869px-Bluesky_Logo.svg.png",
                            }}
                          />
                        </View>
                      </View>
                      <View>
                        <HTMLView value={data.body} />
                        {data.images?.length > 0 ? (
                          <ScrollView horizontal={true}>
                            {data.images.map((image, index) => (
                              <PostImage
                                key={index}
                                width={width - 42}
                                height={200}
                                uri={image}
                                index={index}
                                catalogLength={data.images.length}
                              />
                            ))}
                          </ScrollView>
                        ) : null}
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            marginTop: 10,
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <Text>🔥</Text>
                            <Text>
                              {data.replies + data.reposts + data.likes}
                            </Text>
                          </View>
                          <View
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <TouchableOpacity
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                marginRight: 10,
                              }}
                              onPress={() => {
                                onShare(data.url);
                              }}
                            >
                              <Text>📤</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                display: "flex",
                                flexDirection: "row",
                              }}
                              onPress={() => {
                                onShare(data.url);
                              }}
                            >
                              <Text>🚀</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </LongPressGestureHandler>
                </ReanimatedSwipeable>
              </View>
            </GestureHandlerRootView>
          ) : (
            <Pressable
              onPress={() => setCurationMode(false)}
              style={{
                marginBottom: 10,
              }}
            >
              <LinearGradient
                style={{
                  borderRadius: 8,
                  paddingTop: 10,
                  paddingBottom: 10,
                  marginTop: 10,
                  marginBottom: 10,
                }}
                locations={[0, 0.5, 1]}
                colors={[
                  "rgba(0, 0, 0, 0.075)",
                  "rgba(0, 0, 0, 0.05)",
                  "rgba(0, 0, 0, 0.075)",
                ]}
              >
                <View
                  style={{
                    padding: 10,
                  }}
                >
                  {/* Author */}
                  <TouchableWithoutFeedback>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        backgroundColor: "#ffffff",
                        padding: 10,
                        borderRadius: 8,
                        marginBottom: 10,
                        elevation: 4,
                        shadowColor: "#888888",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            justifyContent: "center",
                          }}
                          onPress={() => {
                            updatePreferences(
                              "authors",
                              `${author?.handle}:${data.server}:${data.authorId}`,
                              false
                            );
                            updatePreferences(
                              "instances",
                              `${data.server}`,
                              false
                            );
                          }}
                        >
                          <MinusIcon />
                        </TouchableOpacity>
                        <View
                          style={{
                            display: "flex",
                            flex: 1,
                            flexDirection: "row",
                            marginLeft: 10,
                            marginRight: 10,
                          }}
                        >
                          <View
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <FastImage
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 36,
                                marginRight: 10,
                                borderWidth: 0.5,
                                borderColor: "#aaaaaa",
                              }}
                              resizeMode={FastImage.resizeMode.cover}
                              source={{
                                uri: author?.avatar,
                              }}
                            />
                            <View>
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <View>
                                  <Text>{author?.handle}</Text>
                                </View>
                              </View>
                              <View>
                                <Text style={{ color: "#888888" }}>
                                  {data.platform}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={{
                            justifyContent: "center",
                          }}
                          onPress={() => {
                            updatePreferences(
                              "authors",
                              `${author?.handle}:${data.server}:${data.authorId}`,
                              true
                            );
                            updatePreferences(
                              "instances",
                              `${data.server}`,
                              true
                            );
                          }}
                        >
                          <PlusIcon />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>

                  {/* Text */}

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      marginBottom: 10,
                    }}
                  >
                    {keywords.map((keyword: string, index: number) => (
                      <TouchableWithoutFeedback key={index}>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor: "#ffffff",
                            paddingLeft: 10,
                            paddingRight: 10,
                            borderRadius: 36,
                            marginBottom: 10,
                            marginRight: 10,
                            alignSelf: "center",
                            elevation: 4,
                            shadowColor: "#888888",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              justifyContent: "center",
                            }}
                            onPress={() => {
                              updatePreferences("topics", keyword, false);
                            }}
                          >
                            <MinusIcon />
                          </TouchableOpacity>
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <Text style={{ margin: 10 }}>{keyword}</Text>
                          </View>

                          <TouchableOpacity
                            style={{
                              justifyContent: "center",
                            }}
                            onPress={() => {
                              updatePreferences("topics", keyword, true);
                            }}
                          >
                            <PlusIcon />
                          </TouchableOpacity>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                  {/* 
              <TouchableWithoutFeedback>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: "#ffffff",
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                      }}
                    >
                      <MinusIcon />
                    </TouchableOpacity>
                    <View
                      style={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "row",
                        marginLeft: 10,
                        marginRight: 10,
                      }}
                    >
                      <View>
                        <HTMLView value={data.body} />
                        {keywords && (
                          <View>
                            {keywords.map((keyword: string, index: number) => (
                              <Text key={index} style={{ color: "#000000" }}>
                                {keyword}
                              </Text>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>

                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                      }}
                    >
                      <PlusIcon />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback> */}

                  {/* Images */}
                  {/* {data.images?.length > 0 ? (
                    <View>
                      <TouchableWithoutFeedback>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor: "#ffffff",
                            padding: 10,
                            borderRadius: 8,
                            marginBottom: 10,
                          }}
                        >
                          <View
                            style={{
                              display: "flex",
                              flex: 1,
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                justifyContent: "center",
                              }}
                            >
                              <MinusIcon />
                            </TouchableOpacity>
                            <View
                              style={{
                                display: "flex",
                                flex: 1,
                                flexDirection: "row",
                                marginLeft: 10,
                                marginRight: 10,
                              }}
                            >
                              <ScrollView horizontal={true}>
                                {data.images?.map((image, index) => (
                                  <FastImage
                                    key={index}
                                    style={{
                                      width: width - 128,
                                      height: 150,
                                      borderRadius: 8,
                                      marginTop: 10,
                                      marginRight:
                                        data.images.length > 1 &&
                                        index !== data.images.length - 1
                                          ? 10
                                          : 0,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                    source={{
                                      uri: image,
                                    }}
                                  />
                                ))}
                              </ScrollView>
                            </View>
                            <TouchableOpacity
                              style={{
                                justifyContent: "center",
                              }}
                            >
                              <PlusIcon />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  ) : null} */}

                  {/* Hashtags */}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {data.tags.map((tag, index) => (
                      <TouchableWithoutFeedback key={index}>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor: "#ffffff",
                            paddingLeft: 10,
                            paddingRight: 10,
                            borderRadius: 36,
                            marginBottom: 10,
                            marginRight: 10,
                            alignSelf: "center",
                            elevation: 4,
                            shadowColor: "#888888",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              justifyContent: "center",
                            }}
                            onPress={() => {
                              updatePreferences("topics", tag, false);
                            }}
                          >
                            <MinusIcon />
                          </TouchableOpacity>
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <Text style={{ margin: 10 }}>{tag}</Text>
                          </View>

                          <TouchableOpacity
                            style={{
                              justifyContent: "center",
                            }}
                            onPress={() => {
                              updatePreferences("topics", tag, true);
                            }}
                          >
                            <PlusIcon />
                          </TouchableOpacity>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          )}
        </View>
      ) : (
        <View
          style={{
            marginBottom: 10,
            elevation: 4,
            borderRadius: 8,
            backgroundColor: "#ffffff",
            shadowColor: "#888888",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            opacity: 0.75,
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "#ffffff",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <View style={{ display: "flex", flexDirection: "row" }}>
                <View
                  style={{
                    backgroundColor: "#aaaaaa",
                    width: 36,
                    height: 36,
                    borderRadius: 36,
                    marginRight: 10,
                  }}
                />
                <View>
                  <View>
                    <View
                      style={{
                        backgroundColor: "#bbbbbb",
                        width: 160,
                        height: 15,
                        borderRadius: 4,
                        marginBottom: 6,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: "#aaaaaa",
                      width: 80,
                      height: 15,
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>
              <View>
                <View
                  style={{
                    backgroundColor: "#cccccc",
                    width: 16,
                    height: 16,
                    borderRadius: 16,
                  }}
                />
              </View>
            </View>
            <View>
              <View
                style={{
                  backgroundColor: "#bbbbbb",
                  width: "100%",
                  height: 15,
                  borderRadius: 4,
                  marginBottom: 6,
                }}
              />
              <View
                style={{
                  backgroundColor: "#bbbbbb",
                  width: "100%",
                  height: 15,
                  borderRadius: 4,
                  marginBottom: 6,
                }}
              />
              <View
                style={{
                  backgroundColor: "#bbbbbb",
                  width: "50%",
                  height: 15,
                  borderRadius: 4,
                  marginBottom: 6,
                }}
              />
              {data.images?.length > 0 ? (
                <PostImage
                  width={width - 42}
                  height={200}
                  uri={""}
                  index={0}
                  catalogLength={0}
                />
              ) : null}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: 10,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#aaaaaa",
                    width: 40,
                    height: 15,
                    borderRadius: 4,
                    marginTop: 2,
                  }}
                />
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginRight: 2,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#aaaaaa",
                      width: 20,
                      height: 15,
                      borderRadius: 4,
                      marginTop: 2,
                      marginRight: 10,
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: "#aaaaaa",
                      width: 20,
                      height: 15,
                      borderRadius: 4,
                      marginTop: 2,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  ) : null;
};

export default Post;
