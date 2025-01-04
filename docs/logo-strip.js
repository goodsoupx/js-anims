class LogoStrip {
    constructor() {
        // More specific selectors
        this.containers = document.querySelectorAll('.logo-strip-container');
        this.init();
        
        this.resizeTimeout = null;
        window.addEventListener('resize', () => {
            if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.resetAnimation(), 250);
        });
    }

    init() {
        // Initialize each container separately
        this.containers.forEach(container => {
            const strip = container.querySelector('.logo-strip');
            const originalSet = container.querySelector('.logo-set');
            if (!strip || !originalSet) return;
            
            this.createSets(strip, originalSet);
            this.createAnimation(strip);
        });
    }

    createSets(strip, originalSet) {
        // Remove any previously cloned sets
        const existingSets = strip.querySelectorAll('.logo-set');
        existingSets.forEach((set, index) => {
            if (index !== 0) set.remove();
        });

        // Calculate required sets based on container width
        const containerWidth = strip.closest('.logo-strip-container').offsetWidth;
        const totalSets = Math.ceil(containerWidth / originalSet.offsetWidth) + 2;
        
        // Clone sets within the correct parent
        for (let i = 1; i < totalSets; i++) {
            const clone = originalSet.cloneNode(true);
            strip.appendChild(clone);
        }
    }

    createAnimation(strip) {
        const containerElement = strip.closest('.logo-strip-container');
        if (!containerElement) return;

        const duration = containerElement.getAttribute('animation-duration') || 20;
        const direction = containerElement.getAttribute('animation-direction') || 1;
        const sets = strip.querySelectorAll('.logo-set');
        if (!sets.length) return;

        const totalWidth = sets[0].offsetWidth;

        gsap.to(sets, {
            x: Number(direction) * -totalWidth,
            duration: Number(duration),
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
            }
        });
    }

    resetAnimation() {
        this.containers.forEach(container => {
            const strip = container.querySelector('.logo-strip');
            if (!strip) return;
            
            gsap.killTweensOf(strip.querySelectorAll('.logo-set'));
            gsap.set(strip.querySelectorAll('.logo-set'), { clearProps: "all" });
        });
        this.init();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => new LogoStrip());
