export function openMenu(menu) {
  menu.classList.add("show-menu", "flex");
  menu.classList.remove("hidden");
}


export function closeMenu(menu) {
  menu.classList.remove("flex");
  menu.classList.add("hidden");
}
