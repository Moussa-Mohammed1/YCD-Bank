// manipulate the menu appearance

const open_menu = document.getElementById("open-menu");
const close_menu = document.getElementById("close-menu");
const menu = document.getElementById("menu");

import { openMenu } from "../utils/menuUtils.js";
import { closeMenu } from "../utils/menuUtils.js";

open_menu.addEventListener('click', ()=>{
    openMenu(menu);
});
close_menu.addEventListener('click', ()=>{
    closeMenu(menu);
});
document.addEventListener('click', (e) => {
    if (window.innerWidth < 768) {
        if (!menu.contains(e.target) && !open_menu.contains(e.target)) {
            menu.classList.add('hidden');
        }
    }
});

// user interaction controle phase

let favoris = [];

const operator = document.getElementsByName("recharge-operateur");
const montant = document.getElementsByName("recharge-montant");
const numero = document.getElementsByName("recharge-numero");

const add_favoris = document.getElementById("ajouter-favoris-btn");
