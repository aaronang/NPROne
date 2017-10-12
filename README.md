# NPR One
NPR One music player 🎶

<img src="https://github.com/aaronang/NPROne/blob/master/demo.gif" width="250"/>

>Demo with audio: https://goo.gl/pgtRBa.

## Getting Started
```bash
$ yarn install
$ react-native link
$ react-native run-android
```

## Design Decisions
1. We are using `onNavigationStateChange` because deep links showed indeterministic behavior; sometimes it would work sometimes it wouldn't.
2. In iOS, using custom URIs like `com.nprone://authorize` results in a warning: `Encountered an error loading page`.
3. For simplicity the API secret is currently stored plain text in code.
