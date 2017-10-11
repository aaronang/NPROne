import { getAccessToken } from './auth';
import RNFS from 'react-native-fs';

export const downloadRecommendations = async () => {
  try {
    const { token_type, access_token } = await getAccessToken();
    const recommendations = await fetch(
      'https://api.npr.org/listening/v2/recommendations',
      {
        method: 'GET',
        headers: {
          Authorization: `${token_type} ${access_token}`
        }
      }
    );
    const { items } = await recommendations.json();
    return items.map(item => {
      return {
        title: item.attributes.title,
        url: item.links.audio[0].href,
        contentType: item.links.audio[0]['content-type']
      };
    });
  } catch (error) {
    console.error(error);
  }
};

export const downloadItem = ({ title, url, contentType }) => {
  const filename = title.replace(/[^a-zA-Z]/g, '');
  const filetype = contentType.includes('mp3') ? 'mp3' : 'mp4';
  const filepath = `${RNFS.DocumentDirectoryPath}/${filename}.${filetype}`;
  const { promise } = RNFS.downloadFile({ fromUrl: url, toFile: filepath });
  return {
    download: promise,
    filepath: filepath
  };
};
