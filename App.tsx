import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';

import "firebase/firestore";
import "firebase/functions";

import ApiKeys from "./App/Constants/ApiKeys";
import * as firebase from "firebase";
import Root from "./App/Components/Root/Root";
import ProfileView from "./App/Components/Profile/ProfileView";
import Routes from "./App/Components/Routes/Routes";
import SendKit from "./App/Components/KIT/SendKit";
import TimeKit from "./App/Components/KIT/TimeKit";
import SummarySendKit from "./App/Components/KIT/SummarySendKit";
import ProfileColorPicker from "./App/Components/Profile/ProfileColorPicker";
import FriendRequests from "./App/Components/Friends/FriendRequests";
import AddFriends from "./App/Components/Friends/AddFriends";
import { YellowBox } from "react-native";

const Stack = createStackNavigator();

console.disableYellowBox = true;
YellowBox.ignoreWarnings([
  "VirtualizedLists should never be nested" // TODO: Remove when fixed
]);

Sentry.init({
  dsn: ApiKeys.Sentry.dsn,
  enableInExpoDevelopment: true,
  debug: true
});
Sentry.setRelease(Constants.manifest.revisionId);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    if (!firebase.apps.length) {
      firebase.initializeApp(ApiKeys.FirebaseConfig);
    }
  }

  render() {
    return (
      <ActionSheetProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name={Routes.ROOT}
              component={Root}
              options={{
                title: "",
                headerShown: true,
                headerStyle: { shadowColor: "transparent" }
              }}
            />
            <Stack.Screen
              name={Routes.PROFILE}
              component={ProfileView}
              options={{
                headerTitle: null,
                headerStyle: { shadowColor: "transparent" }
              }}
            />
            <Stack.Screen
              name={Routes.ADD_FRIENDS}
              component={AddFriends}
              options={{ title: "Add friends" }}
            />
             <Stack.Screen
              name={Routes.FRIEND_REQUESTS}
              component={FriendRequests}
              options={{ title: "Friend requests" }}
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
          </Stack.Navigator>
        </NavigationContainer>
      </ActionSheetProvider>
    );
  }
}
