//fuction for left-nav bar in logged in pages
document.addEventListener('DOMContentLoaded', function () {
    const bugger = document.querySelectorAll('.bugger');
    const leftMenu = document.querySelector('.menu-left');
    const logo = document.querySelector('.logo');
    const nav = document.querySelector('.nav-bar');
    const menuIcons = document.querySelector('.menu-icons');

    bugger.forEach(each => {
        each.removeEventListener('click', () => {}); // Clear existing listeners
        each.addEventListener('click', () => {
            //console.log('left menu is clicked');
            console.log('left menu is clicked at:', new Date().toISOString());
            leftMenu.classList.toggle('left-menu-active');
            logo.classList.toggle('logo-active');
            nav.classList.toggle('nav-active');
            menuIcons.classList.toggle('menu-icons-active');
        });
    });
});