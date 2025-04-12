<?php
session_start();

// Destroy the session to log the user out
session_unset(); // Unsets all session variables
session_destroy(); // Destroys the session

// Redirect to the user authentication page

header("Location: ./../../user_authentication/");
exit;
?>