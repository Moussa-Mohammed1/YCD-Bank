import { openMenu } from "../utils/menuUtils.js";
import { closeMenu } from "../utils/menuUtils.js";

const currentuser = JSON.parse(localStorage.getItem("currentuser"));

const rib_principal = currentuser.rib;
const rib_epagrne = currentuser.rib_epagrne;
document.getElementById("rib-principal").textContent = rib_principal;
document.getElementById("rib-epargne").textContent = rib_epagrne;

const open_menu = document.getElementById("open-menu");
const close_menu = document.getElementById("close-menu");
const menu = document.getElementById("menu");
const afficher = document.getElementById("Afficher-Solde-button");
const export_pincipal = document.getElementById("export_rib_prnicipal");
const export_epargne = document.getElementById("export_rib_epargne");

function createPDF(title, rib, filename) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(title, 20, 20);

    doc.setFontSize(14);
    doc.text(`Nom complet : ${currentuser.nomcomplet}`, 20, 40);
    doc.text(`${title} : ${rib}`, 20, 55);

    doc.save(filename);
}

open_menu.addEventListener('click', () => {
    openMenu(menu);
});

close_menu.addEventListener('click', () => {
    menu.classList.remove("flex");
    menu.classList.add("hidden");
});

afficher.addEventListener("click", (e) => {
    let solde_principal_EL = document.getElementById("solde-compte-principal");
    let solde_principal = Number(currentuser.solde);

    if (solde_principal_EL.textContent.trim() === "******") {
        solde_principal_EL.textContent = solde_principal;
    }
    else {
        solde_principal_EL.textContent = "******";
    }
})

export_pincipal.addEventListener("click", (e) => {
    createPDF("RIB Compte Principal", currentuser.rib, "RIB_Principal.pdf");
});

export_epargne.addEventListener("click", (e) => {
    createPDF("RIB Compte Épargne", currentuser.rib_epagrne, "RIB_Epargne.pdf");
})