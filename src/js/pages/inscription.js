const form = document.getElementById("form-inscription");
const input = document.getElementById("password-incription");
const input_confirm = document.getElementById("confirm-password-incription");

function genrerib() {
    let result = "";
    let startfix = "605002";
    let endfix = "66";

    for (let i = 0; i < 16; i++) {
        result += Math.floor(Math.random() * 10);
    }

    return startfix + result + endfix;
}

input.addEventListener("input", (e) => {
    if (input.value.trim() !== "") {
        input_confirm.removeAttribute("disabled");
    }
    else {
        input_confirm.setAttribute("disabled", "");
    }
})

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const fullname = document.getElementById("fullname-incription").value;
    const email = document.getElementById("email-incription").value;
    const password = document.getElementById("password-incription").value;
    const confirm_password = document.getElementById("confirm-password-incription").value;

    if (!fullname || !email || !password || !confirm_password) {
        window.alert("please fill all fileds");
        return;
    }

    const emailre = /^[^\s@]{5,}@[^\s@]{5,}\.[^\s@]{2,}$/;
    const passwordre = /^(?=.{8,}$)(?=.*[A-Z])(?=.*[a-z]).+$/
    const namere = /^[A-Za-z ]{6,}$/

    if (namere.test(fullname) === false) {
        window.alert("invalid name please try again!");
        document.getElementById("fullname-incription").style.borderColor = "red";
        return;
    }
    else {
        document.getElementById("fullname-incription").style.borderColor = "green";
    }

    if (emailre.test(email) === false) {
        window.alert("invalid email please try again!");
        document.getElementById("email-incription").style.borderColor = "red";
        return;
    }
    else {
        document.getElementById("email-incription").style.borderColor = "green";
    }

    if (passwordre.test(password) === false) {
        window.alert("Please use a strong password that contains at least 8 characters, including:\n- 1 uppercase letter (A–Z)\n- 1 number (0–9)\n- 1 special symbol (!@#$%^&*)\n\nExample: Ycd@banque");
        document.getElementById("password-incription").style.borderColor = "red";
        document.getElementById("confirm-password-incription").style.borderColor = "red";
        return;
    }

    else {
        document.getElementById("confirm-password-incription").style.borderColor = "green";
    }

    if (password != confirm_password) {
        window.alert("the password is not identical, please try again!");
        document.getElementById("password-incription").style.borderColor = "red";
        document.getElementById("confirm-password-incription").style.borderColor = "red";
        return;
    }

    else {
        document.getElementById("password-incription").style.borderColor = "green";
        document.getElementById("confirm-password-incription").style.borderColor = "green";
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    for(let i = 0; i < users.length; i++){
        if(users[i].email === email){
            window.alert("This email is already in use. use a different email");
            document.getElementById("email-incription").style.borderColor = "red";
            return;
        }
    }

    const currentUser = {
        nomcomplet: fullname,
        email: email,
        password: password,
        solde: 10000,
        rib: genrerib(),
        rib_epagrne: genrerib(),
        recharges: {
            favoris: [],
            historique: []
        },
        transactions: []
    };

    users.push(currentUser);

    localStorage.setItem("users", JSON.stringify(users));

    window.alert("Your account has been successfully created :)");
    form.reset();
    window.location.href = "../../index.html";
})