document.querySelectorAll('.sanctuary-scroll-button').forEach((button) => {
    button.addEventListener('click', () => {
        const slider = document.getElementById('sanctuary-slider');
        const firstCard = slider.querySelector('a');
        const distance = firstCard ? firstCard.getBoundingClientRect().width + 24 : slider.clientWidth;
        slider.scrollBy({ left: distance * Number(button.dataset.scroll), behavior: 'smooth' });
    });
});

const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuToggle && mobileMenu) {
    let mobileMenuCloseTimer;
    const closeMobileMenu = () => {
        if (mobileMenu.hidden || mobileMenu.classList.contains('is-closing')) return;
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Buka menu');
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            mobileMenu.hidden = true;
            return;
        }
        mobileMenu.classList.add('is-closing');
        mobileMenuCloseTimer = window.setTimeout(() => {
            mobileMenu.hidden = true;
            mobileMenu.classList.remove('is-closing');
        }, 180);
    };

    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            closeMobileMenu();
        } else {
            window.clearTimeout(mobileMenuCloseTimer);
            mobileMenu.classList.remove('is-closing');
            mobileMenu.hidden = false;
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
            mobileMenuToggle.setAttribute('aria-label', 'Tutup menu');
        }
    });

    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileMenu));
    document.addEventListener('click', (event) => {
        if (!mobileMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) closeMobileMenu();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !mobileMenu.hidden) {
            closeMobileMenu();
            mobileMenuToggle.focus();
        }
    });
}

const eventDropdown = document.querySelector('.event-dropdown');
if (eventDropdown) {
    const eventButton = eventDropdown.querySelector('button');
    const closeEventDropdown = () => {
        eventDropdown.classList.remove('is-open');
        eventButton.setAttribute('aria-expanded', 'false');
    };

    eventButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = eventDropdown.classList.toggle('is-open');
        eventButton.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (event) => {
        if (!eventDropdown.contains(event.target)) closeEventDropdown();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeEventDropdown();
            eventButton.focus();
        }
    });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll('main section:not(:first-of-type) > *, #sanctuary-slider > a, footer > div > *');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    revealTargets.forEach((element, index) => {
        element.classList.add('scroll-reveal');
        element.style.setProperty('--reveal-delay', `${(index % 4) * 90}ms`);
        revealObserver.observe(element);
    });
}
