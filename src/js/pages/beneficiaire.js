const open_menu = document.getElementById("open-menu");
const close_menu = document.getElementById("close-menu");
const menu = document.getElementById("menu");

import { openMenu } from "../utils/menuUtils.js";
import { closeMenu } from "../utils/menuUtils.js";

let listBeneficiaires = [];
let currentUser;

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
            beneficiaire: [],  // ✅ CORRIGÉ
            rib_epargne: "",  // ✅ CORRIGÉ aussi (epargne pas epagrne)
            historique: [],
            recharges: { favoris: [], historique: [] },
            transactions: []
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
    listBeneficiaires = currentUser.beneficiaire || [];  // ✅ CORRIGÉ
}

loadCurrentUser();

open_menu?.addEventListener('click', () => openMenu(menu));
close_menu?.addEventListener('click', () => closeMenu(menu));

// modal
const btnAdd = document.getElementById("btn-add-beneficiaire");
const modal = document.getElementById("modal-beneficiaire");
const btnClose = document.getElementById("close-modal");

btnAdd?.addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
});

btnClose?.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
});

const beneficiairecontainer = document.getElementById("benefeciaire");

function creercarte(beneficiaire) {
    const card = document.createElement("div");

    card.innerHTML = `
        <div id="card-${beneficiaire.id}" class="bg-white shadow-xl/30 rounded-lg p-4 flex justify-between items-center mb-4 relative">
            <button id="menu-btn-${beneficiaire.id}" class="absolute top-2 right-2 text-gray-500">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
            <div id="menu-${beneficiaire.id}" class="menu-options absolute top-8 right-2 bg-white shadow-lg rounded-lg border hidden">
                <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 btn-bloquer">Bloquer/Débloquer</button>
                <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 btn-supprimer">Supprimer</button>
            </div>
            <div>
                <p class="font-medium text-gray-800">${beneficiaire.nom} ${beneficiaire.prenom}</p>
                <p class="text-sm text-gray-600">
                    <span class="font-semibold">RIB</span> ${beneficiaire.rib}
                </p>
            </div>
            <div class="flex items-center gap-2">
                <span id="status-${beneficiaire.id}" class="${beneficiaire.blocked ? 'bg-red-500' : 'bg-green-500'} text-white text-xs px-3 py-1 rounded-full">
                    ${beneficiaire.blocked ? 'Bloqué' : 'Actif'}
                </span>
                <button class="bg-yellow-600 text-white p-2 rounded-lg">
                    <i class="fa-solid fa-right-left"></i>
                </button>
            </div>
         </div>
    `;

    const btn = card.querySelector(`#menu-btn-${beneficiaire.id}`);
    const menu = card.querySelector(`#menu-${beneficiaire.id}`);

    btn.addEventListener("click", () => menu.classList.toggle("hidden"));

    card.querySelector(".btn-bloquer").addEventListener("click", () => bloquerDebloquer(beneficiaire.id));
    card.querySelector(".btn-supprimer").addEventListener("click", () => supprimerCarte(beneficiaire.id));

    beneficiairecontainer.appendChild(card);
}

function bloquerDebloquer(id) {
    const ben = listBeneficiaires.find(b => b.id === id);
    if (!ben) return;
    ben.blocked = !ben.blocked;

    const status = document.getElementById(`status-${id}`);
    status.innerHTML = ben.blocked ? "Bloqué" : "Actif";
    status.classList.toggle("bg-green-500");
    status.classList.toggle("bg-red-500");

    currentUser.beneficiaire = listBeneficiaires;  // ✅ CORRIGÉ
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    if (selectTri.value === "par ordre alphabétique (A-Z)") triAlphabetique();
    else if (selectTri.value === "Bénéficiaires actifs") triActifs();
    else if (selectTri.value === "Bénéficiaires bloqués") triBloques();
}

function supprimerCarte(id) {
    if (!confirm("Voulez-vous vraiment supprimer ce bénéficiaire ?")) return;
    listBeneficiaires = listBeneficiaires.filter(b => b.id !== id);
    currentUser.beneficiaire = listBeneficiaires;  // ✅ CORRIGÉ
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    renderAllCards(listBeneficiaires);
}

const formBenef = document.getElementById("form-beneficiare");
const inputNom = document.getElementById("input-nom");
const inputPrenom = document.getElementById("input-prenom");
const inputRib = document.getElementById("input-rib");

formBenef?.addEventListener("submit", e => {
    e.preventDefault();
    AddBenef();
});

function AddBenef() {
    const nom = inputNom.value.trim();
    const prenom = inputPrenom.value.trim();
    const rib = inputRib.value.trim();

    if (!nom || !prenom || !rib) { 
        alert("Nom, Prénom et RIB sont obligatoires !"); 
        return; 
    }

    const nouveau = { 
        id: Date.now().toString(), 
        nom, 
        prenom, 
        rib, 
        blocked: false 
    };

    listBeneficiaires.push(nouveau);
    currentUser.beneficiaire = listBeneficiaires;  // ✅ CORRIGÉ
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    renderAllCards(listBeneficiaires);

    modal.classList.add("hidden");
    modal.classList.remove("flex");
    formBenef.reset();
}

// Tri
function triAlphabetique() { 
    renderAllCards([...listBeneficiaires].sort((a, b) => a.nom.localeCompare(b.nom))); 
}
function triActifs() { 
    renderAllCards(listBeneficiaires.filter(b => !b.blocked)); 
}
function triBloques() { 
    renderAllCards(listBeneficiaires.filter(b => b.blocked)); 
}

const selectTri = document.querySelector("select[name='trierpar']");
selectTri?.addEventListener("change", () => {
    const v = selectTri.value;
    if (v === "par ordre alphabétique (A-Z)") triAlphabetique();
    else if (v === "Bénéficiaires actifs") triActifs();
    else if (v === "Bénéficiaires bloqués") triBloques();
    else renderAllCards(listBeneficiaires);
});

// Recherche
const inputSearch = document.getElementById("search-benef");
inputSearch?.addEventListener("input", () => {
    const text = inputSearch.value.trim().toLowerCase();
    renderAllCards(listBeneficiaires.filter(b => 
        b.nom.toLowerCase().startsWith(text) || 
        b.prenom.toLowerCase().startsWith(text)
    ));
});

// Affichage
function renderAllCards(list) {
    beneficiairecontainer.innerHTML = "";
    list.forEach(b => creercarte(b));
}

renderAllCards(listBeneficiaires);

console.log("Script beneficiaire.js chargé");
console.log("Bénéficiaires chargés:", listBeneficiaires);