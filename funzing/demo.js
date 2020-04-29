const controls = `
<div class="plyr__controls">
    <button type="button" class="plyr__control" data-plyr="restart">
        <svg role="presentation"><use xlink:href="#plyr-restart"></use></svg>
        <span class="plyr__tooltip" role="tooltip">Restart</span>
    </button>
    <button type="button" class="plyr__control" data-plyr="rewind">
        <svg role="presentation"><use xlink:href="#plyr-rewind"></use></svg>
        <span class="plyr__tooltip" role="tooltip">Rewind {seektime} secs</span>
    </button>
    <button type="button" class="plyr__control" aria-label="Play, {title}" data-plyr="play">
        <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
        <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg>
        <span class="label--pressed plyr__tooltip" role="tooltip">Pause</span>
        <span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span>
    </button>
    <button type="button" class="plyr__control" data-plyr="fast-forward">
        <svg role="presentation"><use xlink:href="#plyr-fast-forward"></use></svg>
        <span class="plyr__tooltip" role="tooltip">Forward {seektime} secs</span>
    </button>
    <div class="plyr__progress" style="">
        <input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek" disabled="true">
        <progress class="plyr__progress__buffer" min="0" max="100" value="0">% buffered</progress>
        <span role="tooltip" class="plyr__tooltip">00:00</span>
    </div>
    <div class="plyr__time plyr__time--current" aria-label="Current time">00:00</div>
    <div class="plyr__time plyr__time--duration" aria-label="Duration">00:00</div>
    <button type="button" class="plyr__control" aria-label="Mute" data-plyr="mute">
        <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-muted"></use></svg>
        <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-volume"></use></svg>
        <span class="label--pressed plyr__tooltip" role="tooltip">Unmute</span>
        <span class="label--not-pressed plyr__tooltip" role="tooltip">Mute</span>
    </button>
    <div class="plyr__volume">
        <input data-plyr="volume" type="range" min="0" max="1" step="0.05" value="1" autocomplete="off" aria-label="Volume">
    </div>
    <button type="button" class="plyr__control" data-plyr="captions" style="display:none;">
        <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-captions-on"></use></svg>
        <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-captions-off"></use></svg>
        <span class="label--pressed plyr__tooltip" role="tooltip">Disable captions</span>
        <span class="label--not-pressed plyr__tooltip" role="tooltip">Enable captions</span>
    </button>
    <button type="button" class="plyr__control" data-plyr="fullscreen" style="">
        <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-exit-fullscreen"></use></svg>
        <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-enter-fullscreen"></use></svg>
        <span class="label--pressed plyr__tooltip" role="tooltip">Exit fullscreen</span>
        <span class="label--not-pressed plyr__tooltip" role="tooltip">Enter fullscreen</span>
    </button>
</div>
`;
document.addEventListener('DOMContentLoaded', () => {
    const source = 'https://player.vimeo.com/external/399242229.m3u8?s=9d5329eb98df991d78b4b92686357f471ead4ef3';
    const sourceV = 'https://player.vimeo.com/video/399242229';
    const video = document.querySelector('video');

    // For more options see: https://github.com/sampotts/plyr/#options
    // captions.update is required for captions to work with hls.js
    const player = new Plyr(video, {
      debug: false,
      muted: true,
      autoplay: true,
      live: {active: true, progress: true, startTime: -7},
      fullscreen: {enabled: true, fallback: true, iosNative: false},
      controls: [ 'play', 'live', 'progress', 'duration', 'mute', 'volume', 'airplay', 'fullscreen' ]
    });

    if (typeof Hls === 'undefined' || !Hls.isSupported()) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // alert('canPlayType');
        video.src = source;
        // video.addEventListener('loadeddata', function() {
        //   //player.media.currentTime = 600
        //   //player.play();
        // });
      } else {
        alert('regular video');
        player.source = {
          type: 'video',
          sources: [
            {
              src: sourceV,
              provider: 'vimeo',
            },
          ],
        };
      }
    } else {
        // For more Hls.js options, see https://github.com/dailymotion/hls.js
        const hls = new Hls();
        hls.loadSource(source);
        hls.attachMedia(video);
        window.hls = hls;
    }

    // Handle changing captions
    player.on('ready', () => {
      // setTimeout(function(){
      //     player.play().then(() => {
      //         //player.forward(600);
      //         player.currentTime = 600;
      //     })
      // },100);
    });

    // Expose player so it can be used from the console
    window.player = player;
});
