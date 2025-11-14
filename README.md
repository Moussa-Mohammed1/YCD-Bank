🏦 YCD Bank — Mini Banking Web Application

A modern, secure and responsive personal banking platform built with HTML, TailwindCSS, and JavaScript.

📌 Overview

YCD Bank is a fully interactive web application that simulates personal banking services with a clean UI and real-world business logic.
Designed for a professional environment, it includes authentication, accounts management, transactions, RIB generation, mobile recharges, currency conversion, and more.

This project was developed using modern web standards, modular JavaScript (ES Modules), TailwindCSS, and a structured Git workflow (Scrum + feature branches).

🚀 Features
🔐 Authentication & Security

User registration & login

Two generated RIBs (main account + savings account)

Show/hide balance dynamically

Virtual card status (activate, block, limit operations)

👥 Beneficiaries

Add beneficiaries with Regex validation

Search, sort, block/unblock

Delete with confirmation modal

💸 Financial Operations

Internal & external transfers with validation

Bill payments with reference

Mobile/Internet recharge (IAM, Inwi, Orange)

Favorites management (anti-duplicate control)

🏦 Accounts

Dashboard with real-time balance

Savings account with its own RIB

Full transaction history with pagination

💱 Currency Conversion

MAD ⇄ EUR, MAD ⇄ USD

Static or API-based conversion rates

📄 Export

Export RIB as downloadable PDF

⚙️ Advanced Logic

Module-based JavaScript structure

User-isolated localStorage (per-user namespace)

Regex validation for all fields

Error handling and operation refusal rules

🧩 Tech Stack

HTML5 – Semantic and accessible structure

TailwindCSS – Utility-first responsive framework

JavaScript (ES Modules) – Modular architecture + business logic

JSON / localStorage – Data persistence

Git / GitHub – Version control with branching strategy

Vercel – Deployment

📁 Project Structure
design/                  → Wireframes, zoning, mockups
src/
   pages/                → All HTML files (11 pages)
   js/
    pages/
      auth.js            → Login / signup logic
      dashboard.js
      beneficiaries.js
      virements.js
      paiements.js
      recharge.js
      epargne.js
      historique.js
      conversion.js
      carte.js
    utils/
      utils.js           
   styles/
      style.css
   assets/
      images/
      icons/
      fonts/
.gitignore
tailwind.config.js
index.html               → Entry point
README.md












YCD Bank Project prototypes

[Prototype Figma desktop](https://www.figma.com/proto/CzyY7ZitIZFOttTdJFbL0I/Ycd-bank?node-id=4-76&p=f&t=Z2UflQ1Cbf0e2lkU-1&scaling=scale-down&content-scaling=fixed&page-id=2%3A3&starting-point-node-id=4%3A84)


[Prototype Figma mobile](https://www.figma.com/proto/CzyY7ZitIZFOttTdJFbL0I/Ycd-bank?node-id=122-2376&p=f&t=ItOkIVAtDve2nk8H-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=280%3A271)
