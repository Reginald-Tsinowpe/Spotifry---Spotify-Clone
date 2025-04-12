<?php

session_start();
require_once './../../config/config.php'; // Ensure correct path to config

//REMOVE ERROR REPORTING CODE ONCE DONE
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");


// Get the incoming JSON request
$data = json_decode(file_get_contents("php://input"), true);

// Check if 'action' is set
if (!isset($data['action'])) {
    echo json_encode(["error" => "No action specified"]);
    exit;
}

$action = $data['action'];

// Route the request based on the 'action' value
switch ($action) {
    case "fetch-all-songs":
        global $conn;

        $result = $conn->query("SELECT * FROM `tbl_musics`");

        $rows = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
            echo json_encode(["success" => $rows]);
        } else {
            echo json_encode(["error" => "No music found"]);
        }
        break;


    default:
        return;
    
}

?>