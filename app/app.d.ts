import { StackNavigationProp } from "@react-navigation/stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      ColisForm: {
        imageData: {
          id: string;
          uri: string | null;
        };
      };
      UploadImage: undefined;
    }
  }
}
