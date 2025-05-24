import { gsap } from 'gsap';

export function initAccueil() {
  const container = document.getElementById('ecran-accueil');
  
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center h-full bg-gradient-to-br from-sombre-900 via-sombre-800 to-sombre-900 relative overflow-hidden">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-neon-rose rounded-full blur-3xl animate-pulse-slow"></div>
        <div class="absolute bottom-1/3 right-1/4 w-24 h-24 bg-neon-bleu rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 right-1/3 w-20 h-20 bg-neon-violet rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
      </div>
      
      <div class="text-center z-10 max-w-2xl px-8">
        <h1 class="text-6xl md:text-8xl font-bold mb-6 glow-text text-neon-rose animate-float">
          Lumière sur Lyon
        </h1>
        
        <p class="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed">
          Découvrez les 5 joyaux illuminés de la Fête des Lumières à travers une balade virtuelle nocturne
        </p>
        
        <div class="space-y-4 mb-12">
          <div class="flex items-center justify-center space-x-3 text-lg">
            <span class="w-3 h-3 bg-neon-cyan rounded-full animate-pulse"></span>
            <span>Navigation Street View 360°</span>
          </div>
          <div class="flex items-center justify-center space-x-3 text-lg">
            <span class="w-3 h-3 bg-neon-violet rounded-full animate-pulse" style="animation-delay: 0.5s;"></span>
            <span>5 lieux emblématiques à découvrir</span>
          </div>
        </div>
        
        <button id="btn-commencer" class="btn-neon text-xl px-12 py-4 animate-pulse-glow">
          Commencer la balade
        </button>
      </div>
    </div>
  `;
  
  const btnCommencer = container.querySelector('#btn-commencer');
  btnCommencer.addEventListener('click', () => {
    gsap.to(container, {
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        document.dispatchEvent(new CustomEvent('commencer-balade'));
      }
    });
  });
  
  gsap.fromTo(container.querySelector('h1'), 
    { y: -50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out' }
  );
  
  gsap.fromTo(container.querySelector('p'), 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.5, delay: 0.3, ease: 'power3.out' }
  );
  
  gsap.fromTo(btnCommencer, 
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 1, delay: 0.8, ease: 'back.out(1.7)' }
  );
}
