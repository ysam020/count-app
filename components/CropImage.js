import React, { useEffect } from "react";
import { View, LogBox, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

LogBox.ignoreAllLogs();

const CropImage = (props) => {
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || mediaLibraryStatus !== "granted") {
        alert("Camera and media library permissions are required!");
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      props.setSelectedImage(result.assets[0].uri);
      props.setBase64(result.assets[0].base64);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0 && result.assets[0].uri) {
      props.setSelectedImage(result.assets[0].uri);
      props.setBase64(result.assets[0].base64);

      // Convert the image to base64 using react-native-image-base64
    } else {
      console.log("Photo-taking was canceled or invalid URI", result);
    }
  };

  return (
    <>
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarInner}>
          <TouchableOpacity
            onPress={pickImage}
            style={{
              width: "50%",
              borderRightWidth: 1,
              borderRightColor: "#efefef",
            }}
          >
            <Text style={styles.bottomBarText}>Choose from gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto} style={{ width: "50%" }}>
            <Text style={styles.bottomBarText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default CropImage;

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    // borderRadius: 20,

    shadowColor: "black",
    shadowOffset: { width: 0, height: -7 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "white",
  },
  bottomBarInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  bottomBarText: {
    textAlign: "center",
    padding: 25,
  },
});
