// Defining variables
const timeline = $('.timeline');
const timelineDot = $('.timeline .dot');
const playButton = $('#play-btn');
const pauseButton = $('#pause-btn');

// This code will setup socket io for the client.
const socket = io.connect();

// Getting information about the connected clients
// by the server.
socket.on('connectedCount', (count) => {
    $('#connected-count').html(count);
});

// Everytime a user pause the video it will pause the video
// on the client side.
socket.on('pauseVideo', () => {
    player.pauseVideo();
});

// Everytime a user plays the video it will play the video
// on the client side.
socket.on('playVideo', () => {
    player.playVideo();
});

socket.on('timelineClick', (timelineClick) => {
    player.seekTo(timelineClick);
})

// Check if the dialog close button is pressed and emit the username
// to the server.
$('.close').click(() => {
    let usernameInput = $('#username-input').val();

    socket.emit('userJoin', usernameInput);
});

// If a user joins it will append it to the user list.
socket.on('userJoin', (username) => {
    $('#user-list').append('<li class="mdl-list__item mdl-list__item--two-line"><span class="mdl-list__item-primary-content"><i class="material-icons mdl-list__item-avatar">person</i><span class="username">' + username + '</span><span class="mdl-list__item-sub-title">Admin</span></span></li>');
});

// If a user leaves it will be removed from the user list.
socket.on('userLeave', (username) => {
    let users = document.getElementById('user-list').getElementsByClassName('username');
    for (var i = 0; i < users.length; i++) {
        let user = users[i].innerText;

        if (username === user) {
            var li = users[i].parentElement.parentElement; // Get the li element of the username
            document.getElementById('user-list').removeChild(li); // Remove li from the ul
        }
    }
})

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '480',
        width: '720',
        videoId: 'F0zOQhFQd9k',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        playerVars: {
            'controls': 0,
            'disablekb': 1,
            'modestbranding': 0,
            'rel': 0,
            'showinfo': 0
        }
    });
}

// This method gets called when the player is ready to go.
function onPlayerReady(event) {
    event.target.setVolume(5);
    startTimelineLoop();

    $('#video-title').html(player.getVideoData().title);
}

// This method gets called whenever the state of the player changes.
// If someone pressed the play button (state=1) this method will be called
// and it will notify all other connected clients that the video plays.
function onPlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.PLAYING:
            onPlayClicked();
            break;
        case YT.PlayerState.PAUSED:
            onPauseClicked();
            break;
    }
}

// This function will start the timeline loop.
// It will update the dot for the timeline, so that the timeline
// is accurate with the time of the video.
function startTimelineLoop() {
    setInterval(() => {
        if (player == null || timeline == null) {
            return;
        }

        const fraction = player.getCurrentTime() / player.getDuration() * 100;
        timelineDot.css("left", fraction.toString() + "%");
    });
}

// Whenever a user clicks on the timeline to jump to a position,
// the dot and the movie will jump to this position.
timeline.click(function(event) {
    var offset = $(this).offset();
    var x = event.pageX - offset.left;
    var timelineClick = x * player.getDuration() / $(this).width() - 2;
    //player.seekTo(timelineClick);
    socket.emit('playerEvent', { 'event': 'time', 'timelineClick': timelineClick });
});

// Whenever a user clicks on the play button,
// it will tell the other clients to play/resume the video.
playButton.click((event) => {
    onPlayClicked();
});

// Whenever a user clicks on the pause button,
// it will tell the other clients to puase the video.
pauseButton.click((event) => {
    onPauseClicked();
});

// This function is a helper function to perform everything,
// whenever the play button is clicked.
function onPlayClicked() {
    socket.emit('playerEvent', { 'event': 'play' });
}

// This function is a helper function to perform everything,
// whenever the pause button is clicked.
function onPauseClicked() {
    socket.emit('playerEvent', { 'event': 'pause' });
}