import Peer from 'skyway-js';

const API_KEY = process.env['SKYWAY_API_KEY']!;

export const getPeer = () => {
  return new Peer({
    key: API_KEY,
    debug: 3
  });
};

export const getLocalStream = (
  audioDeviceId: string | null,
  videoDeviceId: string | null,
) => {
  return navigator.mediaDevices.getUserMedia({
    audio: audioDeviceId ? {
      deviceId: audioDeviceId,
    } : false,
    video: videoDeviceId ? {
      deviceId: videoDeviceId,
    } : false,
  });
}
