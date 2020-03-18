import { useActionSheet } from "@expo/react-native-action-sheet";

export const useSelectMessaging = (onChooseAction: (buttonIndex: number) => void) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const onOpenActionSheet = () => {
    const options = ["Delete", "Save", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex
      },
      buttonIndex => {
        onChooseAction(buttonIndex);
      }
    );
  };

  return onOpenActionSheet;
};
