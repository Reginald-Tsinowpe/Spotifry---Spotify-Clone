<?php

define('BASE_PATH', __DIR__);

$host = getenv('DB_HOSTNAME');
$user = getenv('DB_USERNAME');
$pass = getenv('DB_PASSWORD');
$db   = getenv('DB_NAME');
$port = getenv('DB_PORT');


$conn = new mysqli($host, $user, $pass, $db, $port);


// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


?>