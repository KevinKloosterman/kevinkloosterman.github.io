// dataLayer object is initiated in consent_default.js

// General dataLayer push function
function pushToDataLayer(data) {
    window.dataLayer.push(data);
}

function placeDataLayerListeners() {
    dataLayerInitiated = true;

    // hover_skill: when user hovers skill
    // -> handled in scripts.js hoverSkill function

    document.querySelectorAll('a.download-cv').forEach(function(element) {
        // Check if the listener has already been added
        if (!element.dataset.listenerAdded) {
            element.addEventListener('click', function(event) {
                const fileLanguage = event.currentTarget.dataset.language;
                pushToDataLayer({
                    event: 'download_cv',
                    file_language: fileLanguage,
                });
            });
    
            // Mark the listener as added
            element.dataset.listenerAdded = "true";
        }
    });

    // When user clicks on a social media link
    document.querySelectorAll('.social-btn').forEach(link => {
        link.addEventListener('click', function() {
            pushToDataLayer({
                event: 'clickout',
                clickout_type: 'social',
                social: link.dataset.social.toLowerCase()
            });
        });
    });

    // When user clicks on an employer logo
    document.querySelectorAll('.experience-clickout').forEach(link => {
        link.addEventListener('click', function() {
            pushToDataLayer({
                event: 'clickout',
                clickout_type: 'experience',
                employer: link.dataset.employer.toLowerCase()
            });
        });
    });

    // When user clicks on an eductation institute logo
    document.querySelectorAll('.education-clickout').forEach(link => {
        link.addEventListener('click', function() {
            pushToDataLayer({
                event: 'clickout',
                clickout_type: 'education',
                institute: link.dataset.institute.toLowerCase()
            });
        });
    });

    // When user clicks on a contact link (non form)
    document.querySelectorAll('.contact-clickout').forEach(link => {
        link.addEventListener('click', function() {
            pushToDataLayer({
                event: 'clickout',
                clickout_type: 'contact',
                contact: link.dataset.contact.toLowerCase()
            });
        });
    });

    // When user submits the contact form
    const form_submit_btn = document.querySelector('#contact-form')
    if (form_submit_btn) {
        form_submit_btn.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the form from submitting immediately
    
            // Get the email and phone inputs
            const emailInput = document.querySelector('#email').value;
            const phoneInput = document.querySelector('#phone').value;
    
            // Hash the email input
            const shaEmail = new jsSHA("SHA-256", "TEXT");
            shaEmail.update(emailInput);
            const hashedEmail = shaEmail.getHash("HEX");

            // Hash the phone input
            const shaPhone = new jsSHA("SHA-256", "TEXT");
            shaPhone.update(phoneInput);
            const hashedPhone = shaPhone.getHash("HEX");

            // Push to dataLayer
            pushToDataLayer({
                event: 'ce_form_submit',
                form_type: 'contact',
                ec_data: {
                    email: hashedEmail,
                    phone: hashedPhone
                }
            });
    
            // Submit the form after pushing to dataLayer
            event.target.submit();
        });
    }
}
