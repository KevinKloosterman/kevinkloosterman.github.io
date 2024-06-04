// General dataLayer push function
function pushToDataLayer(data) {
    window.dataLayer.push(data);
}

// Initiate dataLayer object
window.dataLayer = window.dataLayer || [];

function placeDataLayerListeners() {
    dataLayerInitiated = true;

    // hover_skill: when user hovers skill
    // -> handled in scripts.js hoverSkill function

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
                employer: link.dataset.institute.toLowerCase()
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
}
