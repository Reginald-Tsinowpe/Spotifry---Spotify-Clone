<?php
function renderSongCard($song, $index) {
    $cover = $song['cover'] ?? './assets/no-album.png';
    return <<<HTML
<div class="one-song display-flex-column" data-index="$index">
    <div class="track-cover">
        <img src="$cover" alt="{$song['title']} cover" />
        <div class="play-button">
            <button class="hover-button" data-index="$index">
                <i class="fa-solid fa-circle-play" style="color: rgb(50, 211, 50); background-color: black; border-radius: 100%; font-size: 3.5rem;"></i>
            </button>
        </div>
    </div>
    <div class="song-info">
        <div class="song-title underline bold">{$song['title']}</div>
        <div class="artist color-grey">{$song['artists']}</div>
    </div>
</div>
HTML;
}
?>