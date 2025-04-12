<?php
session_start();


if (!isset($_SESSION['username'])) {
    header("Content-Type: application/json");
    echo json_encode(["no_session" => "No session available!"]);
    exit;
}

    
require_once './../../config/config.php'; // Ensure correct path to config



// Get the incoming JSON request
$data = json_decode(file_get_contents("php://input"), true);

// Check if 'action' is set
if (!isset($data['action'])) {
    echo json_encode(["error" => "No action specified"]);
    exit;
}

$action = $data['action'] ?? null;

if (!$action) {
    echo json_encode(["error" => "No action specified"]);
    exit;
}

// Route the request based on the 'action' value
switch ($action) {
    case "fetch-user-friend-list":
        Fetch_User_Friends_List($_SESSION['username']);
        break;

    case "fetch-opened-chat":
        if (isset($data['opened_chat_username'])) {
            Fetch_Chat_Messages($data['opened_chat_username']);
        } else {
            echo json_encode(["error" => "Oops! It seems no chat has been opened."]);
        }
        break;
    
    case "search-user":
        if (isset($data['search_for'])) {
            
            Search_For_User_Account($data['search_for']);

        } else {
            ob_clean();
            echo json_encode(["error" => "Insufficient information submitted"]);
            exit;
        }
        break;
    case "add-to-friends":
        if (isset($data['friend_name'])) {
            Add_Friend_To_User($_SESSION['username'], $data['friend_name']);
        } else {
            echo json_encode(["error" => "Friend name not provided."]);
        }
        break;

    default:
        echo json_encode(["error" => "No aciton set"]);
        break;
}

function Fetch_User_Friends_List($user_name) {
    global $conn;

    // Fetch user_friends column
    $stmt = $conn->prepare("SELECT user_friends FROM tbl_user_data WHERE user_name = ?");
    $stmt->bind_param("s", $user_name);
    if (!$stmt->execute()) {
        echo json_encode(["error" => "Failed to fetch friends list."]);
        return;
    }

    $result = $stmt->get_result()->fetch_assoc();
    $friends_raw = $result['user_friends'];

    if (!$friends_raw) {
        echo json_encode(["no_friends" => "no friends"]);
        return;
    }

    // Assume friends are stored as a comma-separated list
    $friends = explode(",", $friends_raw);
    $friends_data = [];

    foreach ($friends as $friend) {
        $friend = trim($friend); // Remove whitespace

        // Fetch the latest message between user and friend
        $msg_stmt = $conn->prepare("
            SELECT message_text, timestamp, sender_id, receiver_id 
            FROM tbl_messages 
            WHERE 
                (sender_id = ? AND receiver_id = ?) OR 
                (sender_id = ? AND receiver_id = ?) 
            ORDER BY timestamp DESC 
            LIMIT 1
        ");
        $msg_stmt->bind_param("ssss", $user_name, $friend, $friend, $user_name);
        $msg_stmt->execute();
        $msg_result = $msg_stmt->get_result()->fetch_assoc();

        $friends_data[] = [
            "friend_name" => $friend,
            "last_message" => $msg_result['message_text'] ?? null,
            "timestamp" => $msg_result['timestamp'] ?? null,
            "sender" => $msg_result['sender_id'] ?? null,
            "receiver" => $msg_result['receiver_id'] ?? null
        ];
    }

    echo json_encode(["success" => $friends_data]);
}

/*
function Send_Message_To_Db($message, $sender, $recipient){

}
*/
function Search_For_User_Account($username) {
    global $conn;

    if (!isset($_SESSION['username'])) {
        echo json_encode(["error" => "Not logged in"]);
        return;
    }

    $current_user = $_SESSION['username'];
    $search_pattern = "%" . $username . "%";

    // Prepare the query to exclude the current user
    $stmt = $conn->prepare("SELECT user_name FROM tbl_user_data WHERE user_name LIKE ? AND user_name != ?");
    $stmt->bind_param("ss", $search_pattern, $current_user);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $users = [];

        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }

        if (count($users) > 0) {
            echo json_encode(["success" => true, "users" => $users]);
        } else {
            echo json_encode(["error" => "No users found"]);
        }
    } else {
        echo json_encode(["error" => "Database query failed"]);
    }

    $stmt->close();
}



function Fetch_Chat_Messages($opened_chat_username) {
    global $conn;
    $current_user = $_SESSION['username'];

    $sql = "SELECT sender_id, receiver_id, message_text, timestamp 
            FROM tbl_messages 
            WHERE 
                (sender_id = ? AND receiver_id = ?) 
                OR 
                (sender_id = ? AND receiver_id = ?)
            ORDER BY timestamp ASC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $current_user, $opened_chat_username, $opened_chat_username, $current_user);
    $stmt->execute();

    $result = $stmt->get_result();
    $messages = [];

    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }

    echo json_encode([
        "current_user" => $current_user,
        "messages" => $messages
    ]);
    $stmt->close();
}


function Add_Friend_To_User($current_user, $new_friend) {
    global $conn;

    if ($current_user === $new_friend) {
        echo json_encode(["error" => "Cannot add yourself as a friend."]);
        return;
    }

    // Get current list of friends
    $stmt = $conn->prepare("SELECT user_friends FROM tbl_user_data WHERE user_name = ?");
    $stmt->bind_param("s", $current_user);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    $current_friends = explode(",", $result['user_friends'] ?? "");
    $current_friends = array_filter(array_map('trim', $current_friends)); // clean up

    // Check if friend already exists
    if (in_array($new_friend, $current_friends)) {
        echo json_encode(["success" => "Already friends"]);
        return;
    }

    $current_friends[] = $new_friend;
    $updated_friends = implode(",", $current_friends);

    // Update user_friends in database
    $update_stmt = $conn->prepare("UPDATE tbl_user_data SET user_friends = ? WHERE user_name = ?");
    $update_stmt->bind_param("ss", $updated_friends, $current_user);
    if ($update_stmt->execute()) {
        echo json_encode(["success" => "$new_friend added to your friends list"]);
    } else {
        echo json_encode(["error" => "Failed to update friends list"]);
    }
    $update_stmt->close();
}


?>