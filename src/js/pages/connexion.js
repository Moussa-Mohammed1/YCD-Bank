const form = document.getElementById("form-connexion");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const email_connexion = document.getElementById("email-connexion").value;
    const password_connexion = document.getElementById("password-connexion").value;
    
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.alert("Aucun compte trouvé. Veuillez vous inscrire d'abord !");
        return;
    }

    if (user.email !== email_connexion) {
        window.alert("invalid email, try again !");
        document.getElementById("email-connexion").style.borderColor = "red";
        return;
    }
    else {
        document.getElementById("email-connexion").style.borderColor = "green";
    }

    if (user.password !== password_connexion) {
        window.alert("invalid password, try again !");
        document.getElementById("password-connexion").style.borderColor = "red";
        return;
    }

    window.alert(`welcome ${user.nomcomplet} your wallet is waiting you :)`);
    form.reset();
    window.location.href = "src/pages/mes-comptes.html";
})