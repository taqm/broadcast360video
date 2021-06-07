import querystring from 'querystring';
import { getPeer } from './core';

const myVideo = document.getElementById('my-video') as HTMLVideoElement;
const theirVideo = document.getElementById('their-video') as HTMLVideoElement;

const peer = getPeer();

type Query = {
  peerid: string;
};

const query = querystring.parse(location.search.slice(1)) as Query;

peer.on('open', async () => {
  const localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  myVideo.srcObject = localStream;
  await myVideo.play();

  const conn = peer.call(query.peerid, localStream);
  conn.on('stream', (stream) => {
    theirVideo.srcObject = stream;
    theirVideo.play();
  });
});
