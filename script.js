//nav bar toggling and dropdown
document.addEventListener('DOMContentLoaded', function() {
    var dropdown = document.querySelector('.company-header');
    var dropdownMenu = document.querySelector('.company-drop_down');
    var burger = document.querySelector('.burger');
    var nav = document.querySelector('.nav-bar');
    var navLinks = document.querySelectorAll('.nav-bar li');
    var navArrow = document.querySelector('.company-header i');

    // Toggle dropdown on click
    dropdown.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevents the click event from bubbling up to the document
        dropdownMenu.classList.toggle('show');
        navArrow.classList.toggle('navArowActive');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('show');
            navArrow.classList.remove('navArowActive');
        }
    });

    // Toggle nav on burger click
    burger.addEventListener('click', function() {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });

    // Close nav when a link is clicked
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
        });
    });

    // Close nav when clicking outside
    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && !burger.contains(event.target)) {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
        }
    });
});

/*Function for FAQ drawer*/
document.addEventListener('DOMContentLoaded', () => {
    const drawerHeaders = document.querySelectorAll('.drawer-head');
    drawerHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const drawer = header.nextElementSibling;
            if (drawer && drawer.classList.contains('drawer')) {
                header.classList.toggle('headerActive');
                drawer.classList.toggle('open');
                console.log('drawer has been clicked');
            }
        });
    });
});
