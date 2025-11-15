const open_menu = document.getElementById("open-menu");
const close_menu = document.getElementById("close-menu");
const menu = document.getElementById("menu");

let user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    alert("Aucun utilisateur connecté");
    window.location.href = "../../index.html";
}

const form = document.getElementById("paiements-form");
const solde = document.getElementById("paiements-solde-principale");
solde.textContent = user.solde + " ";

import { openMenu } from "../utils/menuUtils.js";
import { closeMenu } from "../utils/menuUtils.js";

open_menu.addEventListener('click', () => {
    openMenu(menu);
});

close_menu.addEventListener('click', () => {
    closeMenu(menu);
});

document.addEventListener('click', (e) => {
    if (window.innerWidth < 768) {
        if (!menu.contains(e.target) && !open_menu.contains(e.target)) {
            menu.classList.add('hidden');
        }
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const type_facture = document.getElementById("paiements-facture-select").value;
    const refernce_facture = document.getElementById("facture-refernce").value;
    const montant_facture = parseFloat(document.getElementById("montant").value);
    const factureregex = /^[0-9]{8,}$/;

    if(!refernce_facture || !montant_facture || !type_facture){
        window.alert("please fill all fileds");
        return;
    }

    if(factureregex.test(refernce_facture) === false){
        window.alert("Réf. Facture invalide : Le numéro doit contenir au moins 8 chiffres");
        return;
    }

    if (montant_facture > user.solde) {
        window.alert("No enough cash!");
        return;
    }
    
    if(montant_facture <= 0){
        window.alert("Please enter a positive number");
        return;
    }

    if(!window.confirm(`Are you sure you want to pay this invoice for ${montant_facture} MAD? This action cannot be undone`)){
        return;
    }

    user.solde -= montant_facture;
    solde.textContent = user.solde + " ";

    const transaction = {
        id: Date.now(),
        type: 'Paiement',
        sousType: type_facture,
        destinataire: refernce_facture,
        montant: montant_facture,
        date: new Date().toISOString(),
        statut: 'Réussie'
    };

    if (!user.transactions) {
        user.transactions = [];
    }
    user.transactions.unshift(transaction);

    localStorage.setItem("user", JSON.stringify(user));

    window.alert("Payment successful! Your invoice has been paid and your balance has been updated");
    form.reset();
});