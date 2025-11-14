import { openMenu } from "../utils/menuUtils.js";
import { closeMenu } from "../utils/menuUtils.js";

const open_menu = document.getElementById("open-menu");
const close_menu = document.getElementById("close-menu");
const menu = document.getElementById("menu");

open_menu?.addEventListener('click', () => openMenu(menu));
close_menu?.addEventListener('click', () => closeMenu(menu));

let currentUser;

function loadCurrentUser() {
    const raw = localStorage.getItem("currentUser");
    if (raw) {
        currentUser = JSON.parse(raw);
    } else {
        currentUser = {
            nomcomplet: "Utilisateur Test",
            solde: 100000,
            beneficiaire: [],
            historique: []
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
}
loadCurrentUser();

const soldeSpan = document.getElementById("solde");
const inputBenef = document.getElementById("input-beneficiaire");
const inputMontant = document.getElementById("input-montant");
const inputMotif = document.getElementById("input-motif");
const btnVirement = document.getElementById("btn-virement");

function updateSolde() {
    if (soldeSpan) {
        soldeSpan.innerText = currentUser.solde.toFixed(2);
    }
}
updateSolde();

// Suggestions dynamiques
const suggestions = document.createElement("div");
suggestions.className = "absolute bg-white border w-full rounded shadow z-50 max-h-48 overflow-y-auto top-full mt-1";
suggestions.style.display = "none";

const parentDiv = inputBenef.parentElement.parentElement;
parentDiv.style.position = "relative";
parentDiv.appendChild(suggestions);

inputBenef.addEventListener("input", () => {
    const text = inputBenef.value.trim().toLowerCase();
    suggestions.innerHTML = "";

    if (text === "") {
        suggestions.style.display = "none";
        return;
    }

    // Filtrer les bénéficiaires actifs uniquement
    const results = currentUser.beneficiaire.filter(b =>
        !b.blocked && (b.nom.toLowerCase().includes(text) || b.prenom.toLowerCase().includes(text))
    );

    if (results.length === 0) {
        const div = document.createElement("div");
        div.className = "px-3 py-2 text-gray-500";
        div.innerText = "Aucun bénéficiaire trouvé";
        suggestions.appendChild(div);
        suggestions.style.display = "block";
        return;
    }

    results.forEach(b => {
        const div = document.createElement("div");
        div.className = "px-3 py-2 hover:bg-gray-200 cursor-pointer";
        div.innerText = `${b.nom} ${b.prenom} - ${b.rib}`;
        div.addEventListener("click", () => {
            inputBenef.value = `${b.nom} ${b.prenom}`;
            suggestions.style.display = "none";
        });
        suggestions.appendChild(div);
    });

    suggestions.style.display = "block";
});

// Fermer les suggestions si on clique ailleurs
document.addEventListener("click", (e) => {
    if (!parentDiv.contains(e.target)) {
        suggestions.style.display = "none";
    }
});

btnVirement.addEventListener("click", () => {
    const text = inputBenef.value.trim();
    const montant = parseFloat(inputMontant.value);
    const motif = inputMotif.value.trim();

    // Validation des champs
    if (!text) {
        alert("Veuillez sélectionner un bénéficiaire !");
        return;
    }

    if (!montant || isNaN(montant) || montant <= 0) {
        alert("Veuillez saisir un montant valide !");
        return;
    }

    if (!motif) {
        alert("Veuillez saisir un motif !");
        return;
    }

    if (montant > currentUser.solde) {
        alert("Solde insuffisant !");
        return;
    }

    // Rechercher le bénéficiaire (insensible à la casse)
    const benef = currentUser.beneficiaire.find(b =>
        `${b.nom} ${b.prenom}`.toLowerCase() === text.toLowerCase()
    );

    if (!benef) {
        alert("Bénéficiaire introuvable !");
        return;
    }

    // Vérifier si le bénéficiaire est bloqué
    if (benef.blocked) {
        alert("Ce bénéficiaire est bloqué !");
        return;
    }

    // Effectuer le virement
    currentUser.solde -= montant;

    // Ajouter à l'historique
    currentUser.historique.push({
        date: new Date().toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        type: "Virement",
        montant: montant,
        motif: motif,
        beneficiaire: `${benef.nom} ${benef.prenom}`,
        rib: benef.rib
    });

    // Sauvegarder dans localStorage
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    
    // Mettre à jour l'affichage du solde
    updateSolde();

    alert(`Virement effectué avec succès !\n\nMontant : ${montant} MAD\nBénéficiaire : ${benef.nom} ${benef.prenom}\nNouveau solde : ${currentUser.solde.toFixed(2)} MAD`);

    // Réinitialiser le formulaire
    inputBenef.value = "";
    inputMontant.value = "";
    inputMotif.value = "";
});

console.log("Script virements.js chargé");
console.log("Utilisateur actuel:", currentUser);