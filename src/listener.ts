import querystring from 'querystring';
import { getPeer } from './core';

const theirVideo = document.getElementById('their-video') as HTMLVideoElement;
const peer = getPeer();

type Query = {
  peerid: string;
};
const query = querystring.parse(location.search.slice(1)) as Query;

peer.on('open', () => {
  const conn = peer.call(query.peerid);

  conn.on('stream', (stream) => {
    theirVideo.srcObject = stream;
    theirVideo.play();
  });
});
