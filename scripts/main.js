class LogoStrip {
    constructor() {
        this.container = document.querySelector('.logo-strip');
        this.originalSet = document.querySelector('.logo-set');
        this.animation = null;
        this.init();
        
        this.resizeTimeout = null;
        window.addEventListener('resize', () => {
            if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.resetAnimation(), 250);
        });
    }

    init() {
        this.createSets();
        this.createAnimation();
    }

    createSets() {
        const existingSets = this.container.querySelectorAll('.logo-set');
        existingSets.forEach((set, index) => {
            if (index !== 0) set.remove();
        });

        const totalSets = Math.ceil(window.innerWidth / this.originalSet.offsetWidth) + 2;
        for (let i = 1; i < totalSets; i++) {
            this.container.appendChild(this.originalSet.cloneNode(true));
        }
    }

    createAnimation() {
        if (this.animation) this.animation.kill();
        
        const sets = document.querySelectorAll('.logo-set');
        const totalWidth = sets[0].offsetWidth;

        this.animation = gsap.to(sets, {
            x: -totalWidth,
            duration: 2,
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
            }
        });
    }

    resetAnimation() {
        gsap.killTweensOf('.logo-set');
        gsap.set('.logo-set', { clearProps: "all" });
        this.init();
    }
}

document.addEventListener('DOMContentLoaded', () => new LogoStrip());
