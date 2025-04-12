document.getElementById("signup-instead-button").addEventListener('click', function() {
    window.location.href = "./index.html";
});

function Run_On_Start(){

    if (typeof google !== "undefined" && google.accounts) {
        google.accounts.id.initialize({
            client_id: "794513802781-3r093r25686ovju00ihjat1g5sb84bd4.apps.googleusercontent.com",
            callback: handleCredentialResponse
        });

        google.accounts.id.renderButton(
            document.querySelector(".g_id_signin"),
            { theme: "outline", size: "large", text: "continue_with"}
        );
    } else {
        console.warn("Google API not yet loaded. Retrying...");
        setTimeout(Run_On_Start, 500); // Retry after 500ms
    }

}


//  POPULATING THE EMAIL OR USERNAME FIELD
document.getElementById("username-email-login-input").value = sessionStorage.getItem("user_email");


//      ADD EVENT LISTENERS TO CURRENTLY SHOWN BUTTON. CONTINUE/NEXT

document.getElementById("switch_login_method").addEventListener("click", function(){
    this.textContent = "Please wait...";
});
function Switch_To_Password_Login(){
    document.getElementById("identity-verification-password").style.display = "block";
    document.getElementById("identity-verification-otp").style.display = "none";
}
function Switch_To_OTP_Verification(){

    Send_OTP_Code();
}


//      THE BELOW CODE HANDLE USER LOGIN VIA PASSWORD
document.getElementById("submit-password").addEventListener("click", Submitting_Password);
function Submitting_Password(event){

    event.preventDefault();

    let password = document.getElementById("user-password-input").value;
    if (!password) {
        alert("Please enter a password.");
        return;
    }
    
    let form_data = JSON.stringify({ email: sessionStorage.getItem("user_email"), password: password, action: "verify-user-password"});
    

    fetch("./php-scripts/handle_user_login.php",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: form_data
        }
    ).then(response => response.json()).then(data => {
        if (data.success){
            sessionStorage.clear();
            sessionStorage.setItem("user_name", data.success);
            window.location.href = "./../listen/";

        } else if(data.wrong_pass){
            document.getElementById("incorrect-password-prompt").textContent = data.wrong_pass;
        } else {
            alert(data.error)
        }
    }).catch(error => console.log("AJAX Error: ", error));

}



//      THE BELOW FUNCTIONS HANDLE USER LOGIN VIA OTP CODE
function Send_OTP_Code(){
    let username_or_email = document.getElementById("username-email-login-input").value;
    let form_data =  JSON.stringify({email: sessionStorage.getItem("user_email"), action: "send-otp-code"});

    fetch("./php-scripts/handle_user_login.php",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: form_data
        }
    ).then(response => response.json()).then(data => {
        if (data.success){
            document.getElementById("identity-verification-otp").style.display = "block";
            document.getElementById("identity-verification-password").style.display = "none";
        }else if(data.error){
            alert(data.error);
            document.getElementById("switch_login_method").textContent = "Log in without password";
        }
    }).catch(error => console.log("AJAX Error: ", error));
}

document.getElementById("verify-otp-code").addEventListener("click", function(){
    const otp_code = document.getElementById("otp-code-input").value;

    let form_data = JSON.stringify({email: sessionStorage.getItem("user_email"), otp_code: otp_code, action: "verify-otp-code"});

    fetch("./php-scripts/handle_user_login.php",
        {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: form_data
    }
    ).then(response => response.json()).then(data => {
        if(data.success){
            sessionStorage.clear();
            sessionStorage.setItem("user_name", data.success);
            window.location.href = "./../listen/";
        }else if(data.error){
            alert(data.error);
        }else{
            alert("Fatal Error: Unknown Error");
        }
    }).catch(error => console.log("AJAX Error: ", error));

});