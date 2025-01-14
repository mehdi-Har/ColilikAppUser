import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  NewOrder: undefined;
  PackageInfo: { message: string; imageUri?: string };
  Test: { imageUri: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
