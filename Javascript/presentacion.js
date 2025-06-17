document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector('.Presentacion-1');
    const text = section.querySelector('p');
    const image = section.querySelector('img');
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Mostrar y animar
            text.classList.remove("animate-text");
            image.classList.remove("animate-image");
  
            void text.offsetWidth; // forzar reflow
            void image.offsetWidth;
  
            text.classList.add("animate-text");
            image.classList.add("animate-image");
          } else {
            // Ocultar si se sale de la vista
            text.classList.remove("animate-text");
            image.classList.remove("animate-image");
  
            text.style.opacity = 0;
            image.style.opacity = 0;
          }
        });
      },
      { threshold: 0.5 } // se activa si al menos el 50% está visible
    );
  
    observer.observe(section);
  });
  