const open_menu = document.getElementById("open-menu");
const close_menu = document.getElementById("close-menu");
const menu = document.getElementById("menu");
const balanceElement = document.getElementById("compte-epargne-balance");
const showButton = document.getElementById("compte-epargne-show");
const hideButton = document.getElementById("compte-epargne-show-hide");
const ribElement = document.getElementById("compte-epargne-rib");
const exportButton = document.getElementById("compte-epargne-exporter");
const montantInput = document.querySelector('input[name="compte-epargne-virements-montant"]');
const virementButton = document.getElementById('epargne-virement');

import { openMenu } from "../utils/menuUtils.js";
import { closeMenu } from "../utils/menuUtils.js";

let currentUser = JSON.parse(localStorage.getItem("user"));

if (!currentUser) {
    alert("Aucun utilisateur connecté");
    window.location.href = "../../index.html";
}

if (!currentUser.solde_epargne) {
    currentUser.solde_epargne = 0;
}

function saveUserData() {
    localStorage.setItem("user", JSON.stringify(currentUser));
}

function afficherSolde() {
    balanceElement.innerHTML = `${currentUser.solde_epargne.toFixed(2)} <span>MAD</span>`;
}

function masquerSolde() {
    balanceElement.innerHTML = `****** <span>MAD</span>`;
}

function afficherRIB() {
    ribElement.textContent = currentUser.rib_epargne;
}

function exporterPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("YCD BANK", 20, 20);

    doc.setFontSize(16);
    doc.text("Relevé d'Identité Bancaire - Compte Épargne", 20, 32);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Titulaire : ${currentUser.nomcomplet}`, 20, 60);
    doc.text(`Email : ${currentUser.email}`, 20, 70);

    doc.setFontSize(12);
    doc.text("RIB Compte Épargne :", 20, 90);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(currentUser.rib_epargne, 20, 100);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(12);
    doc.text(`Solde actuel : ${currentUser.solde_epargne.toFixed(2)} MAD`, 20, 120);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date de génération : ${new Date().toLocaleDateString('fr-FR')}`, 20, 280);
    doc.text("YCD Bank - Banque digitale moderne", 20, 287);

    doc.save("RIB_Epargne.pdf");
}

function effectuerVirement() {
    const montant = parseFloat(montantInput.value);

    if (!montant || isNaN(montant) || montant <= 0) {
        alert("Veuillez entrer un montant valide");
        return;
    }

    if (montant > currentUser.solde_epargne) {
        alert("Solde épargne insuffisant");
        return;
    }

    currentUser.solde_epargne -= montant;
    currentUser.solde += montant;

    const transaction = {
        id: Date.now(),
        type: 'Virement',
        sousType: 'Virement Interne',
        origine: 'Compte Épargne',
        destinataire: 'Compte Principal',
        montant: montant,
        date: new Date().toISOString(),
        statut: 'Réussie'
    };

    if (!currentUser.transactions) {
        currentUser.transactions = [];
    }

    currentUser.transactions.unshift(transaction);

    saveUserData();

    alert(`Virement de ${montant.toFixed(2)} MAD effectué avec succès !`);
    montantInput.value = "";
    afficherSolde();
}

function init() {
    afficherSolde();
    afficherRIB();

    showButton.addEventListener("click", () => {
        afficherSolde();
        showButton.classList.add("hidden");
        hideButton.classList.remove("hidden");
    });

    hideButton.addEventListener("click", () => {
        masquerSolde();
        hideButton.classList.add("hidden");
        showButton.classList.remove("hidden");
    });

    exportButton.addEventListener("click", exporterPDF);

    virementButton.addEventListener("click", (e) => {
        e.preventDefault();
        effectuerVirement();
    });

    open_menu.addEventListener('click', () => {
        openMenu(menu);
    });

    close_menu.addEventListener('click', () => {
        closeMenu(menu);
    });
}

init();