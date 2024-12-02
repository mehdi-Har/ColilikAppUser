import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import { useState } from "react";

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250ps]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaBold absolute bottom-5 left-5 ">
            Create Your account
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Name"
            placeholder={"Enter your name"}
            icon={icons.person}
            value={form.name}
            OnchangeText={(value) => setForm({ ...form, name: value })}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
