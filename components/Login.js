import React, { useState, useContext } from "react";
import {
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Modal,
  Image,
  Text,
  View,
} from "react-native";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ForgotPassword from "./ForgotPassword";

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const [modal, setModal] = useState(false);

  const handleLogin = async () => {
    const requestBody = new URLSearchParams();
    requestBody.append("username", username.trim());
    requestBody.append("password", password);
    try {
      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      const res = await axios.post(
        "https://13.201.88.252:8000/auth/jwt/login",
        requestBody.toString(),
        config
      );
      console.log(res.data);
      setUser(true);

      if (res.data.access_token) {
        await AsyncStorage.setItem("countThingsToken", res.data.access_token);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const closeModal = () => {
    setModal(false);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/Alluvium.png")}
        style={{ width: 250, height: 200 }}
      />
      <Text style={styles.text}>Log in to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModal(true)}>
        <Text style={{ marginTop: 15 }}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => props.setLoginScreen(false)}>
        <Text style={styles.signupText}>Sign up</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal}>
              <ForgotPassword setModal={setModal} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efefef",
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: 25,
    margin: 20,
  },
  input: {
    height: 55,
    width: "80%",
    backgroundColor: "#fff",
    marginVertical: 10,
    padding: 10,
    color: "#000",
    borderRadius: 20,
    elevation: 3,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#D12228",
    height: 55,
    borderRadius: 20,
    width: "80%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  signupText: {
    marginTop: 15,
    color: "#D12228",
    fontWeight: "bold",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
