import React from 'react';

const My360Video = React.memo(({ stream, muted }) => {
  const myVideo = document.getElementById('my-video');

  React.useEffect(() => {
    myVideo.muted = muted;
    myVideo.srcObject = stream;
    myVideo.play();
  }, []);

  return null;
});

export default My360Video;
