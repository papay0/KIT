import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import ApiKeys from "./App/Constants/ApiKeys";
import * as firebase from "firebase";
import Root from "./App/Components/Root/Root";
import Profile from "./App/Components/Profile/Profile";
import Routes from "./App/Components/Routes/Routes";
import AddFriend from "./App/Components/Friends/AddFriend";

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
          <Stack.Screen name={Routes.ROOT} component={Root} options={{ title: "Coucou"}}/>
          <Stack.Screen name={Routes.PROFILE} component={Profile} options={{ title: "Your profile"}}/>
          <Stack.Screen name={Routes.ADD_FRIEND} component={AddFriend} options={{ title: "Add a friend"}}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
