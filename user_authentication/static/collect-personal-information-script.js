document.getElementById("birth-year").addEventListener('input', function(){
    // VALIDATES BIRTH YEAR
    if(this.value < 1900){
        document.getElementById("dob-year-error").textContent = "Please enter a birth year from 1900 onwards.";
    }else{
        document.getElementById("dob-year-error").textContent = "";
    }
});
document.getElementById("birth-day").addEventListener('input', function(){
    // VALIDATES BIRTH DAY
    if (this.value > 31   ||   this.value < 1){
        document.getElementById("dob-day-error").textContent = "Please enter the day of your birth date by entering a number between 1 and 31."
    }
    else{
        document.getElementById("dob-day-error").textContent = "";
    }
});
document.getElementById("birth-month").addEventListener('input', function(){
    // VALIDATES BIRTH MONTH
    if (this.value == "Month"){
        document.getElementById("dob-month-error").textContent = "Please select an appropriate month.";
    } else{
        document.getElementById("dob-month-error").textContent = "";
    }
});



document.getElementById("information-collection-form").addEventListener('submit', async function(event){
    event.preventDefault();
    //  FINAL VALIDATIONS
    //      IF BIRTH YEAR > current year
    const current_year = new Date().getFullYear();
    const user_birth_year = document.getElementById("birth-year").value;
    if ( user_birth_year > current_year){
        document.querySelectorAll(".current-age").forEach(one => {one.textContent = user_birth_year-current_year;});
        const answer = await Ask_Age_Verification();

        if (answer === "Edit") {
            return; 
        }

    }
    //      BIRTH MONTH NOT SELECTED
    if (document.getElementById("birth-month").value == "Month"){
        alert("Please select a real birth month.");
        return;
    }

    //  GENDER VALIDATION
    if (!document.querySelector("input[name='gender']:checked")?.value) {
        alert("Please select a gender.");
        return;
    }

    const form_data = JSON.stringify({
            user_name: document.getElementById("name-input").value,        
            gender : document.querySelector("input[name='gender']:checked")?.value,
            birth_day : document.getElementById("birth-day").value,
            birth_month : document.getElementById("birth-month").value,
            birth_year : document.getElementById("birth-year").value,
            email: sessionStorage.getItem("user_email"),

            action: "add-user-personal-information"
    }
    );
 

    fetch("./php-scripts/handle_user_signup.php",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: form_data
        }
    ).then(response => response.json()).then(data => {
            if (data.success){
                window.location.href = "./terms-and-conditions.html"
            } else if (data.error){
                alert(data.error);
            }
        }).catch(error => console.log("AJAX Error: ", error));

    
});


function Ask_Age_Verification() {
    return new Promise((resolve) => {  // Create a promise to wait for user action
        document.getElementById("custom-alert").style.display = "flex";

        document.getElementById("confirm-btn").onclick = function() {
            Close_Age_Verification();
            resolve("Continue");  // Resolve promise with "Continue"
        };

        document.getElementById("edit-btn").onclick = function() {
            Close_Age_Verification();
            resolve("Edit");  // Resolve promise with "Edit"
        };
    });
}
function Close_Age_Verification() {
    document.getElementById("custom-alert").style.display = "none";
}