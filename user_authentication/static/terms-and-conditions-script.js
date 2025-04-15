document.getElementById("finalize-signup-button").addEventListener("click", function (){
    toggleLoading();

    let form_data = JSON.stringify({
        email: sessionStorage.getItem("user_email"),
        log_in_user: "yes",
        action: "make-user-permanent"
    });

 
    fetch("./php-scripts/handle_user_signup.php",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: form_data
        }
    ).then(response => response.json()).then(data => {
        if (data.success) {
            sessionStorage.clear();
            sessionStorage.setItem("user_name", data.success);

            
            window.location.href = "./../listen/";
        }else if (data.error){
            alert(data.error);
            console.log(data.error);
            toggleLoading();
        }

    }).catch(error => {console.log("AJAX Error: ", error);
        toggleLoading();}
    );
    
});

let isLoading = false;
function toggleLoading() {
    let btn = document.getElementById("finalize-signup-button");

    if (isLoading) {
        // Stop animation
        btn.innerHTML = "Sign Up";
        btn.disabled = false;
        isLoading = false;
    } else {
        // Start animation
        btn.disabled = true;
        btn.innerHTML = '<div class="dots"><span></span><span></span><span></span></div>';
        isLoading = true;
    }
}