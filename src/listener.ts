import querystring from 'querystring';
import { getLocalStream, getPeer } from './core';
import { DeviceSelector } from './DeviceSelector';
import PubSub from 'pubsub-js';

const myVideo = document.getElementById('my-video') as HTMLVideoElement;
const theirVideo = document.getElementById('their-video') as HTMLVideoElement;

let localStream: MediaStream | null = null;
const ChangeStreamTopic = Symbol('change-stream');

const peer = getPeer();

type Query = {
  peerid: string;
};
const query = querystring.parse(location.search.slice(1)) as Query;

peer.on('open', () => {
  const conn = peer.call(query.peerid, localStream ?? undefined);
  conn.on('stream', (stream) => {
    theirVideo.srcObject = stream;
    theirVideo.play();
  });

  PubSub.subscribe(ChangeStreamTopic, () => {
    conn.replaceStream(localStream!);
  });
});

const deviceSelector = new DeviceSelector(
  document.getElementById('audio-select') as HTMLSelectElement,
  document.getElementById('video-select') as HTMLSelectElement,
);

deviceSelector.onChange(async (ev) => {
  if (localStream) {
    localStream.getTracks().forEach((it) => {
      it.stop();
    });
  }
  const stream = await getLocalStream(ev.audioDeviceId, ev.videoDeviceId);
  myVideo.srcObject = stream;
  myVideo.play();
  localStream = stream;

  PubSub.publish(ChangeStreamTopic);
});
