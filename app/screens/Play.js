import React from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import { downloadRecommendations, downloadItem } from '../lib/media';
import Sound from 'react-native-sound';

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
      downloading: false,
      playing: false,
      sound: null
    };
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
    this.setState({ playing: false });
    if (!success) this.state.sound.reset();

    const { index, playlist } = this.state;
    const newIndex = (index + 1) % playlist.length;
    this.setState({ index: newIndex });

    const { download, filepath } = downloadItem(playlist[newIndex]);
    download.then(this._onDownloadFinish(filepath));
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
      if (playlist.length === 0 && !downloading)
        this._downloadRecommendations();
      if (playlist.length > 0 && !playing) this._play();
      if (playlist.length > 0 && playing) this._pause();
    }

    this.setState({
      lastPress: new Date().getTime()
    });
  };

  render() {
    const { downloading, playing } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <TouchableHighlight
          onPress={this._onPress}
          underlayColor="white"
          style={{ flex: 1, backgroundColor: 'white' }}
        >
          <View style={{ flex: 1 }}>
            {downloading && <Text>Downloading</Text>}
            {playing && <Text>Playing</Text>}
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}
