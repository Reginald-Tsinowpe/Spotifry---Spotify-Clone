document.getElementById("signup-instead-button").addEventListener('click', function() {
    let is_login = this.getAttribute("data-mode") == "login";



    if (is_login) {
        document.title = "Signup - Spotifry";
        document.getElementById("login-signup-header").textContent = "Signup to start listening";
        document.querySelector(".question").textContent = "Already have an account?";
        this.textContent = "Log in here";
        this.setAttribute("data-mode", "signup");

        document.getElementById("login-signup-options").innerHTML = `
            
            <label style="display: flex; flex-direction: column; gap: 10px;"><span style="color:white; font-weight: bold; font-family: Helvetica;">Email address</span>
                    <input type="email" id="username-email-signup-input" class="username-email-signup-input" placeholder="name@domain.com">
            </label>

            <p style="color: rgb(80, 236, 80);text-decoration:underline; font-size: medium; font-family: Helvetica; align-self: flex-start;"  onclick="alert('This Feature is still in development');">Use phone number instead</p>

            <button id="username-email-signup-button" class="login-signup-button"  data-mode="signup">Next</button>
         

            <div style="display:flex; flex-direction:row; align-self: center; width:100%">
                <hr style="flex-grow: 1"><span style="color:white; margin: 0 5px; font-family: Helvetica">or</span><hr style="flex-grow: 1">
            </div>
            
            

            
            <p style="color:white; font-weight: bold; font-family: Helvetica; background-color: rgb(151, 10, 10); padding: 7px; border-radius: 5px; margin: 0;" onclick="alert('This Feature is still in development');">Google Signup</p>
            <p style="color:white; font-weight: bold; font-family: Helvetica; background-color: rgb(151, 10, 10); padding: 7px; border-radius: 5px; margin: 0;" onclick="alert('This Feature is still in development');">Facebook Signup</p>
            <p style="color:white; font-weight: bold; font-family: Helvetica; background-color: rgb(151, 10, 10); padding: 7px; border-radius: 5px; margin: 0;" onclick="alert('This Feature is still in development');">Apple Signup</p>

            <hr style="width: 100%; align-self: center;">

        `;


        Toggle_Event_Listener("signup");

    } else {
        document.title = "Login - Spotify";
        document.getElementById("login-signup-header").textContent = "Login to Spotify";
        document.querySelector(".question").textContent = "Don't have an account?";
        this.textContent = "Signup for Spotify";
        this.setAttribute("data-mode", "login");

        document.getElementById("login-signup-options").innerHTML = `
            

            <div class="g_id_signin" data-type="standard" data-text="continue_with"></div>

            <p style="color:white; font-weight: bold; font-family: Helvetica; background-color: rgb(151, 10, 10); padding: 7px; border-radius: 5px; margin: 0;"  onclick="alert('This Feature is still in development');">Facebook</p>
            <p style="color:white; font-weight: bold; font-family: Helvetica; background-color: rgb(151, 10, 10); padding: 7px; border-radius: 5px; margin: 0;"  onclick="alert('This Feature is still in development');">Apple</p>
            <p style="color:white; font-weight: bold; font-family: Helvetica; background-color: rgb(151, 10, 10); padding: 7px; border-radius: 5px; margin: 0;"  onclick="alert('This Feature is still in development');">Phone Number</p>

            <hr style="width: 100%; align-self: center;">

            <div id="username-email-login">
                <label style="display: flex; flex-direction: column; gap: 10px;"><span style="color:white; font-weight: bold; font-family: Helvetica;">Email or username</span>
                        <input type="text" id="username-email-login-input" class="username-email-login-input" placeholder="Email or username" required>
                </label>

                <button id="username-email-login-button" class="login-signup-button">Continue</button>


            </div>
        `;

    setTimeout(initializeGoogleButton, 50);
        Toggle_Event_Listener("login");

    }

    // Reinitialize Google Sign-In after changing the HTML
   

});
// Move this to a separate function
function initializeGoogleButton() {
    if (typeof google !== "undefined" && google.accounts?.id) {
        // Only initialize ONCE
        if (!window.googleSignInInitialized) {
            google.accounts.id.initialize({
                client_id: "794513802781-3r093r25686ovju00ihjat1g5sb84bd4.apps.googleusercontent.com",
                callback: handleCredentialResponse
            });
            window.googleSignInInitialized = true;
        }

        // Always re-render the button after swapping HTML
        const buttonContainer = document.querySelector(".g_id_signin");
        if (buttonContainer) {
            // Even if rendered before, this is a new element — re-render it
            google.accounts.id.renderButton(
                buttonContainer,
                {
                    theme: "filled_black",
                    size: "large",
                    text: "continue_with",
                    shape: "pill",
                    width: "300px"
                }
            );
        }

    } else {
        setTimeout(initializeGoogleButton, 100); // Retry if Google API not ready
        
    }
}


function Run_On_Start(){


    document.getElementById("login-signup-options").innerHTML = `
        <div class="g_id_signin" data-type="standard" data-text="continue_with"></div>

        <p style="color:white; font-weight: bold; font-family: Helvetica; background-color: rgb(151, 10, 10); padding: 7px; border-radius: 5px; margin: 0;" onclick="alert('This Feature is still in development');">Facebook</p>
        <p style="color:white; font-weight: bold; font-family: Helvetica; background-color: rgb(151, 10, 10); padding: 7px; border-radius: 5px; margin: 0;" onclick="alert('This Feature is still in development');">Apple</p>
        <p style="color:white; font-weight: bold; font-family: Helvetica; background-color: rgb(151, 10, 10); padding: 7px; border-radius: 5px; margin: 0;" onclick="alert('This Feature is still in development');">Phone Number</p>

        <hr style="width: 100%; align-self: center;">

        <div id="username-email-login">
            <label style="display: flex; flex-direction: column; gap: 10px;"><span style="color:white; font-weight: bold; font-family: Helvetica;">Email or username</span>
                    <input type="text" id="username-email-login-input" class="username-email-login-input" placeholder="Email or username" required>
            </label>

            <button id="username-email-login-button" class="login-signup-button">Continue</button>

        </div>
    `;


    setTimeout(initializeGoogleButton, 100);

    Toggle_Event_Listener("login");
}

function handleCredentialResponse(response) {
    const id_token = response.credential;  // This is the Google token
    let form_data = JSON.stringify({action: "google-login", credential: id_token});

    // Send the token to the backend
    fetch('./php-scripts/handle_user_login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: form_data
    }).then(response => response.json())
        .then(data => {
            if (data.success) {
                // User successfully authenticated
                sessionStorage.clear();
                sessionStorage.setItem("user_name", data.success)
                window.location.href = "./../listen/";
            } else if(data.error){
                alert(data.error);
            } else {
                // Handle error
                alert("User authentication failed. Please login with your email and password.")
                console.log('Authentication failed:', data);
            }
        });
}


//      ADD EVENT LISTENERS TO CURRENTLY SHOWN BUTTON. CONTINUE/NEXT
function Toggle_Event_Listener(type) {
    if (type == 'login') {
        const loginButton = document.getElementById("username-email-login-button");
        const signupButton = document.getElementById("username-email-signup-button");

        if (loginButton) {
            loginButton.addEventListener('click', Login_User_Email);
        }

        if (signupButton) {
            signupButton.removeEventListener('click', Signup_User_Email);
        }
    } else if (type == 'signup') {
        const signupButton = document.getElementById("username-email-signup-button");
        const loginButton = document.getElementById("username-email-login-button");

        if (signupButton) {
            signupButton.addEventListener('click', Signup_User_Email);
        }

        if (loginButton) {
            loginButton.removeEventListener('click', Login_User_Email);
        }
    }
}

//      MOVING DATA INTO USER
function Signup_User_Email(event){
    event.preventDefault();

    let user_email = document.getElementById("username-email-signup-input").value;
    if (!user_email) {
        alert("Please enter an email.");
        return;
    }
    
    const data_json = JSON.stringify({ email: user_email, action: "add-user-email" });
    

    fetch("./php-scripts/handle_user_signup.php",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: data_json
        }
    ).then(response => response.json()).then(data => {
        if (data.success){
            // TO DO
            sessionStorage.setItem("user_email", user_email);
            window.location.href = "./password-or-verify-email.html";

        } else if(data.error) {
            alert(data.error)
        }
    }).catch(error => console.log("AJAX Error: ", error));
  
}



//      THE BELOW FUNCTIONS HANDLE USER LOGIN
function Login_User_Email(){
    let username_or_email = document.getElementById("username-email-login-input").value;
    let form_data = JSON.stringify({username_or_email: username_or_email, action:"check-user-existence"})


    fetch("./php-scripts/handle_user_login.php",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: form_data
        }
    ).then(response => response.json()).then(data => {
        if (data.success){
            
            sessionStorage.setItem("user_email", data.success)
            window.location.href = "./login-identity-verification.html";
        }else if(data.error){
            alert(data.error);
        }
    }).catch(error => console.log("AJAX Error: ", error));
}