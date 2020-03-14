import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import ApiKeys from "./App/Constants/ApiKeys";
import * as firebase from "firebase";
import Root from "./App/Components/Root/Root";
import Profile from "./App/Components/Profile/Profile";

const Stack = createStackNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    if (!firebase.apps.length) {
      firebase.initializeApp(ApiKeys.FirebaseConfig);
    }
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Root" component={Root} options={{ title: "Coucou"}}/>
          <Stack.Screen name="Profile" component={Profile}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
