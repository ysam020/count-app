import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Home from "./components/Home";
import { LogBox } from "react-native";
import { UserContext } from "./contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Signup from "./components/Signup";

LogBox.ignoreAllLogs();

export default function App() {
  const [user, setUser] = useState(false);
  const [loginScreen, setLoginScreen] = useState(true);

  function displayLoginScreen() {
    return loginScreen ? (
      <Login setLoginScreen={setLoginScreen} />
    ) : (
      <Signup setLoginScreen={setLoginScreen} />
    );
  }

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("countThingsToken");
        console.log(storedToken);
        if (storedToken) {
          setUser(true);
        }
      } catch (error) {
        console.error("Error retrieving user session:", error);
      }
    };

    checkUserSession();
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        {!user ? displayLoginScreen() : <Home />}
      </UserContext.Provider>
    </>
  );
}
