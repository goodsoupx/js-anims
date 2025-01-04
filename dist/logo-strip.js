/**
 * LogoStrip class handles an infinite scrolling animation of logos
 * Requires GSAP library for animations
 */
class LogoStrip {
    /**
     * Initialize the logo strip animation
     * Sets up DOM references and event listeners
     */
    constructor() {
        // Get main container and original logo set
        this.container = document.querySelector('.logo-strip');
        this.originalSet = document.querySelector('.logo-set');
        this.animation = null;
        this.init();
        
        // Handle window resize with debouncing
        this.resizeTimeout = null;
        window.addEventListener('resize', () => {
            if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.resetAnimation(), 250);
        });
    }

    /**
     * Initialize the animation by creating logo sets and starting animation
     */
    init() {
        this.createSets();
        this.createAnimation();
    }

    /**
     * Creates enough logo sets to fill the screen width plus buffer
     * Removes any existing cloned sets before creating new ones
     */
    createSets() {
        // Remove existing cloned sets
        const existingSets = this.container.querySelectorAll('.logo-set');
        existingSets.forEach((set, index) => {
            if (index !== 0) set.remove();
        });

        // Calculate and create required number of sets
        const totalSets = Math.ceil(window.innerWidth / this.originalSet.offsetWidth) + 2;
        for (let i = 1; i < totalSets; i++) {
            this.container.appendChild(this.originalSet.cloneNode(true));
        }
    }

    /**
     * Creates the GSAP animation for infinite scrolling effect
     * Kills any existing animation before creating new one
     */
    createAnimation() {
        if (this.animation) this.animation.kill();
        
        const sets = document.querySelectorAll('.logo-set');
        const totalWidth = sets[0].offsetWidth;

        // Create infinite scrolling animation using GSAP
        this.animation = gsap.to(sets, {
            x: -totalWidth,
            duration: 2,
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % totalWidth) // Creates seamless loop
            }
        });
    }

    /**
     * Resets the animation when window is resized
     * Clears all GSAP properties and reinitializes
     */
    resetAnimation() {
        gsap.killTweensOf('.logo-set');
        gsap.set('.logo-set', { clearProps: "all" });
        this.init();
    }
}

// Initialize the LogoStrip when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => new LogoStrip());
