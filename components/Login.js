import React, { useState, useContext } from "react";
import {
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Text,
  View,
} from "react-native";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);

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
        "https://6bb1-103-11-119-220.ngrok-free.app/auth/jwt/login",
        requestBody.toString(), // Convert URLSearchParams to string
        config
      );
      setUser(true);
      // Store the access token in AsyncStorage
      if (res.data.access_token) {
        await AsyncStorage.setItem("countThingsToken", res.data.access_token);
      }
    } catch (error) {
      // Handle login error scenarios
      console.error("Login failed:", error);
    }
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

      <Text style={{ marginTop: 15 }}>Forgot Password?</Text>
      <TouchableOpacity onPress={() => props.setLoginScreen(false)}>
        <Text style={styles.signupText}>Sign up</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
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
});
