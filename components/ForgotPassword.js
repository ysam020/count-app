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

export default function ForgotPassword(props) {
  const [email, setEmail] = useState("");
  const [resetPassword, setResetPassword] = useState(false);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    setResetPassword(true);
    axios
      .post("https://13.201.88.252:8000/auth/forgot-password", {
        email,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleResetPassword = () => {
    axios
      .post("https://13.201.88.252:8000/auth/reset-password", {
        token,
        password,
      })
      .then((res) => {
        console.log(res.data);
        props.setModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {!resetPassword ? (
        <>
          <Text style={styles.text}>Forgot Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.text}>Reset Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Token"
            onChangeText={(text) => setToken(text)}
            value={token}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    margin: 20,
  },
  input: {
    height: 55,
    paddingHorizontal: 20,
    backgroundColor: "#efefef",
    marginBottom: 10,
    color: "#000",
    borderRadius: 20,
    elevation: 3,
  },
  button: {
    backgroundColor: "#D12228",
    height: 55,
    paddingHorizontal: 20,
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
