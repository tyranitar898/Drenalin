jQuery(document).ready(function($) {
    // browser window scroll (in pixels) after which the "menu" link is shown
    var offset = 300;
    var navigationContainer = $('#navBar')
    var mainNavigation = navigationContainer.find('#navBarMain ul');

    //open or close the menu clicking on the bottom "menu" link
    //double click function: replace 'click' with 'dbclick'
    $('.trigger').click(function() {
        toggleMenu();
    });


    function toggleMenu() {
        $('.trigger').toggleClass('menu-is-open').toggleClass('menu-is-closed');
        mainNavigation.toggleClass('is-visible');
    }

    function closeMenu() {
        $('.trigger').removeClass('menu-is-open').addClass('menu-is-closed');
        mainNavigation.removeClass('is-visible');
    }
});