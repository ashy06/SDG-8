document.addEventListener('DOMContentLoaded', function() {
    // Embla Carousel Initialization
    (function initEmbla() {
const emblaNode = document.querySelector('.embla');
if (!emblaNode) {
    console.error('Embla container not found');
    return;
}

// Proper Embla availability check
if (typeof EmblaCarousel === 'undefined') {
    console.error('EmblaCarousel is not loaded. Check script source:', 
        'https://unpkg.com/embla-carousel@8.0.0/embla-carousel.umd.js');
    return;
}

// Initialize carousel with core settings
const embla = EmblaCarousel(emblaNode, {
    loop: true,
    align: 'center',
    skipSnaps: false,
    draggable: true,
    startIndex: 0
});

// Button elements
const prevButton = emblaNode.querySelector('.embla__button--prev');
const nextButton = emblaNode.querySelector('.embla__button--next');

// Button state management
const updateButtons = () => {
    if (prevButton) prevButton.disabled = !embla.canScrollPrev();
    if (nextButton) nextButton.disabled = !embla.canScrollNext();
};

// Event listeners with fallbacks
if (prevButton) {
    prevButton.addEventListener('click', () => embla.scrollPrev());
}
if (nextButton) {
    nextButton.addEventListener('click', () => embla.scrollNext());
}

// Initialize button states
embla.on('init', updateButtons);
embla.on('select', updateButtons);

// For debugging
console.log('Embla initialized:', embla);
})();

    // Marquee Animation Initialization
    (function initMarquee() {
        const marqueeItems = document.querySelectorAll('.marquee-item'); // Changed selector
        const speed = 0.03;
        const direction = -1;

        marqueeItems.forEach(item => {
            item.style.animationDuration = `${1/speed}s`;
            item.style.animationDirection = direction === -1 ? 'normal' : 'reverse';
            
            item.closest('.marquee-container').addEventListener('mouseenter', () => {
                item.style.animationPlayState = 'paused';
            });
            
            item.closest('.marquee-container').addEventListener('mouseleave', () => {
                item.style.animationPlayState = 'running';
            });
        });
    })();
});

document.addEventListener('DOMContentLoaded', () => {
const modal = document.getElementById('tn-flipbook-modal');
const closeBtn = document.querySelector('.tn-modal-close');

// Open modal when clicking your icon-wrapper link
document.querySelectorAll('.icon-wrapper a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';
    });
});

// Close modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close when clicking outside
window.addEventListener('click', (e) => {
    if(e.target === modal) {
        modal.style.display = 'none';
    }
});

// Close with ESC key
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
        modal.style.display = 'none';
    }
});

// Keep existing flipbook script from previous answer
(function() {
const pages = document.querySelectorAll('.tn-flip-page');
let currentPage = 0;

function showPage(index) {
    pages.forEach((page, i) => {
        page.classList.toggle('tn-active', i === index);
    });
    currentPage = index;
}

document.querySelectorAll('.tn-flip-next').forEach(btn => {
    btn.addEventListener('click', () => {
        if(currentPage < pages.length - 1) showPage(currentPage + 1);
    });
});

document.querySelectorAll('.tn-flip-prev').forEach(btn => {
    btn.addEventListener('click', () => {
        if(currentPage > 0) showPage(currentPage - 1);
    });
});

document.querySelectorAll('.tn-flip-restart').forEach(btn => {
    btn.addEventListener('click', () => showPage(0));
});

// Initialize first page
showPage(0);
})();
});

(function() {
    const overlay = $('.sdg-flipbook-overlay');
    const flipbookContainer = $('.sdg-flipbook-container');
    const flipbook = $('.sdg-flipbook');
    let flipbookInitialized = false;

    // Read more button handler
    $('.sdg-cta__button').on('click', function(e) {
        e.preventDefault();
        overlay.fadeIn(200);
        flipbookContainer.fadeIn(400, initFlipbook);
        $('body').css('overflow', 'hidden');
    });

    // Close handler
    $('.sdg-flipbook-close').on('click', closeFlipbook);
    overlay.on('click', closeFlipbook);

    function initFlipbook() {
        if (!flipbookInitialized) {
            flipbook.turn({
                width: 900,
                height: 600,
                pageWidth: 900,
                pageHeight: 600,
                autoCenter: true,
                display: 'double',
                acceleration: 0.2,
                gradients: true,
                duration: 750,
                when: {
                    turning: function(e, page) {
                        $('.turn-page')
                            .css('box-shadow', '-25px 0 40px rgba(0,0,0,0.15)')
                            .css('z-index', '999');
                    },
                    turned: function(e, page) {
                        $('.turn-page').css({
                            'box-shadow': 'none',
                            'z-index': 'auto'
                        });
                    }
                }
            });
            flipbookInitialized = true;
        }
    }

    // Enhanced Resize Handler
    $(window).on('resize', function() {
        if (flipbookInitialized) {
            flipbook.turn('size', 900, 600);
            flipbook.turn('pageWidth', 450);
        }
    });

    function closeFlipbook() {
        overlay.fadeOut(200);
        flipbookContainer.fadeOut(200);
        $('body').css('overflow', 'auto');
    }

    // Prevent default touch actions
    document.addEventListener('touchstart', function(e) {
        if (flipbookContainer.is(':visible')) {
            e.preventDefault();
        }
    }, { passive: false });

    // Keyboard navigation
    $(document).on('keydown.sdg-flipbook', function(e) {
        if (flipbookContainer.is(':visible')) {
            e.preventDefault();
            if (e.keyCode === 37) flipbook.turn('previous');
            if (e.keyCode === 39) flipbook.turn('next');
            if (e.keyCode === 27) closeFlipbook();
        }
    });
})();