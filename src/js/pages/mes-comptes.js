import { openMenu } from "../utils/menuUtils.js";
import { closeMenu } from "../utils/menuUtils.js";

const open_menu = document.getElementById("open-menu");
const close_menu = document.getElementById("close-menu");
const menu = document.getElementById("menu");
const afficher = document.getElementById("Afficher-Solde-button");
const export_pincipal = document.getElementById("export_rib_prnicipal");
const export_epargne = document.getElementById("export_rib_epargne");
const afficherMasquer = document.getElementById("afficher-solde-text");
const transactionsBody = document.getElementById("transactions-body");

let currentUser = JSON.parse(localStorage.getItem("user"));

if (!currentUser) {
    alert("Aucun utilisateur connecté. Redirection vers la page de connexion.");
    window.location.href = "../../index.html";
}

function loadUserData() {
    const rib_principal = currentUser.rib;
    const rib_epargne = currentUser.rib_epargne;
    
    document.getElementById("rib-principal").textContent = rib_principal || "Non disponible";
    document.getElementById("rib-epargne").textContent = rib_epargne || "Non disponible";
}

function createPDF(title, rib, filename) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(15, 38, 71);
    doc.text(title, 20, 30);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Nom complet : ${currentUser.nomcomplet}`, 20, 50);
    doc.text(`Email : ${currentUser.email || 'Non renseigné'}`, 20, 60);
    
    doc.setFontSize(14);
    doc.setTextColor(213, 151, 44);
    doc.text(`${title}`, 20, 80);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(rib, 20, 90);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, 110);

    doc.save(filename);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Date invalide';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function displayLastTransactions() {
    transactionsBody.innerHTML = '';
    
    let allTransactions = [];
    
    if (currentUser.transactions && Array.isArray(currentUser.transactions)) {
        allTransactions = [...currentUser.transactions];
    }
    
    if (currentUser.recharges && currentUser.recharges.historique && Array.isArray(currentUser.recharges.historique)) {
        allTransactions = [...allTransactions, ...currentUser.recharges.historique];
    }
    
    if (currentUser.historique && Array.isArray(currentUser.historique)) {
        allTransactions = [...allTransactions, ...currentUser.historique];
    }
    
    allTransactions.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    const lastFiveTransactions = allTransactions.slice(0, 5);
    
    if (lastFiveTransactions.length === 0) {
        transactionsBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-8 text-gray-500">
                    <i class="fa-solid fa-inbox text-3xl mb-2 block"></i>
                    <p>Aucune transaction disponible</p>
                </td>
            </tr>
        `;
        return;
    }
    
    lastFiveTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-100 hover:bg-gray-50 transition';
        
        const typeDisplay = transaction.sousType 
            ? `${transaction.type} - ${transaction.sousType}` 
            : transaction.type;
        
        const statutClass = transaction.statut === 'Réussie' 
            ? 'bg-green-100 text-green-800' 
            : transaction.statut === 'En attente' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800';
        
        const montantColor = transaction.type === 'Virement' && transaction.statut === 'Reçu' 
            ? 'text-green-600' 
            : 'text-red-600';
        
        const montantSign = transaction.type === 'Virement' && transaction.statut === 'Reçu' 
            ? '+' 
            : '-';
        
        row.innerHTML = `
            <td class="py-3 px-2 sm:px-4 text-[#0F2647] text-sm sm:text-base">${typeDisplay}</td>
            <td class="py-3 px-2 sm:px-4 text-[#0F2647] text-sm sm:text-base">${formatDate(transaction.date)}</td>
            <td class="py-3 px-2 sm:px-4 font-bold text-sm sm:text-base ${montantColor}">
                ${montantSign}${transaction.montant} MAD
            </td>
            <td class="py-3 px-2 sm:px-4">
                <span class="text-xs px-2 py-1 rounded-full ${statutClass}">${transaction.statut || 'N/A'}</span>
            </td>
        `;
        
        transactionsBody.appendChild(row);
    });
}

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

afficher.addEventListener("click", () => {
    let solde_principal_EL = document.getElementById("solde-compte-principal");
    let solde_principal = Number(currentUser.solde);

    if (solde_principal_EL.textContent.trim() === "******") {
        solde_principal_EL.textContent = solde_principal;
        afficherMasquer.textContent = "Masquer solde";
    }
    else {
        solde_principal_EL.textContent = "******";
        afficherMasquer.textContent = "Afficher solde";
    }
});

export_pincipal.addEventListener("click", () => {
    createPDF("RIB Compte Principal", currentUser.rib, "RIB_Principal.pdf");
});

export_epargne.addEventListener("click", () => {
    createPDF("RIB Compte Épargne", currentUser.rib_epargne, "RIB_Epargne.pdf");
});

function init() {
    
    loadUserData();
    displayLastTransactions();
}
document.addEventListener('DOMContentLoaded', init);