const My360Video = () => {
  return (
    <a-scene
      embedded
      style="width: 400px; height: 400px; display: inline-block"
    >
      <a-assets>
        <video id="my-video" autoPlay muted />
      </a-assets>
      <a-entity camera look-controls="reverseMouseDrag: true"></a-entity>
      <a-videosphere src="#my-video"></a-videosphere>
    </a-scene>
  );
};

export default My360Video;
