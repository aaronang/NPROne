import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Easing } from 'react-native';
import { downloadRecommendations, downloadItem } from '../lib/media';
import Sound from 'react-native-sound';
import * as Progress from 'react-native-progress';

export default class Play extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      playlist: [],
      index: 0,
      lastPress: 0,
      progress: 0,
      downloading: false,
      playing: false,
      sound: null
    };
  }

  componentDidMount() {
    const timer = setInterval(() => this._updateProgressBar(), 100);
    this.setState({ timer: timer });
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  _downloadRecommendations = async () => {
    this.setState({ downloading: true });
    const playlist = await downloadRecommendations();
    this.setState({ downloading: false, playlist: playlist });
  };

  _play = () => {
    const { sound, playlist, index } = this.state;
    if (sound) {
      this.setState({ playing: true });
      sound.play(this._onFinish);
      return;
    }

    this.setState({ downloading: true });
    const { download, filepath } = downloadItem(playlist[index]);
    download.then(() => {
      this.setState({ downloading: false });
      this._onDownloadFinish(filepath);
    });
  };

  _pause = () => {
    this.state.sound.pause();
    this.setState({ playing: false });
  };

  _onFinish = success => {
    const { sound, index, playlist } = this.state;
    this.setState({ playing: false, progress: 1 });

    if (!success) {
      sound.reset();
    } else {
      const newIndex = (index + 1) % playlist.length;
      this.setState({ index: newIndex });

      const { download, filepath } = downloadItem(playlist[newIndex]);
      download.then(this._onDownloadFinish(filepath));
    }
  };

  _onDownloadFinish = filepath => {
    const sound = new Sound(filepath, undefined, error => {
      if (error) {
        console.error(error);
      }
      this.setState({ sound: sound, playing: true });
      sound.play(this._onFinish);
    });
  };

  _onPress = () => {
    const delta = new Date().getTime() - this.state.lastPress;

    if (delta < 200) {
      const { playing, playlist, downloading } = this.state;
      if (playlist.length > 0 && !playing) this._play();
      if (playlist.length > 0 && playing) this._pause();
      if (playlist.length === 0 && !downloading)
        this._downloadRecommendations();
    }

    this.setState({
      lastPress: new Date().getTime()
    });
  };

  _updateProgressBar = () => {
    const { playing, sound } = this.state;
    if (playing) {
      const duration = sound.getDuration();
      sound.getCurrentTime(seconds => {
        this.setState({ progress: seconds / duration });
      });
    }
  };

  render() {
    const { downloading, playing, progress } = this.state;

    return (
      <View style={[styles.container, styles.root]}>
        <TouchableOpacity
          onPress={this._onPress}
          style={styles.container}
          activeOpacity={1}
        >
          <View style={styles.container}>
            <View style={styles.text}>
              {downloading && <Text>Downloading</Text>}
              {playing && <Text>Playing</Text>}
            </View>
            <View style={styles.progress}>
              <Progress.Bar
                progress={progress}
                width={null}
                animated={false}
                height={12}
                borderRadius={0}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  root: {
    padding: 50
  },
  text: {
    alignItems: 'center',
    flex: 8
  },
  progress: {
    flex: 1
  }
});
