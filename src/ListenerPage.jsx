import React from 'react';
import { useLocation } from 'react-router-dom';

import DeviceSelect from './DeviceSelect';
import { getDevices, getLocalStream, getPeer } from './core';
import My360Video from './My360Video';

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
      {audioDevices && !theirStream && (
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
      {theirStream && <My360Video stream={theirStream} />}
    </>
  );
};

export default ListenerPage;
