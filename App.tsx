import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import ApiKeys from "./App/Constants/ApiKeys";
import * as firebase from "firebase";
import Root from "./App/Components/Root/Root";
import ProfileView from "./App/Components/Profile/ProfileView";
import Routes from "./App/Components/Routes/Routes";
import AddFriend from "./App/Components/Friends/AddFriend";
import SendKit from "./App/Components/KIT/SendKit";
import TimeKit from "./App/Components/KIT/TimeKit";
import SummarySendKit from "./App/Components/KIT/SummarySendKit";
import ProfileColorPicker from "./App/Components/Profile/ProfileColorPicker";

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
          <Stack.Screen
            name={Routes.ROOT}
            component={Root}
            options={{ title: "Coucou", headerShown: true }}
          />
          <Stack.Screen
            name={Routes.PROFILE}
            component={ProfileView}
            options={{ headerTitle: null }}
          />
          <Stack.Screen
            name={Routes.ADD_FRIEND}
            component={AddFriend}
            options={{ title: "Add a friend" }}
          />
          <Stack.Screen
            name={Routes.SEND_KIT}
            component={SendKit}
            options={{ title: "Select time & friends" }}
          />
          <Stack.Screen
            name={Routes.TIME_KIT}
            component={TimeKit}
            options={{ title: "Select your availability" }}
          />
          <Stack.Screen
            name={Routes.SUMMARY_SEND_KIT}
            component={SummarySendKit}
            options={{ title: "Double check..." }}
          />
          <Stack.Screen
            name={Routes.PROFILE_COLOR_PICKER}
            component={ProfileColorPicker}
            options={{ title: "Choose your profile color" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
