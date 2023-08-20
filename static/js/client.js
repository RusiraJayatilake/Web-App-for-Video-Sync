// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Socket.io setup
const socket = io('http://localhost:2000');

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var player;
var timeline;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '663',
        width: '1100',
        videoId: 'Q1Pdp89EvZ8',
        playerVars: {
          'controls': 0,
          'showinfo': 0,
          'playsinline': 0
        },
        events: {
          'onStateChange': onPlayerStateChange,
        }
    });

    timeline = document.getElementById('timeline');
    timeline.addEventListener('input', function () {
      const percentage = timeline.value;
      const duration = player.getDuration();
      const seekTime = (percentage / 100) * duration;
      player.seekTo(seekTime);
      socket.emit('seek', seekTime);
    });
}

// Adding event listeners
document.getElementById('play-btn').addEventListener('click', () => {
  player.playVideo();
  socket.emit('play');
});

document.getElementById('pause-btn').addEventListener('click', () => {
  player.pauseVideo();
  socket.emit('pause');
});

socket.on('play', () => {
  player.playVideo();
});

socket.on('pause', () => {
  player.pauseVideo();
});

socket.on('seek', (seekTime) => {
  player.seekTo(seekTime);
});


var done = false;
function onPlayerStateChange(event) { 
    if (event.data === YT.PlayerState.PLAYING) {
      socket.emit('play');
    }
    else if(event.data === YT.PlayerState.PAUSED){
      socket.emit('pause');
    }
}




