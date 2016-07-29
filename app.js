(function(){
  navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;


  navigator.getUserMedia({ audio: true }, stream => {
    var audioCtx = new AudioContext();
    var source = audioCtx.createMediaStreamSource(stream);
    audioCtx.sampleRate = 48000;
    var compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 10;
    compressor.ratio.value = 50;
    compressor.reduction.value = -60;
    compressor.attack.value = 0;
    compressor.release.value = 0.2;

    // connect the AudioBufferSourceNode to the destination
    source.connect(audioCtx.destination);

    var button = document.getElementById('toggle-compression');
    button.onclick = function() {
      var active = button.getAttribute('data-active');
      if (active == 'false') {
        button.setAttribute('data-active', 'true');
        button.innerHTML = 'Remove compression';

        source.disconnect(audioCtx.destination);
        source.connect(compressor);
        compressor.connect(audioCtx.destination);
      } else if (active == 'true') {
        button.setAttribute('data-active', 'false');
        button.innerHTML = 'Add compression';

        source.disconnect(compressor);
        compressor.disconnect(audioCtx.destination);
        source.connect(audioCtx.destination);
      }
    }
  }, err => {
    console.error(err);
  });
})();
