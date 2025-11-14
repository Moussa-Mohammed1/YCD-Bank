const open_menu = document.getElementById("open-menu");
const close_menu = document.getElementById("close-menu");
const menu = document.getElementById("menu");

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

const compteEpargneBalance = document.getElementById('compte-epargne-balance');
const compteEpargneRib = document.getElementById('compte-epargne-rib');
const showButton = document.getElementById('compte-epargne-show');
const showHideButton = document.getElementById('compte-epargne-show-hide');
const exportButton = document.getElementById('compte-epargne-exporter');
const montantInput = document.querySelector('input[name="compte-epargne-virements-montant"]');

let currentUser = JSON.parse(localStorage.getItem("user")) || null;
let balanceVisible = true;

if (!currentUser) {
    window.location.href = "../../index.html";
}

function saveUserData() {
    localStorage.setItem('user', JSON.stringify(currentUser));
}

function loadUserData() {
    const userData = localStorage.getItem('user');
    if (userData) {
        currentUser = JSON.parse(userData);
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function displayBalance() {
    if (balanceVisible) {
        compteEpargneBalance.innerHTML = `${currentUser.compteEpargne.toFixed(2)}<span> MAD</span>`;
    } else {
        compteEpargneBalance.textContent = '****';
    }
}

function displayRib() {
    compteEpargneRib.textContent = currentUser.ribEpargne;
}

showButton.addEventListener('click', () => {
    balanceVisible = false;
    displayBalance();
    showButton.classList.add('hidden');
    showHideButton.classList.remove('hidden');
});

showHideButton.addEventListener('click', () => {
    balanceVisible = true;
    displayBalance();
    showHideButton.classList.add('hidden');
    showButton.classList.remove('hidden');
});

exportButton.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('YCD Bank - RIB Compte Epargne', 20, 20);
    doc.setFontSize(12);
    doc.text(`Nom: ${currentUser.no}`, 20, 40);
    doc.text(`RIB: ${currentUser.ribEpargne}`, 20, 50);
    doc.text(`Solde: ${currentUser.compteEpargne.toFixed(2)} MAD`, 20, 60);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 70);
    
    doc.save('rib-compte-epargne.pdf');
    
    showNotification('RIB exporté en PDF', 'success');
});

montantInput.addEventListener('input', (e) => {
    const montant = parseFloat(e.target.value);
    
    if (e.target.value && montant > 0 && montant <= currentUser.solde) {
        e.target.classList.remove('border-red-500');
        e.target.classList.add('border-green-500');
    } else {
        e.target.classList.remove('border-green-500');
        e.target.classList.add('border-red-500');
    }
});

montantInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        effectuerVirementInterne();
    }
});

function effectuerVirementInterne() {
    const montant = parseFloat(montantInput.value);
    
    if (!montant || montant <= 0) {
        showNotification('Veuillez entrer un montant valide', 'error');
        return;
    }
    
    if (montant > currentUser.solde) {
        showNotification('Solde insuffisant', 'error');
        return;
    }
    
    currentUser.solde -= montant;
    currentUser.compteEpargne += montant;
    
    const transaction = {
        id: Date.now(),
        type: 'Virement Interne',
        montant: montant,
        date: new Date().toISOString(),
        statut: 'Réussie',
        description: 'Virement vers compte épargne'
    };
    
    currentUser.transactions.unshift(transaction);
    
    saveUserData();
    loadUserData();
    
    displayBalance();
    montantInput.value = '';
    montantInput.classList.remove('border-green-500', 'border-red-500');
    
    showNotification(`Virement de ${montant.toFixed(2)} MAD effectué avec succès`, 'success');
}

function init() {
    loadUserData();
    displayBalance();
    displayRib();
}

document.addEventListener('DOMContentLoaded', init);