function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

var soundAllowed = function (stream) {

  //Audio stops listening in FF without // window.persistAudioStream = stream;
  //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
  //https://support.mozilla.org/en-US/questions/984179
  window.persistAudioStream = stream;

  var audioContent = new (window.AudioContext || window.webkitAudioContext)();
  var audioStream = audioContent.createMediaStreamSource( stream );
  var analyser = audioContent.createAnalyser();
  audioStream.connect(analyser);
  analyser.fftSize = 1024;

  var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
  var lastMedValue = 0;
  var lastLowValue = 0;
  var lastHighValue = 0;
  var noSoundCount = 0;
  
  var doDraw = function () {
    analyser.getByteFrequencyData(frequencyArray);
    
    var adjustedLength;
    var updateTrigger = 20;

    for (var i = 0 ; i < 255; i++) {
      adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
    }
    // low
    var total = 0;
    for(var i = 1; i < 10; i++) {
        total += frequencyArray[i];
    }
    var low = total / 9;
    var adjustedLow = Math.floor(low) - (Math.floor(low) % 5);
    //medium
    total = 0;
    for(var i = 11; i < 21; i++) {
        total += frequencyArray[i];
    }
    var med = total / 10;
    var adjustedMed = Math.floor(med) - (Math.floor(med) % 5);
    // high
    total = 0;
    for(var i = 30; i < 40; i++) {
        total += frequencyArray[i];
    }
    var high = total / 10;
    var adjustedHigh = Math.floor(high) - (Math.floor(high) % 5);

    if (Math.abs(lastLowValue - low) > updateTrigger || Math.abs(lastMedValue - med) > updateTrigger || Math.abs(lastHighValue - high) > updateTrigger) {
      // console.log('updating with', adjustedLow, adjustedMed, adjustedHigh)
      if (window.updateFontsWithSound) {
        window.updateFontsWithSound(adjustedLow, adjustedMed, adjustedHigh);
      }
    }

    requestAnimationFrame(doDraw);
  }

  doDraw()
}


if (navigator.getUserMedia) {
  window.navigator = window.navigator || {};
  navigator.getUserMedia =  navigator.getUserMedia       ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia    ||
                            null
  navigator.getUserMedia({audio:true}, soundAllowed, () => console.log('Sound not allowed'));
}
else if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({audio:true})
    .then(soundAllowed)
    .catch(console.log('Sound not allowed'));
}
