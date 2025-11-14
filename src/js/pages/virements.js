let currentUser;




function loadCurrentUser() {
    const raw = localStorage.getItem("currentUser");
    if (raw) {
        currentUser = JSON.parse(raw);
    } else {
        currentUser = {
            nomcomplet: "Utilisateur Test",

            solde: 100000,

            benefeciaire: [],
            historique: []
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
}
loadCurrentUser();


const soldeSpan = document.getElementById("solde");
const inputBenef = document.getElementById("input-beneficiaire");
const inputMontant = document.querySelector("input[placeholder='0000000']");
const inputMotif = document.querySelector("input[placeholder='Motif du virement']");
const btnVirement = document.querySelector("button.bg-[#26254F]");


function updateSolde() {
    soldeSpan.innerText = currentUser.solde;
}
updateSolde();

// Suggestions dynamiques
const suggestions = document.createElement("div");
suggestions.className = "absolute bg-white border w-full rounded shadow z-50";
suggestions.style.display = "none";
inputBenef.parentElement.style.position = "relative";
inputBenef.parentElement.appendChild(suggestions);

inputBenef.addEventListener("input", () => {
    const text = inputBenef.value.trim().toLowerCase();
    suggestions.innerHTML = "";

    if (text === "") {
        suggestions.style.display = "none";
        return;
    }

    const results = currentUser.benefeciaire.filter(b =>
        b.nom.toLowerCase().includes(text) || b.prenom.toLowerCase().includes(text)
    );

    results.forEach(b => {
        const div = document.createElement("div");
        div.className = "px-3 py-2 hover:bg-gray-200 cursor-pointer";
        div.innerText = `${b.nom} ${b.prenom}`;
        div.addEventListener("click", () => {
            inputBenef.value = `${b.nom} ${b.prenom}`;
            suggestions.style.display = "none";
        });
        suggestions.appendChild(div);
    });

    suggestions.style.display = results.length ? "block" : "none";
});

btnVirement.addEventListener("click", () => {
    const text = inputBenef.value.trim().toLowerCase();
    const montant = parseFloat(inputMontant.value);
    const motif = inputMotif.value.trim();

    if (!text || isNaN(montant) || montant <= 0) {
        alert("Veuillez remplir correctement tous les champs !");
        return;
    }

    if (montant > currentUser.solde) {
        alert("Solde insuffisant !");
        return;
    }

    
    const benef = currentUser.benefeciaire.find(b =>
        (`${b.nom} ${b.prenom}`).toLowerCase().includes(text)
    );

    if (!benef) {
        alert("Bénéficiaire introuvable !");
        return;
    }

    
    currentUser.solde -= montant;

    
    currentUser.historique.push({
        date: new Date().toLocaleString(),
        type: "virement",
        montant,
        motif,
        beneficiaire: `${benef.nom} ${benef.prenom}`
    });

    
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    
    updateSolde();

    alert("Virement effectué avec succès !");

    
    inputBenef.value = "";
    inputMontant.value = "";
    inputMotif.value = "";
});
