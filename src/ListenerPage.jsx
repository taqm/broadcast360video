import React from 'react';
import { useLocation } from 'react-router-dom';

import MyVideo from './MyVideo';
import DeviceSelect from './DeviceSelect';
import { getDevices, getLocalStream, getPeer } from './core';

const ListenerPage = () => {
  const loc = useLocation();
  const peerId = new URLSearchParams(loc.search).get('p');

  const [theirStream, setTheirStream] = React.useState(null);
  const [audioDevices, setAudioDevices] = React.useState(null);
  const [audioDeviceId, setAudioDeviceId] = React.useState(undefined);

  React.useEffect(() => {
    getDevices({ audio: true, video: false }).then((devices) => {
      setAudioDevices(devices.audioinput);
    });
  }, []);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    (async () => {
      const localStream = await getLocalStream({ audioDeviceId });
      const peer = await getPeer();
      const conn = peer.call(peerId, localStream, {
        videoReceiveEnabled: true,
      });
      conn.on('stream', setTheirStream);
    })();
  };

  return (
    <>
      {audioDevices && (
        <form onSubmit={handleSubmit}>
          <DeviceSelect
            label="マイク"
            devices={audioDevices}
            value={audioDeviceId}
            required
            onChange={setAudioDeviceId}
          />
          <div>
            peerId：
            <input value={peerId} required readOnly />
          </div>
          <div>
            <button type="submit">開始</button>
          </div>
        </form>
      )}
      {theirStream && <MyVideo stream={theirStream} />}
    </>
  );
};

export default ListenerPage;
