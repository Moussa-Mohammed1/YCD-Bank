// ==== Virement JS ====
let currentUser = null;

// Charger l'utilisateur depuis le localStorage
function loadCurrentUser() {
    const raw = localStorage.getItem("currentUser");
    if (raw) {
        currentUser = JSON.parse(raw);
    } else {
        currentUser = {
            nomcomplet: "Utilisateur Test",
            password: "",
            solde: 100000,
            rib: "",
            benefeciaire: [],
            rib_epagrne: "",
            historique: [],
            recharges: { favoris: [], historique: [] },
            transactions: []
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
}
loadCurrentUser();

// ==== Sélection des éléments ====
const soldeSpan = document.getElementById("solde");
const inputBenef = document.getElementById("input-beneficiaire");
const inputMontant = document.querySelector("input[placeholder='0000000']");
const inputMotif = document.querySelector("input[placeholder='Motif du virement']");
const btnVirement = document.querySelector("button.bg-[#26254F]");

// Affichage du solde
function updateSolde() {
    soldeSpan.innerText = currentUser.solde.toLocaleString();
}
updateSolde();

// Recherche dynamique des bénéficiaires
inputBenef.addEventListener("input", () => {
    const text = inputBenef.value.trim().toLowerCase();
    const results = currentUser.benefeciaire.filter(b =>
        b.nom.toLowerCase().startsWith(text) || b.prenom.toLowerCase().startsWith(text)
    );

    // Affiche le premier résultat comme suggestion
    if (results.length > 0) {
        inputBenef.value = `${results[0].nom} ${results[0].prenom}`;
    }
});

// Effectuer le virement
btnVirement.addEventListener("click", () => {
    const beneficiereNom = inputBenef.value.trim();
    const montant = parseFloat(inputMontant.value.replace(/\s+/g, ""));
    const motif = inputMotif.value.trim();

    if (!beneficiereNom || isNaN(montant) || montant <= 0) {
        alert("Veuillez remplir correctement tous les champs !");
        return;
    }

    if (montant > currentUser.solde) {
        alert("Solde insuffisant !");
        return;
    }

    // Trouver le bénéficiaire correspondant
    const benef = currentUser.benefeciaire.find(b =>
        `${b.nom} ${b.prenom}`.toLowerCase() === beneficiereNom.toLowerCase()
    );
    if (!benef) {
        alert("Bénéficiaire introuvable !");
        return;
    }

    // Déduire le montant du solde
    currentUser.solde -= montant;

    // Ajouter à l'historique
    currentUser.historique.push({
        date: new Date().toLocaleString(),
        type: "virement",
        montant: montant,
        motif: motif,
        beneficiaire: `${benef.nom} ${benef.prenom}`
    });

    // Sauvegarder dans le localStorage
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Mise à jour affichage
    updateSolde();
    alert("Virement effectué avec succès !");

    // Réinitialiser les champs
    inputBenef.value = "";
    inputMontant.value = "";
    inputMotif.value = "";
});
