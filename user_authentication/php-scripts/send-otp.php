<?php

// Load PHPMailer classes
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once "./../../config/email-credentials.php"; 



function sendOTPEmail($recipient_email, $otp_code) {
    $mail = new PHPMailer(true); // Enable exceptions

    try {

        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Change if using a different provider
        $mail->SMTPAuth = true;
        $mail->Username = SEND_OTP_EMAIL; 
        $mail->Password = SEND_OTP_PASSWORD; 
        //$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;       
        //$mail->Port = 587;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;



        $mail->setFrom(SEND_OTP_EMAIL, 'SPOTIFRY LOGIN');
        $mail->addAddress($recipient_email);
        $mail->Subject = 'Your OTP Verification Code';


        $mail->Body = "Your OTP verification code is: <b>$otp_code</b>. It expires in 30 minutes.";

        $mail->isHTML(true); // Send as HTML email

        // Send the email
        if ($mail->send()) {
            //echo "success: "."OTP sent successfully to $recipient_email";

            // TO DO: CREATE HTML FILE FOR OTP LOGIN, THEN LINK THAT FILE TO OTP-VERIFY
            return ["success" => "OTP sent successfully"];
        } else {
            return ["error" => "Failed to send OTP"];
        }
    } catch (Exception $e) {
        //echo "erorr: "."Mailer Error: " . $mail->ErrorInfo;
        return ["erorr" => "Mailer Error: " . $mail->ErrorInfo];
    }
}


?>