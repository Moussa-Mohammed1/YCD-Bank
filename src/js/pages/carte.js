import { openMenu } from "../utils/menuUtils.js";
import { closeMenu } from "../utils/menuUtils.js";

const open_menu = document.getElementById("open-menu");
const close_menu = document.getElementById("close-menu");
const menu = document.getElementById("menu");

const activation_toggle = document.getElementById("toggle-activation");
const carte_active = document.getElementById("card-bancaire-active");
const carte_bloque = document.getElementById("card-bancaire-bloque");
const range = document.getElementById("plafond-range");
const current_plafond = document.getElementById("plafond-now");
const modifed_plafond = document.getElementById("plafond-modified");
const form = document.getElementById("form-carte");

let card = JSON.parse(localStorage.getItem("card"));
let card_activation_status;

if(card && card.status === "Blocked"){
    card_activation_status = "Blocked";
    activation_toggle.checked = false;
    carte_active.classList.add("hidden");
    carte_bloque.classList.remove("hidden");
}
else{
    card_activation_status = "Activated";
    activation_toggle.checked = true;
    carte_active.classList.remove("hidden");
    carte_bloque.classList.add("hidden");
}

if(card){
current_plafond.textContent = card.plafond + " DHS";
modifed_plafond.textContent = card.plafond + " DHS";
    range.value = card.plafond;
}


open_menu.addEventListener('click', () => {
    openMenu(menu);
});
close_menu.addEventListener('click', () => {
    menu.classList.remove("flex");
    menu.classList.add("hidden");
});

activation_toggle.addEventListener("click", (e) => {
    carte_active.classList.toggle("hidden");
    carte_bloque.classList.toggle("hidden");

if (activation_toggle.checked) {
    card_activation_status = "Activated";
}

else {
    card_activation_status = "Blocked";
}
});

range.addEventListener("input", () => {
    modifed_plafond.textContent = range.value + " DHS";
})

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to modify your card?") == false) {
        return;
    }
    current_plafond.textContent = range.value + " DHS";
    const card_status = {
        status: card_activation_status,
        plafond: range.value,
    }
    localStorage.setItem("card", JSON.stringify(card_status));
})