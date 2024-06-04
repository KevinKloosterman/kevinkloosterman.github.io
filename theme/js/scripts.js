// Load the navigation bar template and initiate resume object
document.addEventListener('DOMContentLoaded', function() {
    fetch('templates/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            setActiveNavLink();
            window.scrollTo(0, 0);
        })
        .catch(error => console.error('Error loading navbar:', error));
});

// Set active nav link color
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });
}

if (!(document.location.href.includes("index.html"))) {
    placeDataLayerListeners();
}
