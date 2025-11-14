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

const totalEntreeElement = document.getElementById("historique-total-entree");
const totalDepensesElement = document.getElementById("historique-total-depenses");
const filterSelect = document.getElementById('filter-select');
const transactionsContainer = document.getElementById('transactions-container');

let currentUser = null;
let allTransactions = [];
let filteredTransactions = [];

function loadUserData() {
    const userData = localStorage.getItem('user');
    if (userData) {
        currentUser = JSON.parse(userData);
    } else {
        currentUser = {
            nomcomplet: "Utilisateur Test",
            password: "",
            solde: 100000,
            rib: "",
            benefeciaire: [],
            rib_epargne: "",
            historique: [],
            recharges: {
                favoris: [],
                historique: []
            },
            transactions: []
        };
        localStorage.setItem('user', JSON.stringify(currentUser));
    }
}

function collectAllTransactions() {
    allTransactions = [];
    
    if (currentUser.historique && Array.isArray(currentUser.historique)) {
        allTransactions = [...allTransactions, ...currentUser.historique];
    }
    
    if (currentUser.transactions && Array.isArray(currentUser.transactions)) {
        allTransactions = [...allTransactions, ...currentUser.transactions];
    }
    
    if (currentUser.recharges && currentUser.recharges.historique && Array.isArray(currentUser.recharges.historique)) {
        allTransactions = [...allTransactions, ...currentUser.recharges.historique];
    }
    
    const uniqueTransactions = [];
    const seenIds = new Set();
    
    allTransactions.forEach(transaction => {
        const id = transaction.id || `${transaction.type}_${transaction.date}_${transaction.montant}`;
        if (!seenIds.has(id)) {
            seenIds.add(id);
            uniqueTransactions.push(transaction);
        }
    });
    
    allTransactions = uniqueTransactions.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });
    
    filteredTransactions = [...allTransactions];
}

function calculateTotals() {
    let totalEntrees = 0;
    let totalDepenses = 0;
    
    allTransactions.forEach(transaction => {
        const montant = parseFloat(transaction.montant) || 0;
        
        if (transaction.type === 'Virement' && transaction.statut === 'Reçu') {
            totalEntrees += montant;
        } else if (transaction.type === 'Virement' || transaction.type === 'Recharge' || transaction.type === 'Paiement') {
            totalDepenses += montant;
        }
    });
    
    totalEntreeElement.innerHTML = `${totalEntrees.toFixed(2)} <span>DH</span>`;
    totalDepensesElement.innerHTML = `${totalDepenses.toFixed(2)} <span>DH</span>`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
        return 'Date invalide';
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function getTransactionIcon(type) {
    switch(type) {
        case 'Virement':
            return '<i class="fa-solid fa-exchange-alt text-blue-600"></i>';
        case 'Recharge':
            return '<i class="fa-solid fa-mobile-alt text-green-600"></i>';
        case 'Paiement':
            return '<i class="fa-solid fa-file-invoice-dollar text-orange-600"></i>';
        default:
            return '<i class="fa-solid fa-circle text-gray-600"></i>';
    }
}

function getTransactionColor(type) {
    switch(type) {
        case 'Virement':
            return 'border-l-4 border-blue-500';
        case 'Recharge':
            return 'border-l-4 border-green-500';
        case 'Paiement':
            return 'border-l-4 border-orange-500';
        default:
            return 'border-l-4 border-gray-500';
    }
}

function displayTransactions() {
    const headers = transactionsContainer.previousElementSibling;
    transactionsContainer.innerHTML = '';
    
    if (filteredTransactions.length === 0) {
        transactionsContainer.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fa-solid fa-inbox text-4xl mb-2"></i>
                <p>Aucune transaction trouvée</p>
            </div>
        `;
        return;
    }
    
    filteredTransactions.forEach(transaction => {
        const transactionDiv = document.createElement('div');
        transactionDiv.className = `flex flex-col md:flex-row bg-white mt-4 p-4 rounded-lg shadow hover:shadow-lg transition ${getTransactionColor(transaction.type)}`;
        
        const typeDisplay = transaction.sousType 
            ? `${transaction.type} - ${transaction.sousType}` 
            : transaction.type;
        
        const destinataireInfo = transaction.destinataire 
            ? `<p class="text-sm text-gray-600">Destinataire: ${transaction.destinataire}</p>` 
            : '';
        
        const operateurInfo = transaction.operateur 
            ? `<p class="text-sm text-gray-600">Opérateur: ${transaction.operateur}</p>` 
            : '';
        
        const statutBadge = transaction.statut 
            ? `<span class="text-xs px-2 py-1 rounded ${
                transaction.statut === 'Réussie' ? 'bg-green-100 text-green-800' : 
                transaction.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
            }">${transaction.statut}</span>` 
            : '';
        
        transactionDiv.innerHTML = `
            <div class="flex items-center gap-3 flex-1">
                ${getTransactionIcon(transaction.type)}
                <div>
                    <h1 class="font-semibold text-base">${typeDisplay}</h1>
                    ${destinataireInfo}
                    ${operateurInfo}
                    ${statutBadge}
                </div>
            </div>
            <div class="flex items-center justify-between md:justify-end gap-8 mt-2 md:mt-0">
                <p class="text-sm text-gray-600">${formatDate(transaction.date)}</p>
                <p class="font-bold text-lg ${transaction.type === 'Virement' && transaction.statut === 'Reçu' ? 'text-green-600' : 'text-red-600'}">
                    ${transaction.type === 'Virement' && transaction.statut === 'Reçu' ? '+' : '-'}${transaction.montant} <span class="text-sm">DH</span>
                </p>
            </div>
        `;
        
        transactionsContainer.appendChild(transactionDiv);
    });
}

function filterTransactions(filterType) {
    if (!filterType || filterType === 'Type d\'operation') {
        filteredTransactions = [...allTransactions];
    } else {
        filteredTransactions = allTransactions.filter(transaction => {
            if (filterType === 'Virements') {
                return transaction.type === 'Virement';
            } else if (filterType === 'Facture') {
                return transaction.type === 'Paiement';
            } else if (filterType === 'Recharge') {
                return transaction.type === 'Recharge';
            }
            return true;
        });
    }
    
    displayTransactions();
}

filterSelect.addEventListener('change', (e) => {
    filterTransactions(e.target.value);
});

function init() {
    
    loadUserData();
    
    collectAllTransactions();
    
    calculateTotals();
    displayTransactions();
    
}

document.addEventListener('DOMContentLoaded', init);

