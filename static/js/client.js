// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

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
          'playsinline': 1
        },
        events: {
          'onStateChange': onPlayerStateChange,
        }
    });

    // Set up the timeline input element
    timeline = document.getElementById('timeline');
    setInterval(updateTimeLine, 1000); //update every second

    function updateTimeLine(){
      if(player){
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        const percentage = (currentTime / duration) * 100;
        timeline.value = percentage;
      }
    }

    timeline.addEventListener('input', function () {
      const percentage = timeline.value;
      const duration = player.getDuration();
      const seekTime = (percentage / 100) * duration;
      player.seekTo(seekTime);
    });
}

var done = false;
function onPlayerStateChange(event) { 
    if (event.data == YT.PlayerState.PLAYING && !done) {
        done = true;
    }
}

// Socket.io setup
const socket = io('http://localhost:2000');

// Adding event listeners
document.getElementById('play-btn').addEventListener('click', playButton);
document.getElementById('pause-btn').addEventListener('click', pauseButton);


// Define playButton function
function playButton() {
    player.playVideo();
    socket.emit('playEvent', {action: 'play'});
}

// Define pauseButton function
function pauseButton() {
    player.pauseVideo();
    socket.emit('playEvent', {action: 'pause'});
}

// Socket event handler for synchronization
socket.on('playEvent', function (data) {
    if (data.action === 'play') {
      player.playVideo();
    } 
    else if (data.action === 'pause') {
      player.pauseVideo();
    }
});

