document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. Buttery Smooth Custom Cursor (Lerp)
    ========================================== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Default positions
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Dot follows instantly
        if(cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    // Lerp (Linear Interpolation) function for the trailing effect
    const animateCursor = () => {
        let distX = mouseX - outlineX;
        let distY = mouseY - outlineY;
        
        // Adjust the '0.15' to make the trail faster or slower
        outlineX = outlineX + (distX * 0.15);
        outlineY = outlineY + (distY * 0.15);
        
        if(cursorOutline) {
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
        }
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    /* ==========================================
       2. Magnetic Buttons (Pro Effect)
    ========================================== */
    const magneticElements = document.querySelectorAll('.btn, .brand, .social-icon');

    magneticElements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const position = el.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            
            // Move the button slightly towards the cursor
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            
            // Expand cursor
            if(cursorOutline) {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
            }
        });

        el.addEventListener('mouseleave', () => {
            // Reset button position with a spring effect
            el.style.transform = `translate(0px, 0px)`;
            
            // Reset cursor
            if(cursorOutline) {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.backgroundColor = 'transparent';
            }
        });
    });

    /* ==========================================
       3. 3D Tilt Effect for Bento Cards
    ========================================== */
    const cards = document.querySelectorAll('.bento-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Glow effect center
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Calculate 3D rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5; // Max rotation 5deg
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    /* ==========================================
       4. Advanced Intersection Observer (Staggered Reveals)
    ========================================== */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            // Add a class instead of inline styles for cleaner CSS management
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Stop observing once revealed
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ==========================================
       5. Sticky Navbar & Mobile Menu Logic
    ========================================== */
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        if(hamburger) hamburger.classList.remove('active');
        if(navMenu) navMenu.classList.remove('active');
    }));

    /* ==========================================
       6. Dynamic Number Counter
    ========================================== */
    const counters = document.querySelectorAll('.counter');
    const speed = 100;

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                
                const updateCount = () => {
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    /* ==========================================
       7. Typewriter Effect
    ========================================== */
    const typingTextElement = document.querySelector('.typing-text');
    
    if (typingTextElement) {
        // Words to cycle through. You can change these!
// Words to cycle through
        const words = [
            "Graphic Designer.", 
            "Web Developer.", 
            "Digital Marketer.", 
            "SEO Expert."
        ];
        
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeEffect = () => {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                // Delete character by character
                typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                // Type character by character
                typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            // Speed control
            let typeSpeed = isDeleting ? 40 : 100; // Types at 100ms, deletes faster at 40ms
            
            // Pause logic at the end of a word or before starting a new one
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause for 2 seconds when the word is fully typed
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length; // Move to the next word
                typeSpeed = 500; // Pause for half a second before typing the next word
            }
            
            setTimeout(typeEffect, typeSpeed);
        };
        
        // Start the typing effect loop
        setTimeout(typeEffect, 1000);
    }
});