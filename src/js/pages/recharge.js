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


const favoris_dots_menu =  document.getElementById("recharge-favoris-menu-dots");
const favoris_menu = document.getElementById("recharge-favoris-menu");


// document.addEventListener('click',(e)=>{
//     if (!favoris_menu.classList.contains('hidden') && !favoris_menu.contains(e.target) && e.target !== favoris_dots_menu) {
//         favoris_menu.classList.add('hidden');
//     }
// })