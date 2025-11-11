const open_menu = document.getElementById("open-menu");
const close_menu = document.getElementById("close-menu");
const menu = document.getElementById("menu");

import { openMenu } from "../utils/menuUtils.js";
import { closeMenu } from "../utils/menuUtils.js";

open_menu.addEventListener('click', ()=>{
    openMenu(menu);
});
close_menu.addEventListener('click', ()=>{
    menu.classList.remove("flex");
    menu.classList.add("hidden");
});



// contenu beneficiare

