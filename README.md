# Halfy - Official Landing Page

This repository hosts the source code for the official website of **Halfy**, a mobile application that calculates the fair geographical midpoint between two addresses to suggest meeting places.

The website serves as a showcase for the app, provides download links, and hosts the legal documentation (Privacy Policy).

🔗 **Live Website:** [https://halfy.app](https://halfy.app/)

## 🚀 Features

- **Responsive Design:** Optimized for both desktop and mobile devices.
- **Multi-language Support:**
  - 🇬🇧 **English:** Default (Root directory).
  - 🇫🇷 **French:** Accessible via the `/fr/` subdirectory.
- **Clean UI:** Built with pure HTML5 and CSS3 (using CSS Variables and Flexbox/Grid).
- **Privacy Policy:** Dedicated pages for legal compliance.

## 📂 Project Structure

The project follows a simple directory structure to handle internationalization (i18n):

```text
/
├── assets/              # Images, icons, favicons, and global resources
├── fr/                  # 🇫🇷 French localized version
│   ├── index.html       # 🇫🇷 French Homepage
│   └── privacy.html     # 🇫🇷 French Privacy Policy
├── index.html           # 🇬🇧 English Homepage (Main Entry)
├── privacy.html         # 🇬🇧 English Privacy Policy
└── README.md            # Project documentation
```

## 🛠 Technologies
- HTML5
- CSS3 (Custom styling, no external frameworks like Bootstrap)
- Google Fonts (Inter)
- GitHub Pages (Hosting)

## 🏃‍♂️ How to Run Locally
Since this is a static website, you don't need any backend server or build process.

1. Clone the repository:
   
```code Bash
git clone https://github.com/Ker-IT/Halfy-Website.git
```
2. Open the site:
    - Simply double-click on index.html.
    - OR use a VS Code extension like Live Server (recommended for auto-refresh).

## 📱 About the App (Halfy)
Halfy is a mobile application built with React Native and Expo. It helps users find fair meeting spots (bars, restaurants, parks) by calculating the exact midpoint between two locations.

- **Publisher:** Kër IT
- **Platforms:** Android (Google Play) & iOS (Coming soon)

## 📄 License
This project is proprietary to Kër IT.

All rights reserved © 2026.
