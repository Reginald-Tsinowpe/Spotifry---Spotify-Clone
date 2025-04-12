<?php

session_start();

require  __DIR__ . '/../../config/config.php'; // Ensure correct path to config
require  __DIR__ . '/../../config/email-credentials.php';  // Ensure the Google Client library is autoloaded


use Google\Client;

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
    case "check-user-existence":
        if (isset($data['username_or_email'])) {
            
            Check_User_Existence($data['username_or_email']);
        } else {
            echo json_encode(["error" => "Username or Email is required"]);
            exit;
        }
        break;

    case "verify-user-password":
        if (isset($data['email'], $data['password'])) {
            //  ADD PASSWORD TO DB
            Verify_User_Password($data['email'], $data['password']);

        } else {
            echo json_encode(["error" => "Insufficient information submitted"]);
            exit;
        }
        break;

    case "send-otp-code":
        if (isset($data['email'])) {
            Generate_And_Send_OTP_Code($data['email']);

        } else {
            echo json_encode(["error" => "Recepient email not set."]);
            exit;
        }
        break;

    case "verify-otp-code":
        if (isset($data['email'], $data['otp_code'])){
            Verify_User_OTP($data['email'], $data['otp_code']);
        } else{
            echo json_encode(["error" => "Login Unsuccessful"]);
            exit;
        }
        break;

    case "google-login":
        if(isset($data['credential'])){
            Login_With_Google($data['credential']);
        } else {
            echo json_encode(["error" => "Login Unsuccessful"]);
            exit;
        }
        break;
    

    default:
        echo json_encode(["error" => "Invalid action"]);
        exit;
}


function Check_User_Existence($user_id){
    
    global $conn;
    $email_pattern = "/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/";

    if (preg_match($email_pattern, $user_id)) {
        // CHECK THE EMAIL FIELD
        $check_email = $conn->prepare("SELECT * FROM `tbl_user_data` WHERE `email`=?");
        $check_email->bind_param("s", $user_id);
        if (!$check_email->execute()){
            echo json_encode(["error" => "There was a problem on the server"]);
            return;
        }
        $result = $check_email->get_result();
        
        
    } else {
        // CHECK THE USERNAME FIELD
        $check_username = $conn->prepare("SELECT * FROM `tbl_user_data` WHERE `user_name`=?");
        $check_username->bind_param("s", $user_id);
        if (!$check_username->execute()){
            echo json_encode(["error" => "There was a problem on the server"]);
            return;
        }
        $result = $check_username->get_result();        
    }
    
    $row = $result->fetch_assoc();

    if ($row) {
        echo json_encode(["success" => $row['email']]);
        return;
    }else{
        echo json_encode(["error" => "The Username or Email cannot be found on the server"]);
        return;
    }


}



// VERIFYING THE USER'S PASSWORD
function Verify_User_Password($email, $password){
    
    global $conn;
    

    $fetch_user_details_stmt = $conn->prepare("SELECT `password`, `user_name` FROM `tbl_user_data` WHERE `email`=?");
    $fetch_user_details_stmt->bind_param('s', $email);
    if (!$fetch_user_details_stmt->execute()){
       
        echo json_encode(["error" => "There was a problem with the server"]);
        return;
    }
    
    
    $search_result = $fetch_user_details_stmt->get_result()->fetch_assoc();
    $db_password = $search_result['password'];
    if($password == $db_password){
       
        $username = $search_result['user_name'];
        Start_Session_With_Username($username);
        
       
        
        echo json_encode(["success" => $username]);
        
        return;
    }else{
    
        echo json_encode(["wrong_pass" => "Password incorrect. Try again"]);
        return;
    }
    

}


//  OTP CODE HANDLING
function Generate_And_Send_OTP_Code($email){

    global $conn; 

    $randigit = mt_rand(100000, 999999);

    $store_otp_stmt = $conn->prepare("UPDATE `tbl_user_data` SET `otp_code`=? WHERE `email`=?");
    $store_otp_stmt->bind_param('ss', $randigit, $email);
    
    if(!$store_otp_stmt->execute()){
       
        echo json_encode(["error" => "There was an error handling the OTP Code"]);
        return;
    }

    require 'send-otp.php';

    $response = sendOTPEmail($email, $randigit);

    
    if (isset($response['success'])) {

        echo json_encode(["success" => "otp code sent"]); 
        return;
    } else if (isset($response['error'])) {

        echo json_encode(["error" => "There was a problem sending the OTP code"]); 
        return;
    }



}

function Verify_User_OTP($email, $otp_code){
    global $conn;
    
    $fetch_otp_stmt = $conn->prepare("SELECT `otp_code`, `user_name` FROM `tbl_user_data` WHERE `email`=?");
    $fetch_otp_stmt->bind_param("s", $email);
    if ($fetch_otp_stmt->execute()){
        $search_result = $fetch_otp_stmt->get_result()->fetch_assoc();
        $db_otp_code = $search_result['otp_code'];
    }else{
        
        echo json_encode(["error" => "There was an error querying the database. Please try again later"]);
        return;
    }

    if ($otp_code == $db_otp_code){
       $username = $search_result['user_name'];
        Start_Session_With_Username($username);

       
        Start_Session_With_Username($username);
        echo json_encode(["success" => $username]);
        return;
    }else{
        
        echo json_encode(["error" => "Invalid OTP. Try Again".$db_otp_code]);
        return;
    }

}

function Login_With_Google($credential){


    // Set your Google OAuth2 client ID
    $google_client_id = '794513802781-3r093r25686ovju00ihjat1g5sb84bd4.apps.googleusercontent.com';

    // Decode the incoming JSON request
    $id_token = $credential; // Get the Google ID token from the client-side request

    if (!$id_token) {
        
        echo json_encode(['error' => 'Token not provided']);
        exit;
    }

    // Initialize the Google client
    $client = new Client();
    $client->setClientId($google_client_id);

    try {
        // Verify the ID token
        $payload = $client->verifyIdToken($id_token);

        if ($payload) {
            // The token is valid, you can now use the information in $payload
            $user_id = $payload['sub']; // This is the Google user ID
            $user_email = $payload['email']; // This is the user's email address

            // Here you can check if the user exists in your database or create a new user
            // Example: Query your database to find or insert the user
            global $conn;
            // Check if the user exists
            $stmt = $conn->prepare("SELECT * FROM tbl_user_data WHERE email = ?");
            $stmt->bind_param("s", $user_email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                // User exists, log them in
                $user = $result->fetch_assoc();

                Start_Session_With_Username($user['user_name']);
                
                echo json_encode(['success' => $user['user_name']]);
            } else {
                echo json_encode(['error' => 'It seems you do not have an account. Please create one before logging in.']);
            }
        } else {
            // Invalid ID token
            echo json_encode(['error' => 'Invalid token']);
        }
    } catch (Exception $e) {
        echo json_encode(['error' => 'Error verifying token']);
    }
}


function Start_Session_With_Username($username){
    $_SESSION['username'] = $username;
}



?>