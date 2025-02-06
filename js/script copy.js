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

$(document).ready(function() {
    const pdfUrl = 'file/SDG-8.pdf'; // Update with your PDF path
    let pdfDoc = null;
    let currentPage = 1;
    let scale = 1.0;

    // Initialize PDF viewer when "Read more" is clicked
    $('.sdg-cta__button').on('click', function(e) {
        e.preventDefault();
        $('.sdg-flipbook-overlay').fadeIn(200);
        $('.sdg-flipbook-container').fadeIn(400);
        $('body').css('overflow', 'hidden');
        
        // Load PDF only on first click
        if(!pdfDoc) {
            pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
                pdfDoc = pdf;
                document.getElementById('total-pages').textContent = pdf.numPages;
                renderPage(currentPage);
            });
        }
    });

    // Initialize PDF.js
    pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
        pdfDoc = pdf;
        document.getElementById('total-pages').textContent = pdf.numPages;
        renderPage(currentPage);
    });

    function renderPage(num) {
        pdfDoc.getPage(num).then(page => {
            const viewport = page.getViewport({ scale: scale });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            document.getElementById('pdf-container').innerHTML = '';
            document.getElementById('pdf-container').appendChild(canvas);
            page.render(renderContext);
            document.getElementById('current-page').textContent = currentPage;
        });
    }

    // Navigation handlers
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage < pdfDoc.numPages) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    // Zoom handlers
    document.getElementById('zoom-in').addEventListener('click', () => {
        scale += 0.1;
        renderPage(currentPage);
        document.getElementById('zoom-level').textContent = `${Math.round(scale * 100)}%`;
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
        if (scale > 0.5) {
            scale -= 0.1;
            renderPage(currentPage);
            document.getElementById('zoom-level').textContent = `${Math.round(scale * 100)}%`;
        }
    });

    // Overlay and close functionality
    const overlay = $('.sdg-flipbook-overlay');
    const flipbookContainer = $('.sdg-flipbook-container');

    // Initialize Turn.js for flipping effect
            function initFlipbook() {
                const flipbook = $('#pdf-container').turn({
                    width: 900,
                    height: 600,
                    autoCenter: true,
                    display: 'double',
                    duration: 750,
                    when: {
                        turning: function(e, page) {
                            $('.turn-page').css('box-shadow', '-25px 0 40px rgba(0,0,0,0.15)');
                        },
                        turned: function(e, page) {
                            $('.turn-page').css('box-shadow', 'none');
                        }
                    }
                });
            }

            // Call initFlipbook after rendering the first page
            $('.sdg-cta__button').on('click', function() {
                initFlipbook();
            });

    $('.sdg-cta__button').on('click', function(e) {
        e.preventDefault();
        overlay.fadeIn(200);
        flipbookContainer.fadeIn(400);
        $('body').css('overflow', 'hidden');
    });

    $('.sdg-flipbook-close').on('click', function() {
        $('.sdg-flipbook-overlay').fadeOut(200);
        $('.sdg-flipbook-container').fadeOut(200);
        $('body').css('overflow', 'auto');
    });

    overlay.on('click', () => {
        overlay.fadeOut(200);
        flipbookContainer.fadeOut(200);
        $('body').css('overflow', 'auto');
    });
})();
