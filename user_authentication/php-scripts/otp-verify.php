<?php

session_start();


header('Content-Type: application/json');
require_once "../config/config.php"; 

    if (isset($_GET['username'])) {
        $username = htmlspecialchars($_GET['username']); // Prevent XSS attacks
    } else {
        echo json_encode(["error" => "No username provided!"]);
        exit;
    }

    if (isset($_GET['vtype'])) {
        $vtype = htmlspecialchars($_GET['vtype']); // Prevent XSS attacks
    } else{
        echo json_encode(["error" => "Access type unspecified"]);
        exit;
    }

    $user_otp = $_POST['otp-code'];

    if ($vtype == "signup"){
        $stmt = $conn->prepare("SELECT * FROM `temporary_user_signup` WHERE `uname` = ?");
    } else if($vtype == "login"){
        $stmt = $conn->prepare("SELECT * FROM `tbl_user_credentials` WHERE `uname` = ?");
    }
    
    $stmt->bind_param('s', $username);
    $stmt->execute();

    $result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user_info = $result->fetch_assoc();

    $stored_otp = $user_info['otp_code']; // Get stored OTP
    $expiry_time = $user_info['otp_expiry'];



    // Verify OTP
    if ($user_otp == $stored_otp) {
        if (strtotime($expiry_time) > time()) {

            if($vtype == "signup"){

                    $insert_stmt = $conn->prepare("INSERT INTO `tbl_user_credentials` (`uname`, `fname`, `lname`, `email`, `password`, `account_creation_date`) 
                    VALUES (?, ?, ?, ?, ?, NOW())");
                    $insert_stmt->bind_param("sssss", 
                    $user_info['uname'], 
                    $user_info['fname'], 
                    $user_info['lname'], 
                    $user_info['email'], 
                    $user_info['password']
                    );
                    $insert_stmt->execute();
                    $insert_stmt->close();


                    $delete_stmt = $conn->prepare("DELETE FROM `temporary_user_signup` WHERE `uname` = ?");
                    $delete_stmt->bind_param('s', $username);
                    $delete_stmt->execute();
                    $delete_stmt->close();



                    session_start();
                    $_SESSION['username'] = $username;
                    $_SESSION['logged_in'] = true;

                    header("Location: ./../user-page/index.html");
                    exit;

            } else if ($vtype == "login"){
                    $update_stmt = $conn->prepare("UPDATE `tbl_user_credentials` SET `otp_code` = NULL, `otp_expiry` = NULL WHERE `uname` = ?");
                    $update_stmt->bind_param('s', $username);
                    $update_stmt->execute();
                    $update_stmt->close();


                    
                    $_SESSION['username'] = $username;
                    $_SESSION['logged_in'] = true;

                    header("Location: ./../user-page/index.html");
                    exit;
            }
                


                
        } else {
            echo json_encode(["error" => "OTP Expired!"]);
        }
    } else {
        echo json_encode(["error" => "Invalid OTP!"]);
    }
} else {
    echo json_encode(["error" => "User not found"]);
}



$stmt->close();
$conn->close();

?>