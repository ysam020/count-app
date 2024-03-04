import React, { useState } from "react";
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

export default function Signup(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const formData = {
      email: username.trim(),
      password: password,
      is_active: true,
      is_superuser: false,
      is_verified: false,
    };
    try {
      const res = await axios.post(
        "https://13.201.88.252:8000/auth/register",
        formData
      );

      console.log(res.data);

      if (res.data && res.data.email) {
        setMessage("Successfully registered!");
      } else {
        setMessage("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Sign up failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/Alluvium.png")}
        style={{ width: 250, height: 200 }}
      />
      <Text style={styles.text}>Create account</Text>

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
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      {message && <Text style={styles.signupText}>{message}</Text>}
      <TouchableOpacity onPress={() => props.setLoginScreen(true)}>
        <Text style={styles.signupText}>Login to your account</Text>
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
