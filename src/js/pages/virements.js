import { openMenu } from "../utils/menuUtils.js";
import { closeMenu } from "../utils/menuUtils.js";

const open_menu = document.getElementById("open-menu");
const close_menu = document.getElementById("close-menu");
const menu = document.getElementById("menu");

open_menu?.addEventListener('click', () => openMenu(menu));
close_menu?.addEventListener('click', () => closeMenu(menu));

let currentUser;

function loadCurrentUser() {
    const raw = localStorage.getItem("user");
    if (raw) {
        currentUser = JSON.parse(raw);
    } else {
        alert("Aucun utilisateur connecté");
        window.location.href = "../../index.html";
        return;
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

    const results = currentUser.benefeciaire.filter(b =>
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

document.addEventListener("click", (e) => {
    if (!parentDiv.contains(e.target)) {
        suggestions.style.display = "none";
    }
});

btnVirement.addEventListener("click", () => {
    const text = inputBenef.value.trim();
    const montant = parseFloat(inputMontant.value);
    const motif = inputMotif.value.trim();

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

    const benef = currentUser.benefeciaire.find(b =>
        `${b.nom} ${b.prenom}`.toLowerCase() === text.toLowerCase()
    );

    if (!benef) {
        alert("Bénéficiaire introuvable !");
        return;
    }

    if (benef.blocked) {
        alert("Ce bénéficiaire est bloqué !");
        return;
    }

    currentUser.solde -= montant;

    const transaction = {
        id: Date.now(),
        type: "Virement",
        destinataire: `${benef.nom} ${benef.prenom}`,
        rib: benef.rib,
        montant: montant,
        motif: motif,
        date: new Date().toISOString(),
        statut: "Réussie"
    };

    currentUser.historique.unshift(transaction);
    currentUser.transactions.unshift(transaction);

    localStorage.setItem("user", JSON.stringify(currentUser));
    
    updateSolde();

    alert(`Virement effectué avec succès !\n\nMontant : ${montant} MAD\nBénéficiaire : ${benef.nom} ${benef.prenom}\nNouveau solde : ${currentUser.solde.toFixed(2)} MAD`);

    inputBenef.value = "";
    inputMontant.value = "";
    inputMotif.value = "";
});