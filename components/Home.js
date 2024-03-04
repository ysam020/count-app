import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import CropImage from "./CropImage";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Table, Row, Rows } from "react-native-table-component";

function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64, setBase64] = useState(null);
  const [confidenceRatio, setConfidenceRatio] = useState(0.25);
  const [iou, setIou] = useState(0.25);
  const [size, setSize] = useState(640);
  const { setUser } = useContext(UserContext);
  const [count, setCount] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [dataFetching, setDataFetching] = useState(true);

  const onConfidenceRatioChange = (value) => {
    setConfidenceRatio(value);
  };

  const onIouChange = (value) => {
    setIou(value);
  };

  const SIZE_OPTIONS = [480, 640, 720];

  const onSizeChange = (value) => {
    const roundedValue = SIZE_OPTIONS.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
    setSize(roundedValue);
  };

  const handleCount = async () => {
    const token = await AsyncStorage.getItem("countThingsToken");

    if (token) {
      const data = {
        base64_image: base64,
        conf: confidenceRatio.toFixed(2),
        iou: iou.toFixed(2),
        size: size,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        setLoading(true);
        const res = await axios.post(
          "https://6bb1-103-11-119-220.ngrok-free.app:8000/count",
          data,
          config
        );

        setCount(res.data);
        setModal(true);
        setLoading(false);
      } catch (error) {
        console.error("API request failed:", error);
      }
    } else {
      console.error("Token not found in AsyncStorage");
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
    setBase64(null);
    setModal(false);
  };

  useEffect(() => {
    async function getCount() {
      const token = await AsyncStorage.getItem("countThingsToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        "https://13.201.88.252:8000/user-counts",
        config
      );
      const convertedData = res.data.map((item) => {
        return [item.timestamp, parseInt(item.count_text)];
      });

      setRows(convertedData);
      setDataFetching(false);
    }

    getCount();
  }, [modal]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/Count.png")}
              style={styles.logo_image}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={async () => {
              setUser(false);
              try {
                await AsyncStorage.removeItem("countThingsToken");
              } catch (error) {
                console.error("Error removing token from AsyncStorage:", error);
              }
            }}
          >
            <Text style={{ marginRight: 10, fontSize: 20 }}>Logout</Text>
            <Ionicons name="log-out-outline" color="red" size={30} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          {selectedImage === null ? (
            dataFetching === true ? (
              <ActivityIndicator size="large" color="red" />
            ) : rows.length > 0 ? (
              <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
                  <Row
                    data={["Timestamp", "Count"]}
                    textStyle={{
                      textAlign: "center",
                      fontWeight: "bold",
                      padding: 5,
                    }}
                    style={styles.head}
                  />
                  <Rows
                    data={rows}
                    textStyle={{ textAlign: "center", padding: 5 }}
                  />
                </Table>
              </ScrollView>
            ) : (
              <Image
                source={require("../assets/no_data.jpg")}
                style={styles.no_data_img}
                resizeMode="contain"
              />
            )
          ) : (
            <>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: selectedImage }}
                  style={{
                    aspectRatio: 4 / 3,
                    width: "100%",
                    marginVertical: 20,
                  }}
                  resizeMode="contain"
                />

                <Text style={{ textAlign: "center", fontSize: 18 }}>
                  Accuracy Margin: {confidenceRatio.toFixed(2)}
                </Text>
                <Slider
                  style={{ width: "75%" }}
                  minimumValue={0}
                  maximumValue={1}
                  value={confidenceRatio}
                  onValueChange={onConfidenceRatioChange}
                  minimumTrackTintColor="#36454F"
                  maximumTrackTintColor="#a9a9a9"
                  thumbTintColor="#36454F"
                  trackStyle={{ height: 20 }}
                  thumbStyle={{ height: 20, width: 20, borderRadius: 10 }}
                  thumbProps={{
                    children: (
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: "#36454F",
                        }}
                      />
                    ),
                  }}
                />

                <Text style={{ textAlign: "center", fontSize: 18 }}>
                  Increase Accuracy: {iou.toFixed(2)}
                </Text>
                <Slider
                  style={{ width: "75%" }}
                  minimumValue={0}
                  maximumValue={1}
                  value={iou}
                  onValueChange={onIouChange}
                  minimumTrackTintColor="#36454F"
                  maximumTrackTintColor="#a9a9a9"
                  thumbTintColor="#36454F"
                  trackStyle={{ height: 20 }}
                  thumbStyle={{ height: 20, width: 20, borderRadius: 10 }}
                  thumbProps={{
                    children: (
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: "#36454F",
                        }}
                      />
                    ),
                  }}
                />

                <Text style={{ textAlign: "center", fontSize: 18 }}>
                  Set Image Size: {size.toFixed(2)}
                </Text>
                <Slider
                  style={{ width: "75%" }}
                  minimumValue={0}
                  maximumValue={1}
                  value={size}
                  onValueChange={onSizeChange}
                  minimumTrackTintColor="#36454F"
                  maximumTrackTintColor="#a9a9a9"
                  thumbTintColor="#36454F"
                  trackStyle={{ height: 20 }}
                  thumbStyle={{ height: 20, width: 20, borderRadius: 10 }}
                  thumbProps={{
                    children: (
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: "#36454F",
                        }}
                      />
                    ),
                  }}
                />

                {loading && <ActivityIndicator size="large" color="red" />}

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modal}
                  onRequestClose={closeModal}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalText}>Count Available:</Text>
                      <Text style={styles.modalText}>{count}</Text>
                      <TouchableOpacity
                        onPress={closeModal}
                        style={styles.closeButton}
                      >
                        <Text style={styles.closeButtonText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>

                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedImage(null)}
                    style={{
                      textAlign: "center",
                      padding: 25,
                      width: "50%",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ ...styles.icon, backgroundColor: "red" }}>
                      <Ionicons name="close" color="#fff" size={40} />
                    </View>
                    <Text style={styles.iconText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCount}
                    style={{
                      textAlign: "center",
                      padding: 25,
                      width: "50%",
                      alignItems: "center",
                    }}
                    disabled={loading}
                  >
                    <View style={{ ...styles.icon, backgroundColor: "green" }}>
                      <Ionicons name="checkmark" color="#fff" size={40} />
                    </View>
                    <Text style={styles.iconText}>Start Count</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
      <CropImage
        selectedImage={selectedImage}
        base64={base64}
        setSelectedImage={setSelectedImage}
        setBase64={setBase64}
      />
    </>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1 },
  text: {
    fontSize: 20,
    color: "#000",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "white",
    marginBottom: 30,
  },
  imageContainer: {
    marginRight: 10,
    flex: 1,
  },
  image: {
    width: 50,
    height: 50,
  },
  logo_image: { width: 200, height: 50, resizeMode: "contain" },
  icon: { padding: 10, borderRadius: 100, marginBottom: 10 },
  iconText: { fontSize: 20 },
  no_data_img: {
    width: "100%",
    height: "100%",
  },
  //
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "50%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#36454F",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});
