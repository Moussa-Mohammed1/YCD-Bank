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

// contenu beneficiare
const btnAdd = document.getElementById("btn-add-beneficiaire");
const modal = document.getElementById("modal-beneficiaire");
const btnClose = document.getElementById("close-modal");

btnAdd.addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
});

btnClose.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
});

const beneficiairecontainer = document.getElementById("benefeciaire");

function creercarte(benefeciaire) {
    const card = document.createElement("div");

    card.innerHTML = `
        <div id="card-${benefeciaire.id}" class="bg-white shadow-xl/30 rounded-lg p-4 flex justify-between items-center mb-4 relative">
            <!-- Bouton des 3 points -->
            <button id="menu-btn-${benefeciaire.id}" class="absolute top-2 right-2 text-gray-500">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>

            <!-- Menu caché de 3 points -->
            <div id="menu-${benefeciaire.id}" class="menu-options absolute top-8 right-2 bg-white shadow-lg rounded-lg border" style="display: none;">
                <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 btn-bloquer">Bloquer/Débloquer</button>
                <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 btn-supprimer">Supprimer</button>
            </div>

            <div>
                <p class="font-medium text-gray-800">${benefeciaire.nom} ${benefeciaire.prenom}</p>
                <p class="text-sm text-gray-600">
                    <span class="font-semibold">RIB</span> ${benefeciaire.rib}
                </p>
            </div>

            <div class="flex items-center gap-2">
                <span id="status-${benefeciaire.id}" class="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                    Actif
                </span>
                <button class="bg-yellow-600 text-white p-2 rounded-lg">
                    <i class="fa-solid fa-right-left"></i>
                </button>
            </div>

        </div>
    `;

    // menu toggle
    const btn = card.querySelector(`#menu-btn-${benefeciaire.id}`);
    const menu = card.querySelector(`#menu-${benefeciaire.id}`);

    btn.addEventListener("click", () => {
        if (menu.style.display === "none") {
            menu.style.display = "block";
        } else {
            menu.style.display = "none";
        }
    });

    // ajouter listeners pour les boutons du menu
    const btnBloquer = card.querySelector(".btn-bloquer");
    const btnSupprimer = card.querySelector(".btn-supprimer");

    btnBloquer.addEventListener("click", () => bloquerDebloquer(benefeciaire.id));
    btnSupprimer.addEventListener("click", () => supprimerCarte(benefeciaire.id));

    beneficiairecontainer.appendChild(card);
}

// Bloquer/Débloquer
function bloquerDebloquer(id) {
    const status = document.getElementById(`status-${id}`);

    if (status.innerHTML === "Actif") {
        status.innerHTML = "Bloqué";
        status.classList.remove("bg-green-500");
        status.classList.add("bg-red-500");
    } else {
        status.innerHTML = "Actif";
        status.classList.remove("bg-red-500");
        status.classList.add("bg-green-500");
    }
}

// Supprimer carte
function supprimerCarte(id) {
    const confirmation = confirm("Voulez-vous vraiment supprimer ce bénéficiaire ?");
    if (confirmation) {
        const card = document.getElementById(`card-${id}`);
        if (card) {
            card.remove();
        }
        alert("Bénéficiaire supprimé avec succès !");
    }
}

// Formulaire
const formBenef = document.getElementById("form-beneficiare");
const inputNom = document.getElementById("input-nom");
const inputPrenom = document.getElementById("input-prenom");
const inputRib = document.getElementById("input-rib");

formBenef.addEventListener("submit", (e) => {
    e.preventDefault();
    AddBenef();
});

function AddBenef() {
    const nom = inputNom.value.trim();
    const prenom = inputPrenom.value.trim();
    const rib = inputRib.value.trim();

    if (!nom || !prenom || !rib) {
        alert("Nom, Prénom et Rib sont obligatoires !");
        return;
    }

    const nouveau = {
        id: Date.now().toString(),
        nom,
        prenom,
        rib,
        blocked: false
    };

    creercarte(nouveau);

    modal.classList.add("hidden");
    modal.classList.remove("flex");
    formBenef.reset();
}
