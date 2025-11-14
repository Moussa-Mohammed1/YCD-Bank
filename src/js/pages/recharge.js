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

const operator = document.getElementById("recharge-operateur");
const montant = document.getElementById("recharge-montant");
const numero = document.getElementById("recharge-numero");
const nomInput = document.querySelector('input[name="nom"]');
const add_favoris = document.getElementById("ajouter-favoris-btn");
const recharger = document.getElementById("recharger-btn");
const favoris_forum = document.getElementById("favoris-forum");
const errorMessage = document.getElementById("error-message");
const offre = document.getElementById("recharge-offre");
const favorisContainer = document.getElementById("recharge-favoris");

let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("user")) || null;
let isEditMode = false;
let editingIndex = -1;

if (!currentUser) {
    currentUser = {
        nom: "Utilisateur Test",
        email: "test@ycdbank.ma",
        solde: 5000,
        recharges: {
            favoris: [],
            historique: []
        },
        transactions: []
    };
}

if (!currentUser.recharges) {
    currentUser.recharges = {
        favoris: [],
        historique: []
    };
}

if (!currentUser.recharges.favoris) {
    currentUser.recharges.favoris = [];
}

if (!currentUser.recharges.historique) {
    currentUser.recharges.historique = [];
}

saveUserData();

const OPERATORS = {
    iam: 'Maroc Telecom',
    inwi: 'Inwi',
    orange: 'Orange'
};

const phoneRegex = /^(05|06|07)[0-9]{8}$/;

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    numero.classList.add("border-red-500");
}

function clearError() {
    errorMessage.textContent = "";
    errorMessage.style.display = 'none';
    numero.classList.remove("border-red-500");
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg showNotification text-white z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function validatePhone(num) {
    let result = phoneRegex.test(num.trim());
    if (!result) {
        showError("Numéro invalide! Format: 05/06/07 + 8 chiffres");
        return false;
    } else {
        clearError();
        return true;
    }
}

function checkDuplicate(num) {
    if (!currentUser.recharges.favoris) {
        return false;
    }
    
    return currentUser.recharges.favoris.some(
        (favori, index) => favori.numero === num && index !== editingIndex
    );
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

function addOrUpdateFavoris() {
    const operatorValue = operator.value;
    const montantValue = parseInt(montant.value);
    const numeroValue = numero.value.trim();
    const nomValue = nomInput.value.trim();
    const offreValue = offre.value;
    
    if (!numeroValue) {
        showError("Veuillez saisir un numéro");
        return;
    }
    
    if (!validatePhone(numeroValue)) {
        return;
    }
    
    if (!isEditMode && checkDuplicate(numeroValue)) {
        showError("Ce numéro existe déjà dans vos favoris");
        return;
    }
    
    const favori = {
        numero: numeroValue,
        nom: nomValue || "Sans nom",
        operator: operatorValue,
        operatorNom: OPERATORS[operatorValue],
        montant: montantValue,
        offre: offreValue,
        dateAjout: new Date().toISOString()
    };
    
    if (isEditMode) {
        currentUser.recharges.favoris[editingIndex] = favori;
        showNotification('Favori modifié avec succès', 'success');
        resetEditMode();
    } else {
        currentUser.recharges.favoris.push(favori);
        showNotification('Favori ajouté avec succès', 'success');
    }
    
    saveUserData();
    displayFavoris();
    clearInputs();
}

function displayFavoris() {
    favorisContainer.innerHTML = '<h1 class="pt-2 font-bold">Numeros Favoris</h1>';
    
    if (!currentUser.recharges.favoris || currentUser.recharges.favoris.length === 0) {
        favorisContainer.innerHTML += '<p class="text-gray-500 text-center py-4">Aucun favori enregistré</p>';
        return;
    }
    
    currentUser.recharges.favoris.forEach((favori, index) => {
        const favoriDiv = document.createElement('div');
        favoriDiv.className = 'flex flex-row my-2 justify-around bg-secondary p-3 rounded-lg relative items-center';
        
        favoriDiv.innerHTML = `
            <p class="font-semibold text-sm md:text-base">${favori.numero}</p>
            <p class="text-gray-800 text-sm md:text-base">${favori.nom || 'Sans nom'}</p>
            <p class="text-gray-600 text-sm md:text-base">${favori.operatorNom}</p>
            <p class="text-blue-600 font-bold text-sm md:text-base">${favori.montant} MAD</p>
            <p class="text-xs md:text-sm text-gray-500">${favori.offre === 'recharge-internet' ? 'Internet' : 'Telecom'}</p>
            <button class="recharge-favoris-menu-dots hover:bg-gray-400 rounded-full px-2 py-1">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
            <div class="recharge-favoris-menu hidden absolute right-0 top-12 bg-white shadow-lg flex flex-col rounded-lg py-1 z-10">
                <button class="recharge-favoris-modifier hover:bg-neutral-200 px-4 py-2 text-left">
                    <i class="fa-solid fa-pen-to-square pr-2"></i>Modifier
                </button>
                <button class="recharge-favoris-supprimer hover:bg-neutral-200 px-4 py-2 text-left">
                    <i class="fa-solid fa-trash pr-2"></i>Supprimer
                </button>
            </div>
        `;
        
        favorisContainer.appendChild(favoriDiv);
        
        const menuDotsBtn = favoriDiv.querySelector('.recharge-favoris-menu-dots');
        const menu = favoriDiv.querySelector('.recharge-favoris-menu');
        const modifierBtn = favoriDiv.querySelector('.recharge-favoris-modifier');
        const supprimerBtn = favoriDiv.querySelector('.recharge-favoris-supprimer');
        
        menuDotsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            document.querySelectorAll('.recharge-favoris-menu').forEach(m => {
                if (m !== menu) {
                    m.classList.add('hidden');
                }
            });
            
            menu.classList.toggle('hidden');
        });
        
        modifierBtn.addEventListener('click', () => {
            editFavori(index);
            menu.classList.add('hidden');
        });
        
        supprimerBtn.addEventListener('click', () => {
            deleteFavori(index);
            menu.classList.add('hidden');
        });
    });
    
    document.addEventListener('click', () => {
        document.querySelectorAll('.recharge-favoris-menu').forEach(m => {
            m.classList.add('hidden');
        });
    });
}

function editFavori(index) {
    const favori = currentUser.recharges.favoris[index];
    
    operator.value = favori.operator;
    montant.value = favori.montant;
    offre.value = favori.offre;
    numero.value = favori.numero;
    
    isEditMode = true;
    editingIndex = index;
    
    add_favoris.innerHTML = '<i class="fa-solid fa-check pr-2"></i>Mettre à jour';
    add_favoris.classList.add('bg-blue-600');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteFavori(index) {
    const confirmation = confirm('Voulez-vous vraiment supprimer ce favori ?');
    
    if (confirmation) {
        currentUser.recharges.favoris.splice(index, 1);
        saveUserData();
        displayFavoris();
        showNotification('Favori supprimé', 'success');
    }
}

function resetEditMode() {
    isEditMode = false;
    editingIndex = -1;
    add_favoris.textContent = 'Ajouter aux Favoris';
    add_favoris.classList.remove('bg-blue-600');
}

function clearInputs() {
    numero.value = '';
    nomInput.value = '';
    operator.selectedIndex = 0;
    montant.selectedIndex = 0;
    offre.selectedIndex = 0;
    clearError();
}

function effectuerRecharge() {
    const operatorValue = operator.value;
    const montantValue = parseInt(montant.value);
    const offreValue = offre.value;
    const numeroValue = numero.value.trim();
    
    clearError();
    
    if (!numeroValue) {
        showError('Veuillez saisir un numéro');
        return;
    }
    
    if (!validatePhone(numeroValue)) {
        return;
    }
    
    if (currentUser.solde < montantValue) {
        showNotification('Solde insuffisant pour effectuer cette recharge', 'error');
        return;
    }
    
    currentUser.solde -= montantValue;
    
    const transaction = {
        id: Date.now(),
        type: 'Recharge',
        sousType: offreValue === 'recharge-internet' ? 'Internet' : 'Telecom',
        operateur: OPERATORS[operatorValue],
        destinataire: numeroValue,
        montant: montantValue,
        date: new Date().toISOString(),
        statut: 'Réussie'
    };
    
    if (!currentUser.recharges.historique) {
        currentUser.recharges.historique = [];
    }
    currentUser.recharges.historique.unshift(transaction);
    
    if (!currentUser.transactions) {
        currentUser.transactions = [];
    }
    currentUser.transactions.unshift(transaction);
    
    saveUserData();
    
    showNotification(
        `Recharge de ${montantValue} MAD effectuée avec succès vers ${numeroValue}`,
        'success'
    );
    
    clearInputs();
    
}

add_favoris.addEventListener('click', addOrUpdateFavoris);

recharger.addEventListener('click', effectuerRecharge);

numero.addEventListener('input', clearError);

numero.addEventListener('blur', () => {
    if (numero.value && !validatePhone(numero.value)) {
        showError('Format invalide: 05/06/07 + 8 chiffres');
    }
});

function init() {
    
    loadUserData();
    
    if (!currentUser) {
        currentUser = {
            nom: "Utilisateur Test",
            solde: 5000,
            recharges: {
                favoris: [],
                historique: []
            },
            transactions: []
        };
    }
    
    if (!currentUser.recharges) {
        currentUser.recharges = {
            favoris: [],
            historique: []
        };
    }
    
    if (!currentUser.recharges.favoris) {
        currentUser.recharges.favoris = [];
    }
    
    if (!currentUser.recharges.historique) {
        currentUser.recharges.historique = [];
    }
    
    saveUserData();
    displayFavoris();
}

document.addEventListener('DOMContentLoaded', init);

