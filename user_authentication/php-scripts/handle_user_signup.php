<?php
session_start();
require_once  __DIR__ . '/../../config/config.php'; // Ensure correct path to config
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
    case "add-user-email":
        if (isset($data['email'])) {
            
            Add_User_Email_To_Unverified_User_DB($data['email']);

        } else {
            echo json_encode(["error" => "Email is required"]);
            exit;
        }
        break;

    case "add-user-password":
        if (isset($data['email'], $data['password'])) {
            //  ADD PASSWORD TO DB
            Add_Password_To_Unverified_User($data['email'], $data['password']);

        } else {
            echo json_encode(["error" => "Email does not exist in database"]);
            exit;
        }
        break;

    case "add-user-personal-information":
        if (isset($data['email'], $data['user_name'], $data['gender'], $data['birth_day'], $data['birth_month'], $data['birth_year'])) {
            Add_Personal_Information($data['email'], $data['user_name'], $data['gender'], $data['birth_day'], $data['birth_month'], $data['birth_year']);

        } else {
            echo json_encode(["error" => "Could not add your information"]);
            exit;
        }
        break;

    case "make-user-permanent":
        if (isset($data['email'], $data['log_in_user'])){
            
            Migrate_User_Data($data['email'], $data['log_in_user']);
        } else{
            echo json_encode(["error" => "Could not sign you up"]);
            exit;
        }
        break;

    default:
        echo json_encode(["error" => "Invalid action"]);
        exit;
}

// Function to handle user signup
function Add_User_Email_To_Unverified_User_DB($email) {
    
    // TODO: Insert into an unverified user database table
    global $conn;
    echo json_encode(["error" => "script is working"]);
exit;
    //  CHECK IF EMAIL EXISTS IN UNVERIFIED USER TABLE - DUPLICATE LOGIN
    $check_temp_user_stmt = $conn->prepare("SELECT * FROM `tbl_unverified_user` WHERE `email`=?");
    $check_temp_user_stmt->bind_param('s', $email);
    $check_temp_user_stmt->execute();
    $concurrent_user = $check_temp_user_stmt->get_result();

    if ($concurrent_user->num_rows > 0) {
        //IF IT DOES, REPLACE THE ROW WITH THE NEW SIGNUP
        $delete_temp_stmt = $conn->prepare("DELETE FROM `tbl_unverified_user` WHERE `email` = ?");
        $delete_temp_stmt->bind_param('s', $email);
        $delete_temp_stmt->execute();
        $delete_temp_stmt->close();
    }
    $check_temp_user_stmt->close();

    // CHECK IF EMAIL EXISTS IN VERIFIED, PERMANENT USER TABLE
    $check_perm_user_stmt = $conn->prepare("SELECT * FROM `tbl_user_data` WHERE `email`=?");
    $check_perm_user_stmt->bind_param('s', $email);
    $check_perm_user_stmt->execute();
    $concurrent_user = $check_perm_user_stmt->get_result();

    if ($concurrent_user->num_rows > 0) {
        //IF IT DOES, REPLACE THE ROW WITH THE NEW SIGNUP
        echo json_encode(["error" => "A user already exists with this email. Login?"]);
        return;
    }
    $check_perm_user_stmt->close();

    $insert_email_stmt = $conn->prepare("INSERT INTO `tbl_unverified_user` (`email`) VALUES (?)");
    $insert_email_stmt->bind_param('s', $email);
    
    if ($insert_email_stmt->execute()){
        
        $insert_email_stmt->close();
        echo json_encode(["success" => "Email Account Added. Email: " . $email]);
        
        return;
    }else{
        echo json_encode(["error" => "Failed to add the email account"]);
        $insert_email_stmt->close();
        return;
    }
    
    
    
}

// Function to verify an email
function Add_Password_To_Unverified_User($email, $password) {
    // TODO: Validate verification code and update database
    global $conn;

    $add_password_stmt = $conn->prepare("UPDATE `tbl_unverified_user` SET `password` = ? WHERE `email` = ?");
    $add_password_stmt->bind_param('ss', $password, $email);
    if($add_password_stmt->execute()){
        echo json_encode(["success" => "Password Successfully Added"]);
        return;
    }else{
        echo json_encode(["error" => "There was an error adding the password"]);
        return;
    }
    
    $add_password_stmt->close();

    
}

// FUNCTION TO ADD USER PERSONAL INFORMATION TO DATEBASE
function Add_Personal_Information($email, $user_name, $gender, $birth_day, $birth_month, $birth_year) {

    //VALIDATE GENDER INPUT
    $Gender_array = ["man", "woman", "non-binary", "prefer-not-to-say"];

    if (!in_array($gender, $Gender_array)){
        echo json_encode(["error" => "Unacceptable Gender"]);
        return;
    }

    $full_birth_date = convertBirthDate($birth_day, $birth_month, $birth_year);

    if(!$full_birth_date){
        echo json_encode(["error" => "There was an error converting the date"]);
        return;
    }



    global $conn;

    $add_user_information_stmt = $conn->prepare("UPDATE `tbl_unverified_user` SET `username`=?, `gender`=?, `date_of_birth`=? WHERE `email`=?");
    $add_user_information_stmt->bind_param('ssss', $user_name, $gender, $full_birth_date, $email);
    if ($add_user_information_stmt->execute()){
        echo json_encode(["success" => "Personal Information added"]);
        return;
    }else{
        echo json_encode(["error" => "There was an error adding the your information to the database."]);
        return;
    }
    
}

//  FUNCTION TO REWRITE BIRTHDATE IN PROPER DATE FORMAT
function convertBirthDate($birth_day, $birth_month, $birth_year) {
    // Array to convert month name to number
    $months = [
        "January" => 1, "February" => 2, "March" => 3, "April" => 4, "May" => 5, "June" => 6,
        "July" => 7, "August" => 8, "September" => 9, "October" => 10, "November" => 11, "December" => 12
    ];

    // Validate inputs
    if (!isset($birth_day, $birth_month, $birth_year) || !is_numeric($birth_day) || !is_numeric($birth_year)) {
        echo json_encode(["error" => "Invalid input data"]);
        return false;
    }

    // Convert month name to number
    if (!array_key_exists($birth_month, $months)) {
        echo json_encode(["error" => "Invalid month name"]);
        return false;
    }
    $birth_month_number = $months[$birth_month];

   
    // Validate date format
    if (!checkdate($birth_month_number, $birth_day, $birth_year)) {
        echo json_encode(["error" => "Invalid date format"]);
        return false;
    }

    return sprintf("%04d-%02d-%02d", $birth_year, $birth_month_number, $birth_day);

}


//  FUNCTION TO MOVE USER DATA INTO THE VERIFIED USER TABLE
function Migrate_User_Data($email, $signup_and_login) {

    global $conn;
    

    if ($signup_and_login) {
        // Fetch user data from unverified table
        $temporary_user_information = $conn->prepare("SELECT * FROM `tbl_unverified_user` WHERE `email`=?");
        $temporary_user_information->bind_param('s', $email);

        if (!$temporary_user_information->execute()) {
            echo json_encode(["error" => "There was a problem fetching your data"]);
            return;
        }

        $result = $temporary_user_information->get_result();
        $user_data = $result->fetch_assoc();
        $temporary_user_information->close();

        // Check if user data exists
        if (!$user_data) {
            echo json_encode(["error" => "User not found in unverified table"]);
            return;
        }

        // Handle NULL values properly by converting them to NULL in MySQL
        $user_email = $user_data['email'];
        $user_password = $user_data['password'];
        $user_name = $user_data['username'] ?? null;
        $user_phone = $user_data['phone'] ?? null;
        $user_gender = $user_data['gender'] ?? null;
        $user_dob = $user_data['date_of_birth'] ?? null;

        // Insert into verified user table (handling NULL values)
        $insert_as_permanent_user = $conn->prepare(
            "INSERT INTO `tbl_user_data` (`email`, `password`, `user_name`, `phone`, `gender`, `date_of_birth`)
             VALUES (?, ?, ?, ?, ?, ?)"
        );
        

        // Bind parameters, allowing NULL values
        $insert_as_permanent_user->bind_param(
            "ssssss",
            $user_email,
            $user_password,
            $user_name,
            $user_phone,
            $user_gender,
            $user_dob
        );
     
       

        // Execute and handle errors
        if  ($insert_as_permanent_user->execute()) {
            //DELETE USER
            $delete_temp = $conn->prepare("DELETE FROM `tbl_unverified_user` WHERE `email` = ?");
            $delete_temp->bind_param('s', $user_email);
            $delete_temp->execute();
            $delete_temp->close();
            


            //START SESSION
            $_SESSION['username'] = $user_name;

            echo json_encode(["success" => $user_name]);
            return;
        } else {
            echo json_encode(["error" => "User Signup Failed: " . $conn->error]);
            return;
        }
    }
}




?>