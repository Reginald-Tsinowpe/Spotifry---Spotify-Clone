<?php
function renderSmallSongCard($song, $index, $isCurrent = false) {
    $currentClass = $isCurrent ? 'current-playing' : '';
    return <<<HTML
    <div class="display-flex-row row-space-between small-song-card" data-index="$index">
        <div class="display-flex-row gap-10">
            <div class="small-song-card-cover">
                <img src="./assets/no-album.png" class="small-song-card-image">
                <div class="small-song-card-play-song-div">
                    <button class="hover-increase-blur small-song-card-play-song-button">
                        <i class="fa-solid fa-play" style="color: #ffffff;"></i>
                    </button>
                </div>
            </div>
            <div class="small-song-card-info">
                <div class="song-title underline bold">{$song['title']}</div>
                <div class="artist color-grey">{$song['artists']}</div>
            </div>
        </div>
        <div class="small-song-card-options">
            <i class="fa-solid fa-ellipsis" style="color: #ffffff;"></i>
        </div>
    </div>
HTML;
}
?>