import { getPeer } from './core';

const connectForm = document.getElementById('connect-form') as HTMLFormElement;
const theirVideo = document.getElementById('their-video') as HTMLVideoElement;

const peer = getPeer();

connectForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const peerId = connectForm['peerid'].value;
  const conn = peer.call(peerId)
  conn.on('stream', (stream) => {
    theirVideo.srcObject = stream;
    theirVideo.play();
  });
});
