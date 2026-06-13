// Fonction pour charger un fichier HTML dans une ou plusieurs divs données
function includeHTML(className, file) {
    let elements = document.querySelectorAll("." + className);
    elements.forEach(el => {
        fetch(file)
            .then(response => {
                if (!response.ok) throw new Error('Erreur HTTP ' + response.status);
                return response.text();
            })
            .then(data => {
                el.innerHTML = data;
                // Re-attendre les événements après chargement
                if (className === 'header') initMobileMenu();
            })
            .catch(error => console.error("Erreur de chargement de", file, ":", error));
    });
}

// Menu burger pour mobile
function initMobileMenu() {
    // Vérifier si le menu burger existe déjà
    if (document.querySelector('.menu-toggle')) return;
    
    const navbar = document.querySelector('.navbar');
    const header = document.querySelector('header');
    
    if (!navbar || !header) return;
    
    // Créer le bouton burger
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    
    // Insérer avant la navbar
    header.appendChild(menuToggle);
    
    menuToggle.addEventListener('click', function() {
        navbar.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // Fermer le menu quand on clique sur un lien
    const links = navbar.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

// Gestion du header au scroll
function handleHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 5%';
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.padding = '1rem 5%';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
}

// Charger toutes les sections communes
document.addEventListener("DOMContentLoaded", function() {
    includeHTML("header", "Header.html");
    includeHTML("contact", "Contact.html");
    includeHTML("footer", "Footer.html");
    handleHeaderScroll();
});