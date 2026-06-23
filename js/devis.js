// Script pour gérer le formulaire de devis
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('devisForm');
    if (!form) return;

    //  AJOUT : Champs cachés pour Formspree 
    const hiddenSubject = document.createElement('input');
    hiddenSubject.type = 'hidden';
    hiddenSubject.name = '_subject';
    hiddenSubject.value = 'Devis - Nouvelle demande';
    form.prepend(hiddenSubject);

    const hiddenCaptcha = document.createElement('input');
    hiddenCaptcha.type = 'hidden';
    hiddenCaptcha.name = '_captcha';
    hiddenCaptcha.value = 'false';
    form.prepend(hiddenCaptcha);

    const fieldsets = Array.from(form.querySelectorAll(':scope > fieldset'));
    let currentStep = 0;

    function showStep(n) {
        fieldsets.forEach((fs, i) => {
            fs.classList.toggle('active', i === n);
            fs.style.display = i === n ? 'block' : 'none';
        });
    }

    function nextStep() {
        if (currentStep < fieldsets.length - 1) {
            if (!validateCurrentStep()) return;
            currentStep++;
            if (currentStep === 2) loadQuestions();
            showStep(currentStep);
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    }
    
    function validateCurrentStep() {
        const currentFieldset = fieldsets[currentStep];
        const requiredInputs = currentFieldset.querySelectorAll('[required]');
        let isValid = true;
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red';
                input.addEventListener('input', function() {
                    this.style.borderColor = '';
                }, { once: true });
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (currentStep === 1) {
            const radios = currentFieldset.querySelectorAll('input[type="radio"]');
            const checked = Array.from(radios).some(r => r.checked);
            if (!checked) {
                isValid = false;
                alert('Veuillez sélectionner un service');
            }
        }
        
        if (!isValid) {
            alert('Veuillez remplir tous les champs obligatoires');
        }
        return isValid;
    }

    //  loadQuestions() - Suppression des balises <form> 
    function loadQuestions() {
        const service = form.querySelector('input[name="service"]:checked');
        const serviceValue = service ? service.value : '';
        const qDiv = document.getElementById('questions');
        if (!qDiv) return;
        qDiv.innerHTML = '';
        qDiv.style.display = 'block';

        // On ajoute les champs DIRECTEMENT (SANS balise <form>)
        if (serviceValue === 'graphisme') {
            qDiv.innerHTML = `
                <div class="customer-information">
                    <label>Type de projet graphique souhaité:</label>
                    <select name="type_graphisme" required>
                        <option value="">--Sélectionnez--</option>
                        <option value="charte">Charte graphique</option>
                        <option value="flyers">Flyers, affiches, dépliants</option>
                        <option value="cartes">Cartes de visites</option>
                        <option value="reseaux">Maquettes pour réseaux sociaux</option>
                        <option value="habillage">Habillages visuels</option>
                        <option value="documents">Documents corporatifs</option>
                    </select>
                </div>
                <div class="customer-information">
                    <label>Description détaillée du projet:</label>
                    <textarea name="description_graphisme" rows="5" placeholder="Décrivez vos attentes, vos idées, vos besoins..."></textarea>
                </div>
                <div class="customer-information">
                    <label>Formats et dimensions souhaitées:</label>
                    <input type="text" name="formats" placeholder="Exemple: A4, 1080x1080px, bannière 2m x 1m">
                </div>
                <div class="customer-information">
                    <label>Nombre d'exemplaires:</label>
                    <input type="number" name="exemplaires" placeholder="Nombre d'exemplaires">
                </div>
            `;
        } else if (serviceValue === 'impression') {
            qDiv.innerHTML = `
                <div class="customer-information">
                    <label>Type d'impression:</label>
                    <input type="text" name="type_impression" required placeholder="Ex: offset, numérique...">
                </div>
                <div class="customer-information">
                    <label>Type de produit à imprimer:</label>
                    <select name="produit_impression" required>
                        <option value="">--Sélectionnez--</option>
                        <option value="flyers">Flyers</option>
                        <option value="carte">Carte de visite</option>
                        <option value="affiches">Affiche</option>
                        <option value="depliant">Dépliant</option>
                        <option value="brochure">Brochure</option>
                        <option value="roll_up">Roll up</option>
                        <option value="autre">Autres</option>
                    </select>
                </div>
                <div class="customer-information">
                    <label>Grammage du papier:</label>
                    <input type="text" name="grammage" placeholder="Ex: 70g, 80g, 135g, 250g, 350g">
                </div>
                <div class="customer-information">
                    <label>Impression:</label>
                    <select name="impression_format" required>
                        <option value="">--Sélectionnez--</option>
                        <option value="recto">Recto uniquement</option>
                        <option value="recto_verso">Recto-verso</option>
                    </select>
                </div>
                <div class="customer-information">
                    <label>Quantité:</label>
                    <input type="number" name="quantite" placeholder="Nombre d'exemplaires">
                </div>
                <div class="customer-information">
                    <label>Couleur:</label>
                    <select name="couleur" required>
                        <option value="">--Sélectionnez--</option>
                        <option value="nb">Noir & blanc</option>
                        <option value="couleur">Couleur</option>
                    </select>
                </div>
                <div class="customer-information">
                    <label>Besoin de conception graphique:</label>
                    <select name="conception_graphique" required>
                        <option value="">--Sélectionnez--</option>
                        <option value="besoin_maquette">Oui, besoin d'une maquette</option>
                        <option value="deja_pret">Non, fichier déjà prêt</option>
                    </select>
                </div>
            `;
        } else if (serviceValue === 'software') {
            qDiv.innerHTML = `
                <div class="customer-information">
                    <label>Type de projet:</label>
                    <input type="text" name="type_projet" required placeholder="Ex: e-commerce, gestion, etc.">
                </div>
                <div class="customer-information">
                    <label>Service cloud souhaité:</label>
                    <select name="cloud" required>
                        <option value="">--Sélectionnez--</option>
                        <option value="developpement">Développement d'applications web & mobiles</option>
                        <option value="hebergement">Hébergement d'applications et logiciels</option>
                        <option value="bases_donnees">Création et gestion des bases de données cloud</option>
                        <option value="sauvegarde">Sauvegarde & Reprise après sinistre</option>
                        <option value="virtualisation">Virtualisation d'infrastructure</option>
                        <option value="conseil">Conseils & Accompagnement</option>
                    </select>
                </div>
                <div class="customer-information">
                    <label>Fonctionnalités principales:</label>
                    <textarea name="fonctionnalites" rows="4" placeholder="Décrivez les fonctionnalités souhaitées..."></textarea>
                </div>
            `;
        }
    }

    // Navigation par boutons
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        e.preventDefault();
        const action = btn.getAttribute('data-action');
        if (action === 'next') nextStep();
        if (action === 'prev') prevStep();
    });

    // === MODIFICATION : Soumission du formulaire vers Formspree ===
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validation finale des champs requis
        const requiredFields = form.querySelectorAll('[required]');
        let allValid = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                allValid = false;
                field.style.borderColor = 'red';
            } else {
                field.style.borderColor = '';
            }
        });
        
        if (!allValid) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Envoyer à Formspree
        const formData = new FormData(form);
        
        fetch('https://formspree.io/f/meewpgdo', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Merci ! Votre demande de devis a été envoyée avec succès. Nous vous contacterons sous 24h.');
                form.reset();
                currentStep = 0;
                showStep(currentStep);
                document.getElementById('questions').innerHTML = '';
            } else {
                alert('Une erreur est survenue. Veuillez réessayer.');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur de connexion. Vérifiez votre internet.');
        });

        // Sauvegarde locale en parallèle (optionnel)
        try {
            const data = new FormData(form);
            const obj = {};
            data.forEach((val, key) => obj[key] = val);
            
            let devis = [];
            const stored = localStorage.getItem('devisPrintisoft');
            devis = stored ? JSON.parse(stored) : [];
            
            devis.push({
                ...obj,
                date: new Date().toISOString()
            });
            
            localStorage.setItem('devisPrintisoft', JSON.stringify(devis));
        } catch (err) {
            console.log('Erreur de sauvegarde locale:', err);
        }
    });

    // Initialisation
    showStep(currentStep);
});
