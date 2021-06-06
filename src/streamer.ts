import PubSub from 'pubsub-js';

import { getLocalStream, getPeer } from './core';
import { DeviceSelector } from './DeviceSelector';

const myVideo = document.getElementById('my-video') as HTMLVideoElement;
const theirVideo = document.getElementById('their-video') as HTMLVideoElement;

let localStream: MediaStream | null = null;
const ChangeStreamTopic = Symbol('change-stream');

const peer = getPeer();

peer.on('open', () => {
  const myPeerIdElem = document.getElementById('my-peerid');
  myPeerIdElem!.innerText = peer.id;

  const pageUrlElem = document.getElementById(
    'this-page-url',
  ) as HTMLAnchorElement;
  const pageUrl = (() => {
    const o = location.origin;
    const rootPath = location.pathname.replace(/\/(index.html)?/, '');
    return `${o}${rootPath}/listener.html?peerid=${peer.id}`;
  })();

  pageUrlElem.innerText = pageUrlElem.href = pageUrl;
});

peer.on('call', (conn) => {
  if (!localStream) {
    console.error('localStreamが存在しません');
    return;
  }

  conn.answer(localStream);
  conn.on('stream', (stream) => {
    theirVideo.srcObject = stream;
    theirVideo.play();
  });

  PubSub.subscribe(ChangeStreamTopic, () => {
    if (localStream) {
      conn.replaceStream(localStream);
    }
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
