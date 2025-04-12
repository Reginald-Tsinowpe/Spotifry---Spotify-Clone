document.getElementById("password-input").addEventListener("input", function(){
    //  CHECKING 1 LETTER
    if (/[a-zA-Z]/.test(this.value)){
        document.getElementById("guideline-over-1-letter").classList.add("correct-form");
    }else{
        document.getElementById("guideline-over-1-letter").classList.remove("correct-form");
    }
    //CHECKING 1 NUMBER OT SPECIAL CHARACTER
    if (/\d|\W/.test(this.value)){
        document.getElementById("guideline-special-character").classList.add("correct-form");
    }else{
        document.getElementById("guideline-special-character").classList.remove("correct-form");
    }
    //  CHECKING 10 CHRACTERS
    if (this.value.length >= 10){
        document.getElementById("guideline-over-10-characters").classList.add("correct-form");
    }else{
        document.getElementById("guideline-over-10-characters").classList.remove("correct-form");
    }
    
});

document.getElementById("next-button").addEventListener('click', function (){
    const password = document.getElementById("password-input").value;


    if ( !(/[a-zA-Z]/.test(password)) || !(/\d|\W/.test(password)) || !(password.length >= 10) || !(password.length <= 50)){
        alert("Password not acceptable!");
        return;
    }else{ 
        const user_email = sessionStorage.getItem("user_email");
        const data_json = JSON.stringify({ email: user_email, password: password, action: "add-user-password" });

        fetch("./php-scripts/handle_user_signup.php",
            {
                method: "POST",
                headers:  {"Content-Type": "application/json"},
                body: data_json
            }
        ).then(response => response.json()).then(data => {
            if (data.success){
                window.location.href = "./collect-personal-information.html";
            }else if(data.error){
                alert(data.error);
            }
        }).catch(error => console.log("AJAX Error: ", error));

    }
});