import React from "react";
import { StackNavigator, TabNavigator } from "react-navigation";

import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from './screens/HomeScreen';

export const SignedOut = StackNavigator({
  Splash: {
    screen: SplashScreen,
  },
  Login: {
    screen: LoginScreen,
  }
});

export const SignedIn = TabNavigator({
  Home: {
    screen: HomeScreen,
  }
});

export const createRootNavigation = (authenticated = false) => {
  return StackNavigator(
    {
      SignedIn: {
        screen: SignedIn,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
      SignedOut: {
        screen: SignedOut,
        navigationOptions: {
          gesturesEnabled: false
        }
      }
    },
    {
      headerMode: "none",
      mode: "modal",
      initialRouteName: authenticated ? "SignedIn" : "SignedOut"
    }
  );
};