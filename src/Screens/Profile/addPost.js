import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import {
  View,
  Text,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import ActionButton from "react-native-action-button";
import AsyncStorage from "@react-native-community/async-storage";

import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

import { firebaseConfig } from "./fireBaseConfig";
import uuid from "uuid";

import {
  InputField,
  InputWrapper,
  AddImage,
  SubmitBtn,
  SubmitBtnText,
  StatusWrapper,
} from "./addPostStyle";

import * as Firebase from "firebase";
import { baseURL } from "../../constants";

const AddPost = () => {
  if (!Firebase.apps.length) {
    Firebase.initializeApp(firebaseConfig);
  }

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [caption, setCaption] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
    (async () => {
      const Id = await AsyncStorage.getItem("Id");
      setUserId(Id);
    })();
  }, []);

  const uploadFromCamera = () => {
    ImagePicker.launchCameraAsync({
      width: 500,
      height: 500,
      cropping: false,
      allowsEditing: true,
    }).then((image) => {
      console.log(image);
      const imageUri = Platform.OS === "ios" ? image.sourceURL : image.path;
      setImage(image.uri);
    });
  };

  const uploadFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      width: 500,
      height: 500,
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const submitPost = async () => {
    const imageUrl = await uploadImageAsync();
    console.log("Image Url: ", imageUrl);
    console.log("Post: ", userId);

    axios({
      method: "post",
      url: "/uploadpost",
      baseURL: baseURL,
      data: {
        id: userId,
        urlpost: imageUrl,
        description: caption,
        date: new Date().toISOString(),
      },
    })
      .then((res) => {
        console.log("ysasssssaqaq");
        const message = res.data.message;
        console.log(message);
        if (res.data.value) {
          Alert.alert(message);
        }
      })
      .catch((err) => console.log(err));

    /* firestore()
      .collection("posts")
      .add({
        userId: user.uid,
        post: post,
        postImg: imageUrl,
        postTime: firestore.Timestamp.fromDate(new Date()),
        likes: null,
        comments: null,
      })
      .then(() => {
        console.log("Post Added!");
        Alert.alert(
          "Post published!",
          "Your post has been published Successfully!"
        );
        setPost(null);
      })
      .catch((error) => {
        console.log(
          "Something went wrong with added post to firestore.",
          error
        );
      });*/
    console.log("11111");
  };

  async function uploadImageAsync() {
    const uri = image;
    console.log("zozo");
    setUploading(true);

    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const ref = Firebase.storage().ref().child(uuid.v4());
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    setUploading(false);
    setImage(null);

    Alert.alert("Image uploaded!");
    console.log(snapshot.ref.getDownloadURL());
    return await snapshot.ref.getDownloadURL();
  }

  return (
    <View style={styles.container}>
      <InputWrapper>
        {image != null ? <AddImage source={{ uri: image }} /> : null}

        <InputField
          placeholder="Caption"
          multiline
          numberOfLines={4}
          value={caption}
          onChangeText={(content) => setCaption(content)}
        />
        {uploading ? (
          <StatusWrapper>
            <Text>{transferred} % Completed!</Text>
          </StatusWrapper>
        ) : (
          <SubmitBtn onPress={submitPost}>
            <SubmitBtnText>publish</SubmitBtnText>
          </SubmitBtn>
        )}
      </InputWrapper>
      <ActionButton buttonColor="#f15bb5">
        <ActionButton.Item
          buttonColor="#06d6a0"
          title="Camera"
          onPress={uploadFromCamera}
        >
          <Icon name="camera-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#118ab2"
          title="Gallery"
          onPress={uploadFromGallery}
        >
          <Icon name="md-images-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    </View>
  );
};

export default AddPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white",
  },
});