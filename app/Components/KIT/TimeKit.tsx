import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { User } from "../../Models/User";
import Routes from "../Routes/Routes";
import PillButton from "../PlatformUI/PillButton";

interface ITimeKitProps {
  onSelectTime: (time: number | undefined) => void;
}

type TIMEKITNavigatorParams = {
  [Routes.SEND_KIT]: {
    user: User;
  };
};

interface ITimeKitState {
  times: number[];
  selectedTime: number | undefined;
}

export default class TimeKit extends React.Component<
  ITimeKitProps,
  ITimeKitState
> {
  constructor(props) {
    super(props);
    this.state = {
      times: [5, 10, 15, 20, 30, 45, 60],
      selectedTime: undefined
    };
  }

  onPress = (time: number, isSelected: boolean) => {
    const selectedTime = isSelected ? time : undefined;
    this.setState({ selectedTime: selectedTime });
    this.props.onSelectTime(selectedTime);
  };

  render() {
    return (
      <View>
        {/* <Text style={styles.header}>How long are you available?</Text> */}
        <ScrollView
          style={styles.container}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {this.state.times.map(time => {
            const selectedEmoji = "✅";
            const unselectedEmoji = "☑️";
            const isSelected = this.state.selectedTime == time;
            const emoji = isSelected ? selectedEmoji : unselectedEmoji;
            const title = time + " min " + emoji;
            return (
              <PillButton
                key={time}
                title={title}
                onPress={() => {
                  console.log("on press");
                  this.onPress(time, !isSelected);
                }}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  header: {
    fontSize: 25
  }
});
