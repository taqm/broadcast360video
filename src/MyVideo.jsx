import React from 'react';

const MyVideo = React.memo(({ stream, ...videoProps }) => {
  const videoRef = React.useRef();
  React.useEffect(() => {
    videoRef.current.srcObject = stream;
    videoRef.current.play();
    return () => {
      stream.getTracks().forEach((it) => {
        it.stop();
      });
    };
  }, [stream]);

  return <video ref={videoRef} {...videoProps}></video>;
});

export default MyVideo;
