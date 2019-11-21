// Open/Close Hamburger Menu Icon
const hamburgerIconTrigger = document.querySelector('.nav-icon');
const hamburgerIcon = document.querySelector('.icon');
const nav = document.querySelector('#nav');


hamburgerIconTrigger.addEventListener('click', () => {
    hamburgerIcon.classList.toggle('open');
    nav.classList.toggle('active');
    if(nav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'initial';
    }

    // Hide navigation if one of the links was clicked
    nav.addEventListener('click', (e) => {
        if(e.target.tagName.toLowerCase() === 'a') {
            hamburgerIcon.classList.remove('open');
            nav.classList.remove('active');
            document.body.style.overflow = 'initial';
        }
    })
})
