// Espera a que el DOM esté listo para inicializar las galerías
document.addEventListener('DOMContentLoaded', () => {
  initProductGalleries();
});

function initProductGalleries() {
  // Recorre todas las galerías de productos de la página
  document.querySelectorAll('.product-gallery').forEach(gallery => {
    const mainImg = gallery.querySelector('#img_main'); // Imagen principal mostrada
    const thumbnails = Array.from(gallery.querySelectorAll('.thumbnail')); // Miniaturas asociadas
    const prevBtn = gallery.querySelector('#prev-btn'); // Botón de navegación atrás
    const nextBtn = gallery.querySelector('#next-btn'); // Botón de navegación adelante

    // Referencias al modal para ver imágenes en grande
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const modalClose = document.getElementById('modal-close');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');

    // Lista de rutas de las imágenes (desde dataset o src de <img>)
    const images = thumbnails.map(t => t.dataset.src || (t.querySelector('img') && t.querySelector('img').src));
    if (!images.length) return; // Si no hay imágenes, se corta aquí

    let currentIndex = 0; // Índice de la imagen activa

    setMainImage(0); // Se arranca mostrando la primera imagen

    // Eventos para cambiar de imagen desde las miniaturas
    thumbnails.forEach((btn, idx) => {
      btn.addEventListener('click', () => setMainImage(idx));
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { 
          e.preventDefault(); 
          setMainImage(idx); 
        }
      });
    });

    // Botones de navegación anterior / siguiente
    if (prevBtn) prevBtn.addEventListener('click', () => setMainImage((currentIndex - 1 + images.length) % images.length));
    if (nextBtn) nextBtn.addEventListener('click', () => setMainImage((currentIndex + 1) % images.length));

    // Abre el modal al hacer click en la imagen principal
    mainImg.addEventListener('click', () => openModal(currentIndex));
    mainImg.addEventListener('keydown', (e) => { 
      if (e.key === 'Enter' || e.key === ' ') openModal(currentIndex); 
    });

    // Controles del modal (cerrar, navegar, etc.)
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalPrev) modalPrev.addEventListener('click', () => navigateModal(-1));
    if (modalNext) modalNext.addEventListener('click', () => navigateModal(1));

    // Cierra el modal si se hace click fuera de la imagen
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // Controles de teclado para el modal
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('hidden')) {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') navigateModal(1);
        if (e.key === 'ArrowLeft') navigateModal(-1);
      }
    });

    // Cambia la imagen principal y actualiza el estado de la miniatura activa
    function setMainImage(idx) {
      currentIndex = idx;
      mainImg.src = images[idx];
      const thumbImg = thumbnails[idx].querySelector('img');
      if (thumbImg) mainImg.alt = thumbImg.alt || mainImg.alt;
      updateActiveThumbnail(idx);
    }

    // Marca la miniatura activa y la centra en la vista si es necesario
    function updateActiveThumbnail(idx) {
      thumbnails.forEach((t, i) => {
        t.classList.toggle('active', i === idx);
        t.setAttribute('aria-pressed', i === idx ? 'true' : 'false');
      });
      const active = thumbnails[idx];
      if (active && typeof active.scrollIntoView === 'function') {
        active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }

    // Abre el modal con la imagen seleccionada
    function openModal(idx) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Bloquea scroll en el body
      modalImg.src = images[idx];
      modalImg.alt = (thumbnails[idx].querySelector('img') && thumbnails[idx].querySelector('img').alt) || '';
    }

    // Cierra el modal y limpia la imagen
    function closeModal() {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      modalImg.src = '';
    }

    // Cambia de imagen dentro del modal según dirección
    function navigateModal(direction) {
      currentIndex = (currentIndex + direction + images.length) % images.length;
      modalImg.src = images[currentIndex];
      setMainImage(currentIndex);
    }
  });
}

// --- Script del acordeón ---
// Maneja la apertura y cierre de secciones tipo FAQ
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("[data-accordion-target]");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-accordion-target"); // ID del panel asociado
      const content = document.getElementById(targetId);
      const expanded = btn.getAttribute("aria-expanded") === "true";

      // Cierra todas las secciones activas
      document.querySelectorAll(".accordion-content").forEach((el) => {
        el.style.maxHeight = null;
      });
      document.querySelectorAll("[data-accordion-target]").forEach((b) => {
        b.setAttribute("aria-expanded", "false");
        b.querySelector("svg").classList.remove("rotate-180");
      });

      // Si estaba cerrada, abre la sección seleccionada
      if (!expanded) {
        content.style.maxHeight = content.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
        btn.querySelector("svg").classList.add("rotate-180");
      }
    });
  });
});
