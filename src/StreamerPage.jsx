import React from 'react';
import { Link } from 'react-router-dom';

import MyVideo from './MyVideo';
import DeviceSelect from './DeviceSelect';
import { getDevices, getLocalStream, getPeer } from './core';

const StreamerPage = () => {
  const [localStream, setLocalStream] = React.useState(null);
  const [devices, setDevices] = React.useState(null);

  const [audioDeviceId, setAudioDeviceId] = React.useState(undefined);
  const [videoDeviceId, setVideoDeviceId] = React.useState(undefined);
  const [peerId, setPeerId] = React.useState('');

  React.useEffect(() => {
    getDevices({ audio: true, video: true }).then(setDevices);
  }, []);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    (async () => {
      const stream = await getLocalStream({ audioDeviceId, videoDeviceId });
      setLocalStream(stream);

      getPeer().then((peer) => {
        setPeerId(peer.id);
        peer.on('call', (conn) => {
          conn.answer(stream);
        });
      });
    })();
  };

  return (
    <>
      {devices && !localStream && (
        <form onSubmit={handleSubmit}>
          <DeviceSelect
            label="マイク"
            devices={devices.audioinput}
            value={audioDeviceId}
            onChange={setAudioDeviceId}
            required
          />
          <DeviceSelect
            label="カメラ"
            devices={devices.videoinput}
            value={videoDeviceId}
            onChange={setVideoDeviceId}
            required
          />
          <div>
            <button type="submit">開始</button>
          </div>
        </form>
      )}
      {peerId && (
        <div>
          <Link
            to={{ pathname: '/listen', search: `p=${peerId}` }}
            target="_blank"
          >
            peerId: {peerId}
          </Link>
        </div>
      )}
      {localStream && <MyVideo stream={localStream} muted width={400} />}
    </>
  );
};

export default StreamerPage;
