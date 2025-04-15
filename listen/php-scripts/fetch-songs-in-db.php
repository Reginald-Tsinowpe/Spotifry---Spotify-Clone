<?php
require_once './../../config/config.php';
require_once './../components/create-song-card.php';
require_once './../components/create-small-song-card.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['action'])) {
    echo json_encode(["error" => "No action specified"]);
    exit;
}

$action = $data['action'];

switch ($action) {
    case "fetch-all-songs":
        global $conn;
        $result = $conn->query("SELECT * FROM `tbl_musics`");
        
        $rows = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
            
            // Instead of returning raw data, return rendered HTML
            $htmlOutput = [];
            foreach ($rows as $index => $song) {
                $htmlOutput[] = renderSongCard($song, $index);
            }
            $songs = $rows;
            $response = [
                'success' => $songs,
                'html' => array_map('renderSongCard', $songs, array_keys($songs)),
                'small_html' => array_map('renderSmallSongCard', $songs, array_keys($songs), array_fill(0, count($songs), false))
            ];
            echo json_encode($response);        
        } else {
            echo json_encode(["error" => "No music found"]);
        }
        break;

    default:
        echo json_encode(["error" => "Invalid action"]);
}
?>