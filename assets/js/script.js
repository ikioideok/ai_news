gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- General Setup ---
const nav = document.querySelector('nav');
const chapterDots = gsap.utils.toArray('.chapter-dot');
const storySections = gsap.utils.toArray('.story-section');

// --- Loading Screen ---
window.addEventListener('load', () => {
    // Initialize Three.js scenes first with delay to ensure THREE is loaded
    setTimeout(() => {
        if (window.threeManager) {
            window.threeManager.init();
        }
    }, 100);
    
    gsap.to('.loading-screen', {
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        onComplete: () => {
            document.querySelector('.loading-screen').style.display = 'none';
            document.body.style.overflow = 'auto';
            if (!prefersReducedMotion) {
                initAnimations();
            } else {
                gsap.set('.story-content, .final-message, .hero-text-content > *, .hero-canvas', { opacity: 1 });
                // Ensure section content is visible when reduced motion is enabled
                gsap.set('#vision .story-content, #service .story-content, #company .story-content', { opacity: 1, y: 0 });
            }
        }
    });
});

function initAnimations() {
    // --- Nav Scroll ---
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: { className: 'scrolled', targets: nav }
    });

    // --- Navigation click handlers with offset ---
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            gsap.to(window, { 
                duration: 1.5, 
                scrollTo: { y: targetId, offsetY: 100 },
                ease: 'power2.inOut'
            });
        });
    });

    // --- Progress Bar ---
    gsap.to('.progress-fill', {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: 'main',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5
        }
    });

    // --- Chapter Dots & Content Reveal ---
    storySections.forEach((section) => {
        const chapter = section.dataset.chapter;
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onToggle: self => {
                chapterDots.forEach(dot => dot.classList.remove('active'));
                const activeDot = chapterDots.find(dot => dot.dataset.chapter === chapter);
                if (activeDot && self.isActive) {
                    activeDot.classList.add('active');
                }
            }
        });
    });

    chapterDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const chapter = dot.dataset.chapter;
            const targetSection = document.querySelector(`.story-section[data-chapter="${chapter}"]`);
            gsap.to(window, { duration: 1.5, scrollTo: targetSection, ease: 'power2.inOut' });
        });
    });

    // --- Hero Animation ---
    const heroTl = gsap.timeline({ delay: 0.5 });
    const heroTextElements = gsap.utils.toArray('.hero-text-content > *');
    heroTl.fromTo(heroTextElements,
        { opacity: 0, y: 40 },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power2.out'
        }
    );

    heroTl.fromTo('.hero-canvas', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.8");

    const statNumbers = gsap.utils.toArray('.stat-number');
    statNumbers.forEach(stat => {
        const endValue = parseInt(stat.dataset.count, 10);
        gsap.fromTo(stat, {
            textContent: 0
        }, {
            textContent: endValue,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            scrollTrigger: {
                trigger: stat,
                start: 'top 90%',
            }
        });
    });

    gsap.to('.hero-content', {
        scale: 0.95,
        opacity: 0.8,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });

    // --- Vision Animation ---
    // Set initial visibility
    gsap.set('#vision .story-content', { opacity: 1, y: 0 });
    
    const visionTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#vision',
            pin: true,
            scrub: 1,
            start: 'top top',
            end: '+=200%',
            onUpdate: (self) => {
                // Animate Vision Three.js scene based on scroll progress
                if (window.threeManager && window.threeManager.scenes.vision) {
                    const progress = self.progress;
                    const networkNodes = window.threeManager.scenes.vision.children[0].children;
                    networkNodes.forEach((node, i) => {
                        if (node.material) {
                            node.material.opacity = Math.min(progress * 2, 1);
                            node.scale.setScalar(progress * 2);
                        }
                    });
                }
            }
        }
    });
    visionTl.to('#vision .story-content', { opacity: 0, y: -50, duration: 1 }, 0.8);

    // --- Service Animation ---
    // Set initial visibility
    gsap.set('#service .story-content', { opacity: 1, y: 0 });
    
    const serviceTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#service',
            pin: true,
            scrub: 1,
            start: 'top top',
            end: '+=200%',
            onUpdate: (self) => {
                // Control Service Three.js scene rotation speed based on scroll
                if (window.threeManager && window.threeManager.scenes.service) {
                    const progress = self.progress;
                    const geometryGroup = window.threeManager.scenes.service.children[0];
                    geometryGroup.rotation.y = progress * Math.PI * 2;
                }
            }
        }
    });
    serviceTl.to('#service .story-content', { opacity: 0, y: -50, duration: 1 }, 0.8);

    // --- Company Animation ---
    // Set initial visibility
    gsap.set('#company .story-content', { opacity: 1, y: 0 });
    
    const companyTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#company',
            pin: true,
            scrub: 1,
            start: 'top top',
            end: '+=200%',
            onUpdate: (self) => {
                // Enhance Company Three.js building rotation
                if (window.threeManager && window.threeManager.scenes.company) {
                    const progress = self.progress;
                    const buildingGroup = window.threeManager.scenes.company.children[0];
                    buildingGroup.rotation.y = progress * Math.PI * 4;
                    buildingGroup.rotation.x = Math.sin(progress * Math.PI) * 0.3;
                }
            }
        }
    });
    companyTl.to('#company .story-content', { opacity: 0, y: -50, duration: 1 }, 0.8);

    // --- Contact Animation ---
    const contactTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#contact',
            pin: true,
            scrub: 1,
            start: 'top top',
            end: '+=200%',
            onUpdate: (self) => {
                // Control Contact particle intensity and camera movement
                if (window.threeManager && window.threeManager.scenes.unleashed) {
                    const progress = self.progress;
                    const particleSystem = window.threeManager.scenes.unleashed.children[0];
                    if (particleSystem && particleSystem.material) {
                        particleSystem.material.opacity = Math.min(progress * 1.5, 1);
                        particleSystem.material.size = 0.1 + progress * 0.2;
                    }
                }
            }
        }
    });
    contactTl.fromTo('#contact .final-message', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 });
}

// Handle window resize for Three.js scenes
window.addEventListener('resize', () => {
    if (window.threeManager) {
        window.threeManager.handleResize();
    }
});

window.addEventListener('beforeunload', () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    if (window.threeManager) {
        window.threeManager.cleanup();
    }
});
