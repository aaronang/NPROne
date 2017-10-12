import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Button
} from 'react-native';
import { downloadRecommendations, downloadItem } from '../lib/media';
import { signOut } from '../lib/auth';
import PropTypes from 'prop-types';
import Sound from 'react-native-sound';
import Info from '../components/Info';
import TouchableProgressBar from '../components/TouchableProgressBar';

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
    this.mounted = true;
    this.timer = setInterval(() => this._updateProgressBar(), 100);
  }

  componentWillUnmount() {
    this._releaseResources();
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
      sound.play(this._onPlayFinish);
    } else {
      this.setState({ downloading: true });
      const { download, filepath } = downloadItem(playlist[index]);
      download.then(() => this._onDownloadFinish(filepath));
    }
  };

  _pause = () => {
    this.state.sound.pause();
    this.setState({ playing: false });
  };

  _onPlayFinish = success => {
    if (!this.mounted) return;

    const { sound, index, playlist } = this.state;
    this.setState({ playing: false, progress: 1 });

    if (success) {
      const newIndex = (index + 1) % playlist.length;
      this.setState({ index: newIndex, downloading: true });
      const { download, filepath } = downloadItem(playlist[newIndex]);
      download.then(() => this._onDownloadFinish(filepath));
    } else {
      sound.reset();
    }
  };

  _onDownloadFinish = filepath => {
    if (!this.mounted) return;
    const sound = new Sound(filepath, undefined, error => {
      if (error) {
        console.error(error);
      }
      this.setState({ sound: sound, playing: true, downloading: false });
      sound.play(this._onPlayFinish);
    });
  };

  _onPress = async () => {
    const delta = new Date().getTime() - this.state.lastPress;

    if (delta < 400) {
      const { playing, playlist, downloading } = this.state;
      if (playlist.length > 0 && !playing) this._play();
      if (playlist.length > 0 && playing) this._pause();
      if (playlist.length === 0 && !downloading) {
        await this._downloadRecommendations();
        this._play();
      }
    }

    this.setState({
      lastPress: new Date().getTime()
    });
  };

  _updateProgressBar = () => {
    const { sound } = this.state;
    if (sound) {
      const duration = sound.getDuration();
      sound.getCurrentTime(seconds => {
        this.setState({ progress: seconds / duration });
      });
    }
  };

  _getCurrentTitle = () => {
    const { playlist, index } = this.state;
    if (playlist.length > 0) {
      const { title } = playlist[index];
      return title;
    }
    return '';
  };

  _getStatus = () => {
    const { downloading, playing, playlist } = this.state;

    if (downloading) return 'DOWNLOADING';
    if (playing) return 'PLAYING';
    if (!playing && playlist.length > 0) return 'PAUSED';
    return ' ';
  };

  _onProgressPress = event => {
    const width = Dimensions.get('window').width - 2 * padding;
    const { locationX } = event.nativeEvent;
    const { sound, downloading } = this.state;
    if (sound && !downloading) {
      sound.setCurrentTime(locationX / width * sound.getDuration());
    }
  };

  _signOut = () => {
    const { navigate } = this.props.navigation;
    this._releaseResources();
    signOut().then(() => navigate('SignedOut'));
  };

  _releaseResources = () => {
    const { sound } = this.state;
    this.timer && clearInterval(this.timer);
    sound && sound.release();
    this.mounted = false;
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this._onPress}
          style={[styles.container, styles.touchable]}
          activeOpacity={1}
        >
          <View style={styles.container}>
            <Info status={this._getStatus()} title={this._getCurrentTitle()} />
            <TouchableProgressBar
              onProgressPress={this._onProgressPress}
              progress={this.state.progress}
            />
            <View>
              <Button onPress={this._signOut} title="Sign Out" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

Play.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
};

const padding = 50;
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  touchable: {
    padding: padding
  }
});
