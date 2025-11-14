const open_menu = document.getElementById("open-menu");
const close_menu = document.getElementById("close-menu");
const menu = document.getElementById("menu");
const montantInput = document.getElementById("conversion-montant");
const montantConverti = document.getElementById("conversion-montant-converti");
const tauxActuel = document.querySelector('span.gold');

import { openMenu } from "../utils/menuUtils.js";
import { closeMenu } from "../utils/menuUtils.js";

let currentUser = JSON.parse(localStorage.getItem("user"));

if (!currentUser) {
    alert("Aucun utilisateur connecté");
    window.location.href = "../../index.html";
}

let tauxEURtoMAD = 10.90;
console.log("hello");
async function getTauxConversion() {
    try {
        console.log("am here");
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
        const data = await response.json();
        
        if (data.rates && data.rates.MAD) {
            tauxEURtoMAD = data.rates.MAD;
            tauxActuel.textContent = `1 EUR = ${tauxEURtoMAD.toFixed(2)} DH`;
        }
    } catch (error) {
        console.error("Erreur API:", error);
        tauxActuel.textContent = `1 EUR = ${tauxEURtoMAD.toFixed(2)} DH`;
    }
}

function convertirDevise() {
    const montant = parseFloat(montantInput.value);
    
    if (!montant || isNaN(montant) || montant <= 0) {
        montantConverti.textContent = "0.00";
        return;
    }
    
    const resultat = (montant * tauxEURtoMAD).toFixed(2);
    montantConverti.textContent = resultat;
}

function init() {
    getTauxConversion();
    
    montantInput.addEventListener("input", convertirDevise);
    
    open_menu.addEventListener('click', () => {
        openMenu(menu);
    });
    
    close_menu.addEventListener('click', () => {
        closeMenu(menu);
    });
}

init();