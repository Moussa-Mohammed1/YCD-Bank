const form = document.getElementById("form-connexion");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email_connexion = document.getElementById("email-connexion").value;
    const password_connexion = document.getElementById("password-connexion").value;
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const currentuser = users.find((user) => {
        return user.email === email_connexion;
    })

    if (!currentuser) {
        window.alert("invalid email, try again !");
        document.getElementById("email-connexion").style.borderColor = "red";
        return;
    }
    else {
        document.getElementById("email-connexion").style.borderColor = "green";
    }

    if (currentuser.password !== password_connexion) {
        window.alert("invalid password, try again !");
        document.getElementById("password-connexion").style.borderColor = "red";
        return;
    }

    localStorage.setItem("currentuser", JSON.stringify(currentuser));
    window.alert(`welcome ${currentuser.nomcomplet} your wallet waiting you :)`);
    form.reset();
    window.location.href = "src/pages/mes-comptes.html";
})