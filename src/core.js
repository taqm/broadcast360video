import Peer from 'skyway-js';

export const getPeer = () => {
  return new Promise((resolve, reject) => {
    const peer = new Peer({
      key: process.env.SKYWAY_API_KEY,
    });
    peer.on('open', () => {
      resolve(peer);
    });
    peer.on('error', reject);
  });
};

export const getDevices = async ({ audio, video }) => {
  await navigator.mediaDevices.getUserMedia({ video, audio });
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.reduce(
    (acc, cur) => {
      const list = acc[cur.kind];
      if (!list) return acc;
      return { ...acc, [cur.kind]: [...list, cur] };
    },
    { audioinput: [], videoinput: [] },
  );
};

export const getLocalStream = ({ audioDeviceId, videoDeviceId }) => {
  return navigator.mediaDevices.getUserMedia({
    audio: { deviceId: audioDeviceId },
    video: { deviceId: videoDeviceId },
  });
};
