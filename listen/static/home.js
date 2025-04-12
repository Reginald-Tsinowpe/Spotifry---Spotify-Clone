document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("playlist-div").innerHTML = `
            <p class="left-div-header">Create your first playlist</p>
            <p>It's easy, we'll help you</p>
            <button class="button-white-bg hover-increase-blur" onclick="alert('This function is still in development. You will be notified when it is ready to use.')">Create playlist</button>
        `;
    document.getElementById("podcasts-div").innerHTML = `
            <p class="left-div-header">Let's find some podcasts to follow</p>
            <p>We'll keep you updated on new episodes</p>
            <button class="button-white-bg hover-increase-blur" onclick="alert('This function is still in development. You will be notified when it is ready to use.')">Browse Podcasts</button>
        `;

    document.getElementById("all-music-and-podcast").classList.add("current");

    document.getElementById("all-music-and-podcast").addEventListener("click", function() {
       [...document.getElementsByClassName("button-grey-bg")].forEach(button => {
            button.classList.remove("current");
        });
        this.classList.add("current");
        //  RUN SHOW MUSICS AND PODCAST FUNCTION
    });

    document.getElementById("filter-only-music").addEventListener("click", function() {
        [...document.getElementsByClassName("button-grey-bg")].forEach(button => {
             button.classList.remove("current");
         });
         this.classList.add("current");
         //  RUN FILTER BY MUSIC FUNCTION
     });

     document.getElementById("filter-only-podcast").addEventListener("click", function() {
        [...document.getElementsByClassName("button-grey-bg")].forEach(button => {
             button.classList.remove("current");
         });
         this.classList.add("current");
         //  RUN FILTER BY PODCAST FUNCTION
     });
});






//      CODE TO HANDLE THE FUNCTIONS OF THE VOLUME CONTROL

const rangeInput = document.getElementById("volume");

rangeInput.addEventListener("input", function () {
    let val = (this.value - this.min) / (this.max - this.min) * 100;
    this.style.background = `linear-gradient(to right, white ${val}%, gray ${val}%)`;
    
    if (val == 0) {
        document.getElementById("speaker").innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
    } else if (val < 40) {
        document.getElementById("speaker").innerHTML = `<i class="fa-solid fa-volume-low"></i>`;
    } else if (val >= 40) {
        document.getElementById("speaker").innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
    } else {
        document.getElementById("speaker").innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
    }
});


//      HANDLE FULLSCREEN CONTROLS
const fullscreenBtn = document.getElementById("fullscreen");
fullscreenBtn.addEventListener("click", Switch_To_Fullscreen);
document.getElementById("expand-playing-track").addEventListener("click", Switch_To_Fullscreen);


function Switch_To_Fullscreen(){
    const icon = fullscreenBtn.querySelector("i");

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        icon.classList.remove("fa-expand");
        icon.classList.add("fa-compress");
    } else {
        document.exitFullscreen();
        icon.classList.remove("fa-compress");
        icon.classList.add("fa-expand");
    }
}


//      FETCH THE SONGS AND ORDER THEM TO PLAY
fetch("./php-scripts/fetch-songs-in-db.php",
    {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({action: "fetch-all-songs"})
    }
).then(response => response.json()).then(data => {
    if (data.success){
        musicList = data.success;
        originalList = [...musicList];
        Display_Musics(musicList);
/*      REMOVE THE THREE LINES ABOVE AND COMMENT THE THREE BELOW IS THERE ARE ANY PROBLEMS
        Display_Musics(data.success);
*/
    } else{
        alert(data.error);
    }
}).catch(error => console.log("AJAX Error: ", error));

function Display_Musics(music_object) {
    musicList = music_object;
    originalList = [...musicList];

    const recommendedContainer = document.getElementById("hold-recommended-songs");
    const popularContainer = document.getElementById("hold-popular-songs");
    const trendingContainer = document.getElementById("hold-trending-songs");

    // Clear previous content
    recommendedContainer.innerHTML = "";
    popularContainer.innerHTML = "";
    trendingContainer.innerHTML = "";

    const totalSongs = music_object.length;
    const chunkSize = Math.ceil(totalSongs / 3);

    const recommendedSongs = music_object.slice(0, chunkSize);
    const popularSongs = music_object.slice(chunkSize, chunkSize * 2);
    const trendingSongs = music_object.slice(chunkSize * 2);

    recommendedSongs.forEach((song, index) => {
        recommendedContainer.appendChild(Create_Song_Card(song, index));
    });

    popularSongs.forEach((song, index) => {
        popularContainer.appendChild(Create_Song_Card(song, index + chunkSize));
    });

    trendingSongs.forEach((song, index) => {
        trendingContainer.appendChild(Create_Song_Card(song, index + chunkSize * 2));
    });

    // Optional: Handle play button event delegation
    [recommendedContainer, popularContainer, trendingContainer].forEach(container => {
        container.addEventListener("click", (e) => {
            const button = e.target.closest("button.hover-button");
            if (button) {
                const index = parseInt(button.dataset.index);
                playSongAt(index);
            }
        });
    });
}


function Create_Song_Card(song, index) {
    const div = document.createElement("div");
    div.className = "one-song display-flex-column";
    div.innerHTML = `
        <div class="track-cover">
            <img src="${song.cover || './assets/no-album.png'}" alt="${song.title} cover" />
            <div class="play-button">
                <button class="hover-button" data-index="${index}">
                    <i class="fa-solid fa-circle-play" style="color: rgb(50, 211, 50); background-color: black; border-radius: 100%; font-size: 3.5rem;"></i>
                </button>
            </div>
        </div>
        <div class="song-info">
            <div class="song-title underline bold">${song.title}</div>
            <div class="artist color-grey">${song.artists}</div>
        </div>
    `;
    return div;
}

const audio = document.getElementById("mainAudio");
const playBtn = document.getElementById("play");

const currentTimeSpan = document.getElementById("current-time");
const remainingTimeSpan = document.getElementById("remaining-time");

let isPlaying = false;
let currentTrackIndex = 0;
let musicList = []; // Holds your list of songs
let originalList = [];
let shuffle = false;
let repeat = false;

function updatePlayIcon() {
    playBtn.innerHTML = isPlaying
        ? `<i class="fa-solid fa-circle-pause"></i>`
        : `<i class="fa-solid fa-circle-play"></i>`;
}

function loadSong(song) {
    audio.src = song.location;
    audio.load();
}


// Play Song by index
function playSongAt(index) {
    if (!musicList || index >= musicList.length) return;

    currentTrackIndex = index;

    const nowPlaying = musicList[index];
    loadSong(nowPlaying);
    audio.play().then(() => {
        isPlaying = true;
        updatePlayIcon();
        Update_Playing_Song_Div(index);
        Render_Queue();
    }).catch(err => console.error("Playback error: ", err));
}



playBtn.addEventListener("click", () => {
    if (audio.src === "") return;

    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        audio.play().catch(err => console.error("User interaction required:", err));
        isPlaying = true;
    }
    updatePlayIcon();
});


//


/*      VOLUME CONTROLS     */
const volumeSlider = document.getElementById("volume");
const speakerIcon = document.getElementById("speaker");

// Load saved volume or default to 0.7
let savedVolume = localStorage.getItem('volume');
audio.volume = savedVolume ? parseFloat(savedVolume) : 0.7;
volumeSlider.value = audio.volume;

/*      CONTROLLING MUTING AND UNMUTING EVENTS   */
let lastVolume = audio.volume || 0.7; // Store last volume before mute

document.getElementById("speaker-button").addEventListener('click', function () {
    if (audio.volume > 0) {
        // Mute
        lastVolume = audio.volume;
        audio.volume = 0;
        volumeSlider.value = 0;
        this.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
    } else {
        // Unmute
        audio.volume = lastVolume;
        volumeSlider.value = lastVolume;
        this.innerHTML = lastVolume < 0.4
            ? `<i class="fa-solid fa-volume-low"></i>`
            : `<i class="fa-solid fa-volume-high"></i>`;
    }

    // Save to localStorage
    localStorage.setItem('volume', audio.volume);

    // Update slider background
    let percent = (volumeSlider.value - volumeSlider.min) / (volumeSlider.max - volumeSlider.min) * 100;
    volumeSlider.style.background = `linear-gradient(to right, white ${percent}%, gray ${percent}%)`;
});

// Update volume and UI on slider change
volumeSlider.addEventListener("input", function () {
    const val = parseFloat(this.value);
    audio.volume = val;
    localStorage.setItem('volume', val);

    // Update gradient
    let percent = ((val - this.min) / (this.max - this.min)) * 100;
    this.style.background = `linear-gradient(to right, white ${percent}%, gray ${percent}%)`;

    // Update speaker icon
    if (val == 0) {
        speakerIcon.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
    } else if (val < 0.4) {
        speakerIcon.innerHTML = `<i class="fa-solid fa-volume-low"></i>`;
    } else {
        speakerIcon.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
    }
});


function Update_Playing_Song_Div(index){
    const song = musicList[index];
    
    // Example: Set song title and artist in the "now playing" section
    document.getElementById("playing-song-title").textContent = song.title;
    document.getElementById("playing-song-author").textContent = song.artists;
    document.getElementById("playing-song-cover-img").src = './assets/no-album.png';
}


function Show_Options() {
    const options = document.getElementById("profile-options");
    options.classList.toggle("show");

    if (options.classList.contains("show")) {
        // Add outside click listener
        document.addEventListener("click", handleOutsideClick);
    } else {
        // Remove if already closed
        document.removeEventListener("click", handleOutsideClick);
    }

    function handleOutsideClick(e) {
        const profilePic = document.getElementById("profile-pic");

        // If clicked outside profilePic area
        if (!profilePic.contains(e.target)) {
            options.classList.remove("show");
            document.removeEventListener("click", handleOutsideClick);
        }
    }
}

function Scroll_Left(event) {
    const button = event.target.closest(".chevron-button");
    if (!button) return;

    const container = button.parentElement.querySelector(".song-scroll-container");
    if (container) {
        container.scrollBy({ left: -200, behavior: 'smooth' });
    }
}

function Scroll_Right(event) {
    const button = event.target.closest(".chevron-button");
    if (!button) return;

    const container = button.parentElement.querySelector(".song-scroll-container");
    if (container) {
        container.scrollBy({ left: 200, behavior: 'smooth' });
    }
}


/*      CONTROL RESIZING OF LEFT AND RIGHT DIVS USING THE MIDDLE BAR    */
/* CONTROL RESIZING OF LEFT AND RIGHT DIVS USING THE MIDDLE BAR */
const left_resizer = document.getElementById('control-window-portioning');
const leftDiv = document.getElementById('left-div');
const main = document.getElementById('main');

let isResizing = false;

left_resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const mainOffsetLeft = main.offsetLeft;
    const newLeftWidth = e.clientX - mainOffsetLeft;

    if (newLeftWidth >= 300 && newLeftWidth <= 600) {
        leftDiv.style.flex = `0 0 ${newLeftWidth}px`;
    }
});

document.addEventListener('mouseup', (e) => {
    if (isResizing) {
        isResizing = false;
        document.body.style.cursor = 'default';
        e.stopPropagation();  // Stop propagation for the left resizer
    }
});

// Right side resizing
const rightmost_resizer = document.getElementById("control-rightmost-div-portioning");
const rightmost_div = document.getElementById("toggle-rightmost-div");

let is_resizing_rightmost = false;

rightmost_resizer.addEventListener("mousedown", (e) => {
    is_resizing_rightmost = true;
    document.body.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (!is_resizing_rightmost) return;

    const mainRight = main.offsetLeft + main.offsetWidth;
    const newWidth = mainRight - e.clientX;

    // Limit the size if desired
    if (newWidth >= 100) {
        //rightmost_div.style.width = `${newWidth}px`;
        rightmost_div.style.flex = `0 0 ${newWidth}px`;
    } else if(newWidth<100){
        Close_Rightmost_Div();
    }else{
        console.log(`Maximum width reached:- 600px`);
    }
});

document.addEventListener("mouseup", (e) => {
    if (is_resizing_rightmost) {
        is_resizing_rightmost = false;
        document.body.style.cursor = "default";
        e.stopPropagation();  // Stop propagation for the right resizer
    }
});
function Open_Rightmost_Div(){
    rightmost_resizer.style.display = 'block';

    rightmost_div.style.display = 'flex';
}
function Close_Rightmost_Div(){
    rightmost_div.style.display = 'none';
    rightmost_resizer.style.display = 'none';
}

/*      SEARCH SHORTCUT      */
document.addEventListener('keydown', function(event) {
    // Example: Ctrl + S
    if (event.ctrlKey && event.key === 'k' || event.ctrlKey && event.key === 'K') {
      event.preventDefault(); // Prevent browser's default save dialog
      Shortcut_Search();
    }

});
function Shortcut_Search(){
    alert('This function is still in development. You will be notified when it is ready to use.');
    document.getElementById("shortcut-search-background").classList.toggle("show");
}
/*  HANDLE MUSIC QUEUING    */
//  DISPLAYING THE QUEUE DIV
function Create_Small_Song_Card(song, index){
    let song_card = document.createElement('div');
    song_card.classList.add("display-flex-row", "row-space-between", "small-song-card");
    song_card.innerHTML = `
        <div class="display-flex-row gap-10">
            <div class="small-song-card-cover">
                <img src="./assets/no-album.png" class="small-song-card-image">
                <div class="small-song-card-play-song-div">
                    <button class="hover-increase-blur small-song-card-play-song-button" data-index="${index}"><i class="fa-solid fa-play" style="color: #ffffff;"></i></button>
                </div>
            </div> 

            <div class="small-song-card-info">
                <div class="song-title underline bold">${song.title}</div>
                <div class="artist color-grey ">${song.artists}</div>
            </div>
        </div>  

        <div class="small-song-card-options">
            <i class="fa-solid fa-ellipsis" style="color: #ffffff;"></i>
        </div>
    `;
    
    song_card.querySelector('.small-song-card-play-song-button').addEventListener('click', (e) => {
        const songIndex = parseInt(e.currentTarget.dataset.index);
        playSongAt(songIndex);
    });

    return song_card;
}
/*
document.getElementById("queue-button").addEventListener('click', function() {
    if (rightmost_div.style.display == 'none'){
        Open_Rightmost_Div();

        document.getElementById("rightmost-div-header-name").textContent = "Queue";

        let rightmost_inner_div = document.getElementById("rightmost-div-inner-content")
        rightmost_inner_div.innerHTML = "";
        const now_playing_text = document.createElement('h3')
        now_playing_text.textContent="Now Playing"
        rightmost_inner_div.appendChild(now_playing_text);

        // MAKE IT THE SONG THAT IS CURRENTLY PLAYING
        let currently_playing_song = Create_Small_Song_Card(musicList[0], 0);
        rightmost_inner_div.appendChild(currently_playing_song);

        const next_playing_text = document.createElement('h3')
        next_playing_text.textContent="Next Up"
        rightmost_inner_div.appendChild(next_playing_text);
        
        musicList.slice(1).forEach((song, index) => {
            rightmost_inner_div.appendChild(Create_Small_Song_Card(song, index));
        })
        
    }else{
        Close_Rightmost_Div();
    }
    
    
});
*/
function Render_Queue() {
    if (!musicList.length) return;

    const rightmost_inner_div = document.getElementById("rightmost-div-inner-content");
    rightmost_inner_div.innerHTML = "";

    const now_playing_text = document.createElement('h3');
    now_playing_text.textContent = "Now Playing";
    now_playing_text.style = "margin:0;";

    rightmost_inner_div.appendChild(now_playing_text);

    // Currently playing song
    const nowPlaying = Create_Small_Song_Card(musicList[currentTrackIndex], currentTrackIndex);
    rightmost_inner_div.appendChild(nowPlaying);

    const up_next_text = document.createElement('h3');
    up_next_text.textContent = "Up Next";
    up_next_text.style = "margin:0;";
    rightmost_inner_div.appendChild(up_next_text);

    for (let i = currentTrackIndex + 1; i < musicList.length; i++) {
        const songCard = Create_Small_Song_Card(musicList[i], i);
        rightmost_inner_div.appendChild(songCard);
    }
}

document.getElementById("queue-button").addEventListener('click', function() {
    if (rightmost_div.style.display === 'none') {
        Open_Rightmost_Div();
        document.getElementById("rightmost-div-header-name").textContent = "Queue";

        Render_Queue();
    } else {
        Close_Rightmost_Div();
    }
});

//  HANDLE REPEAT EVENT
document.getElementById("repeat-button").addEventListener("click", function(){
    if (repeat){
        repeat = false;
        this.classList.remove("on");
    }else if(!repeat){
        repeat = true;
        this.classList.add("on");
    }   
});


audio.addEventListener("ended", function(){
    if (Math.floor(audio.currentTime) >= Math.floor(audio.duration)) {
        handleNextSong();
    }
});
function handleNextSong() {
    if (repeat) {
        // Repeat the same song
        playSongAt(currentTrackIndex);
        
    } else {
        // Move to the next song
        currentTrackIndex++;

        // Loop back if reached end of list
        if (currentTrackIndex >= musicList.length) {
            currentTrackIndex = 0;
        }

        playSongAt(currentTrackIndex);
    }
}


/*      SHUFFLING MUSICS - QUEUE    */
document.getElementById("shuffle-button").addEventListener("click", function() {
    shuffle = !shuffle;

    const currentSong = musicList[currentTrackIndex];  // "Now Playing" song

    if (shuffle) {
        // Get the remaining songs excluding the "Now Playing" song
        const remaining = [...musicList.slice(0, currentTrackIndex), ...musicList.slice(currentTrackIndex + 1)];
        const shuffled = shuffleArray(remaining);  // Shuffle the rest of the songs

        // Rebuild musicList with the "Now Playing" song at its position
        musicList = [
            ...shuffled.slice(0, currentTrackIndex),
            currentSong,  // Insert the "Now Playing" song back at its position
            ...shuffled.slice(currentTrackIndex)
        ];

        this.classList.add('on');
        playSongAt(0);
        
    } else {
        // Reset to original order, keeping "Now Playing" song in place
        const restSongs = originalList.filter(song => song !== currentSong);
        musicList = [currentSong, ...restSongs];

        // Keep the index the same in original list
        currentTrackIndex = originalList.findIndex(song => song === currentSong);

        this.classList.remove('on');
        
    }

    Render_Queue(); // ⬅️ Update queue display
});

// Fisher-Yates Shuffle function
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap
    }
    return arr;
}




function Shuffle_Array(array) {
    // Fisher-Yates Shuffle Algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
     

}   
const progressBar = document.getElementById("progress");
const currentTime = document.getElementById("current-time");
const remainingTime = document.getElementById("remaining-time");

let isSeeking = false;
progressBar.addEventListener("input", () => {
    isSeeking = true;
});
audio.addEventListener("loadedmetadata", () => {
    progressBar.disabled = false; // enable progressBar once duration is known
});
progressBar.addEventListener("change", () => {
    const duration = audio.duration;
    if (!duration || isNaN(duration)) return;

    const seekTo = Number((progressBar.value / 100) * audio.duration);;
    audio.currentTime = seekTo;
    isSeeking = false;
});





audio.ontimeupdate = () => {
    if (isSeeking) return;
    let cur = Math.floor(audio.currentTime);
    let dur = Math.floor(audio.duration);
    currentTime.textContent = formatTime(cur);
    remainingTime.textContent = '-' + formatTime(dur - cur);
    progressBar.value = (cur / dur) * 100;
};


function formatTime(t) {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}


function Play_Next_Song() {
    currentTrackIndex = (currentTrackIndex + 1) % musicList.length;
    playSongAt(currentTrackIndex);
}

function Play_Previous_Song() {
    currentTrackIndex = (currentTrackIndex - 1 + musicList.length) % musicList.length;
    playSongAt(currentTrackIndex);
}
/*

TRACK REMAINING TIME


ALPHA BETA? OWNS GOOGLE?

*/


/*      CHAT SCRIPTS */ 
function setupWebSocket() {
    const socket = new WebSocket("ws://16.171.145.40:8081");
    //const socket = new WebSocket("ws://localhost:8081");
    socket.onclose = () => setTimeout(setupWebSocket, 5000); // Reconnect after 5s
    return socket;
}
const SOCKET = setupWebSocket();
SOCKET.addEventListener("open", () => {
const USERNAME = sessionStorage.getItem("user_name");
if (!USERNAME){
    alert("Messages cannot be sent/received because your browser session has ended. Please login again.");
}
    // Identify the user to the server
    SOCKET.send(JSON.stringify({
        type: "init",
        user_id: USERNAME 
    }));
});
SOCKET.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);

    if (data.from && data.message) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        displayReceivedMessage(data.message, time);
    }
});

function Open_Chat_Page(){
    if (!sessionStorage.getItem('user_name')){
        alert("Please log in to access chat features");
        return;
    }

    document.getElementById("swap-to-chat").classList.toggle("hide");

    document.getElementById("chat-div").classList.toggle("show") ;

    //FETCH
    let form_data = JSON.stringify({action: "fetch-user-friend-list"});
    
    fetch("./php-scripts/handle-user-chats.php",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: form_data
        }
    ).then(response => response.json()).then(data => {
        console.log(data);
        if (data.success){
            friendlist_container = document.getElementById("friends-list");
            friendlist_container.innerHTML = '';
            data.success.forEach(friend => {
                let friendCard = Create_Friend_List_Card(friend.friend_name, friend.last_message, friend.timestamp, friend.receiver);
                friendlist_container.appendChild(friendCard);
            });
        }else if(data.no_friends){
            document.getElementById("friends-list").innerHTML += `<h2>You have no friends yet. Search for some!!!</h2>`;
        }else if(data.error){
            alert(data.error);
        } else if (data.no_session){
            document.getElementById("swap-to-chat").classList.toggle("hide");
            document.getElementById("chat-div").classList.toggle("show") ;

            alert("Please login first");
        }

    }).catch(error => console.log("AJAX ERROR: ", error));
}
//      TO DO: SEND MESSAGE WITH RECEIVER ID
function Send_Text_To_User() {
    let message = document.getElementById("message-to-send").value;
    document.getElementById("message-to-send").value = '';  // Clear the input field
    if (message.trim() === '') {
        return;
    }
    let messageData = {
        type: 'message',  // Message type identifier
        to: toUserId,     // ID of the recipient
        message: message  // The actual message to send
    };

    // Check if the WebSocket connection is open before sending the message
    if (SOCKET.readyState === WebSocket.OPEN) {
        SOCKET.send(JSON.stringify(messageData));
        displaySentMessage(message, getCurrentTime());
    } else {
        console.log("WebSocket is not open. Current state: " + SOCKET.readyState);
        // Optionally, you can try to reconnect the WebSocket here if needed
        reconnectWebSocket();  // Ensure you define reconnectWebSocket if you choose to use it
    }
}
function reconnectWebSocket() {
    console.log("Attempting to reconnect WebSocket...");

    // Close the existing WebSocket connection if needed
    if (SOCKET.readyState === WebSocket.OPEN || SOCKET.readyState === WebSocket.CONNECTING) {
        SOCKET.close();
    }

    // Re-establish the WebSocket connection
    SOCKET = new WebSocket('ws://localhost:8080'); // Replace with your actual WebSocket server URL

    SOCKET.onopen = function() {
        console.log("WebSocket reconnected.");
    };

    SOCKET.onmessage = function(event) {
        console.log("Message received: " + event.data);
    };

    SOCKET.onerror = function(error) {
        console.log("WebSocket error: " + error);
    };

    SOCKET.onclose = function() {
        console.log("WebSocket connection closed.");
    };
}

function getCurrentTime() {
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    
    // Format time to be in 24-hour format, adding leading zero to minutes
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    
    return hours + ":" + minutes;
}
function displaySentMessage(messageText, time) {
    let sentMessageDiv = document.createElement("div");
    sentMessageDiv.classList.add("sent-message");

    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.textContent = messageText;

    let messageTimeDiv = document.createElement("div");
    messageTimeDiv.classList.add("message-time");
    messageTimeDiv.textContent = time;

    sentMessageDiv.appendChild(messageDiv);
    sentMessageDiv.appendChild(messageTimeDiv);

    // Append to the chat container
    document.getElementById("opened-chat-messages").appendChild(sentMessageDiv);
}
function displayReceivedMessage(messageText, time) {
    let receivedMessageDiv = document.createElement("div");
    receivedMessageDiv.classList.add("received-message");

    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.textContent = messageText;

    let messageTimeDiv = document.createElement("div");
    messageTimeDiv.classList.add("message-time");
    messageTimeDiv.textContent = time;

    receivedMessageDiv.appendChild(messageDiv);
    receivedMessageDiv.appendChild(messageTimeDiv);

    // Append to the chat container
    document.getElementById("opened-chat-messages").appendChild(receivedMessageDiv);
}



document.getElementById('search-user-input').addEventListener('keydown', function(event) {
    // Check if the ENTER key (key code 13) is pressed
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent form submission if inside a form
        Search_For_User();  // Call a function to handle the search action
    }
});

// Define the search function (you can replace this with your actual search logic)
function Search_For_User() {
    let searchQuery = document.getElementById('search-user-input').value;

    // Create the form data to send to the server
    let form_data = JSON.stringify({ action: "search-user", search_for: searchQuery });

    // Make the fetch request to the server
    fetch("./php-scripts/handle-user-chats.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: form_data
    })
    .then(response => response.json())  // Parse the JSON response
    .then(data => {
        if (data.success) {
            // Clear any previous search results
            let resultsContainer = document.getElementById("friend-search-results-container");
            resultsContainer.innerHTML = '';

            // Iterate over the users and create a card for each user
            data.users.forEach(user => {
                let friendCard = Create_Searched_Friend_Profile_Card(user.user_name);
                resultsContainer.appendChild(friendCard);
            });
        } else {
            let resultsContainer = document.getElementById("friend-search-results-container");
            resultsContainer.innerHTML = '';

            alert(data.error);  // Handle errors like no users found
        }
    })
    .catch(error => console.error('Error:', error));
}

let toUserId = '';
function Fetch_Opened_Chat_Data(user_name) {
    toUserId = user_name;
    document.getElementById("opened-chat-receiver-name").innerHTML = user_name;


    let form_data = JSON.stringify({ 
        action: "fetch-opened-chat",
        opened_chat_username: user_name
    });

    fetch("./php-scripts/handle-user-chats.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: form_data
    })
    .then(response => response.json())
    .then(data => {
        const chatContainer = document.getElementById("opened-chat-messages");
        chatContainer.innerHTML = ""; // Clear previous messages

        const currentUser = data.current_user; // Replace with your own way to get the session user
        

        data.messages.forEach(message => {
            const text = message.message_text;
            const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            if (message.sender_id === currentUser) {
                displaySentMessage(text, time);
            } else {
                displayReceivedMessage(text, time);
            }
        });

        // Optionally scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    })
    .catch(error => console.error("Fetch error:", error));
}

function Close_Chat(){
    toUserId = '';
    document.getElementById("opened-chat-messages").innerHTML = '';
    document.getElementById("opened-chat-receiver-name").innerHTML = '';
}



function Create_Friend_List_Card(friend_name, last_message, timestamp){
    let friend_card = document.createElement("div");

    friend_card.classList.add("one-friend",  "display-flex-row", "row-space-between");
    friend_card.setAttribute("data-username", friend_name);

    friend_card.innerHTML = `
        <div class="friend-profile">
            <i class="fa-solid fa-user user-icon cursor-pointer" style="font-size: 1.7rem"></i>
        </div>
        <div class="chat-info display-flex-column">
            <div class="friend-name">${friend_name}</div>
            <div class="recent-message">${last_message}</div>
        </div>
        <div class="recent-message-time">${timestamp}</div>
    `;

    friend_card.addEventListener("click", function() {
        let receiver = friend_name; 
        Fetch_Opened_Chat_Data(friend_name);
    });

    return friend_card;

}


//      EVENT DELEGATION FOR WHEN A FRIEND IS CLICKED TO EXPAND
document.getElementById("friends-list").addEventListener("click", function(e) {
    const friendCard = e.target.closest(".one-friend");
    if (friendCard) {
        const username = friendCard.getAttribute("data-username");
        // Call function to open chat with this user, etc.
        Fetch_Opened_Chat_Data(username); 
    }
});


document.getElementById("search-user-input").addEventListener("focus", () => {
    document.getElementById("friend-list-cover").style.display = 'flex';
});
function Close_Search_For_Friends_Div(){
    document.getElementById("friend-list-cover").style.display = 'none';
}


function Create_Searched_Friend_Profile_Card(user_name){
    let searched_friend_card = document.createElement("div");
    searched_friend_card.classList.add("searched-friend-card", "display-flex-row");
    searched_friend_card.style.justifyContent = "space-around";

    searched_friend_card.innerHTML = `  
        <i class="fa-solid fa-user user-icon cursor-pointer" style="font-size: 1.7rem"></i>
        <div class="searched-friend-name">${user_name}</div>
        <button class="open-single-chat" data-recepient-id="${user_name}">
            <i class="fa-solid fa-plus"></i>
        </button>
    `;

    searched_friend_card.querySelector('.open-single-chat').addEventListener('click', function() {
        let recipientId = this.getAttribute('data-recepient-id');
        Add_To_Friends_List(recipientId);
        Fetch_Opened_Chat_Data(recipientId);
    });

    return searched_friend_card;
}

function Add_To_Friends_List(recipientId) {
    const user_name = sessionStorage.getItem("user_name");

    // Send a request to the backend to add the recipient to the logged-in user's friends list
    fetch('./php-scripts/handle-user-chats.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: "add-to-friends",
            user_name: user_name,
            friend_name: recipientId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("You can now text "+recipientId);
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });
}


function Show_Profile_Name(){
    alert("You are logged in as: " + sessionStorage.getItem("user_name"));
}

/*  LOG OUT  */
function Log_Out(){
    sessionStorage.clear();
    window.location.href = "php-scripts/logout.php";
}