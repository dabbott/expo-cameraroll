# Expo CameraRoll

This library implements the React Native [CameraRoll](https://github.com/react-native-community/react-native-cameraroll) API on top of Expo's [MediaLibrary](https://docs.expo.io/versions/latest/sdk/media-library/) API.

### Installation

```bash
expo add expo-media-library expo-cameraroll
```

### Usage

See https://github.com/react-native-community/react-native-cameraroll

### Limitations

Some of the more obscure parameters couldn't be mapped over easily, such as asset group names/types. Check [`index.js`](index.js) to see exactly which parameters are used.