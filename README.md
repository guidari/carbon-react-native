# Carbon for React Native

Component and shared patterns for React Native apps using Carbon. Styles are based on the [Carbon Native Mobile](https://carbondesignsystem.com/designing/design-resources/#native-mobile) designs. Color (g10 for light theme and g100 for dark theme) and typography tokens are based on Carbon 11.

## Installation

1. Install the package in your project `npm install @carbon/react-native` or `yarn add @carbon/react-native`
2. Go into the `ios` directory and use `pod install` (be sure to use the system Ruby on Mac if you are using rvm or similar tool)
3. Create or edit `react-native.config.js` file to be:
   ```javascript
   module.exports = {
     project: {
       ios: {},
       android: {},
     },
     assets: [
       './node_modules/@carbon/react-native/src/assets/fonts/', // This needs to be added if file already exists
     ],
   };
   ```
4. Run `npx react-native-asset` to link the fonts (install this package if not already).
5. Install the following peer dependencies (install as dependencies. [See dependecies here for tested versions](example/package.json)):
   - @carbon/themes
   - @carbon/icons
   - @carbon/icon-helpers
   - react-native-svg
   - react-native-webview

## Recommended Settings

For best experience with navigation we recommend for Android setting `android:windowSoftInputMode="adjustPan"` in your AndroidManifest file. This will prevent the bottom navigation from pushing up. Other known mechanisms exist and you should consider keyboard overlay for developing input areas.

## Usage

### Components

```js
import { Button } from '@carbon/react-native';

<Button kind="primary" text="My Button" onPress={() => {}} />;
```

### Colors

You can use `getColor` to retrieve a color token using the system theme for Carbon colors. You can pass a second param to force a theme (light/dark).

```js
import { getColor } from '@carbon/react-native';

const styles = StyleSheet.create({
  example: {
    padding: 16,
    color: getColor('textPrimary'),
    backgroundColor: getColor('background'),
  },
});
```

Color scheme will follow the OS. You can request specific colors at any point via second param on get Color. If you wish to use a theme for your app you will need to set the theme globally. This means that any color you use in your own styling will need to be done via a getter (and have this component reload its state). For changing your own colors on the fly you need to ensure getters are used for those styles using color. You can use the `forceTheme` function to change the theme and trigger a state update to change the color.

### Icons

You can use icons from `@carbon/icons` to pass to components. We do not bundle all icons in this library to reduce size. You can import specific icons from that library directly as needed. An example of how to pass icons to the React Native components is below.

```javascript
import AddIcon from '@carbon/icons/es/add/20';

// Using an icon with a component that supports Carbon Icons.
<Button icon={AddIcon} />

// Using an icon directly in your own component. You can use our helper.  See `createIcon` params for options.
<View>{createIcon(icon, 20, 20)}</View>
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.
