import React, { useEffect, useState } from "react";
import axios from "axios";
import { Text, View, ScrollView, Image } from "react-native";

type Props = {
  server: string;
  id: string;
  width: number;
};

const AccountChip = ({ server, id, width }: Props) => {
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [author, setAuthor] = useState<any>(null);

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
    getAuthor(server, id);
  }, []);

  return !isDeleted ? (
    <View>
      {!!author ? (
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Image
            style={{
              width: 24,
              height: 24,
              borderRadius: 24,
              marginRight: 10,
              borderWidth: 0.5,
              borderColor: "#aaaaaa",
            }}
            resizeMode={"cover"}
            source={{
              uri: author?.avatar,
            }}
          />
          <View>
            <ScrollView
              style={{
                display: "flex",
                flexDirection: "row",
                maxWidth: width - 100,
              }}
            >
              <View>
                <Text>{author?.handle}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      ) : null}
    </View>
  ) : null;
};

export default AccountChip;
