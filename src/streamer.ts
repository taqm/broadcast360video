import 'pubsub-js';

import { getLocalStream, getPeer } from './core';
import { DeviceSelector } from './DeviceSelector';

const myVideo = document.getElementById('my-video') as HTMLVideoElement;

let localStream: MediaStream | null = null;
const ChangeStreamTopic = Symbol('change-stream');

const peer = getPeer();

peer.on('open', () => {
  const myPeerIdElem = document.getElementById('my-peerid');
  myPeerIdElem!.innerText = peer.id;
});

peer.on('call', (conn) => {
  if (!localStream) {
    console.error('localStreamが存在しません');
    return;
  };

  conn.answer(localStream);
  PubSub.subscribe(ChangeStreamTopic, (_: any, stream: MediaStream) => {
    conn.replaceStream(stream);
  })
});

{
  const deviceSelector = new DeviceSelector(
    document.getElementById('audio-select') as HTMLSelectElement,
    document.getElementById('video-select') as HTMLSelectElement,
  );

  deviceSelector.onChange(async (ev) => {
    if (localStream) {
      localStream.clone();
    }

    const stream = await getLocalStream(ev.audioDeviceId, ev.videoDeviceId);
    myVideo.srcObject = stream;
    await myVideo.play();
    localStream = stream;

    PubSub.publish(ChangeStreamTopic, stream);
  });
}

