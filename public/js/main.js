document.addEventListener('DOMContentLoaded', () => {
const links = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('.page-section');

// SECTION LOADING ==================================

links.forEach(link => {
    link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.dataset.page;

    // Hide all sections
    sections.forEach(sec => sec.classList.remove('active'));

    // Show the selected one
    document.getElementById(target).classList.add('active');
    });
});


// MODAL =============================================

const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalClose = document.getElementById('modal-close');

  function updateModalImageSize() {
    const availableHeight = window.innerHeight * 0.8;
    modalImg.style.maxHeight = availableHeight + 'px';
    modalImg.style.maxWidth = '80vw';
  }

  // Open modal
  document.querySelectorAll('.brick img').forEach(img => {
    img.addEventListener('click', () => {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modal.classList.add('show');
      updateModalImageSize();
    });
  });

  // Close modal
  modalClose.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('show');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') modal.classList.remove('show');
  });

  // Also update on resize
  window.addEventListener('resize', updateModalImageSize);

  // FADE HEADER =====================================

  const sectionHeader = document.getElementById('illustration-header');
  const scrollContainer = document.body // document.getElementById('illustration'); // adjust if needed
  const fadeStart = 100;  // px from top to start fading
  const fadeEnd = 40;     // px from top to fully fade out

  scrollContainer.addEventListener('scroll', () => {
  const rect = sectionHeader.getBoundingClientRect();
  const distanceFromTop = rect.top;

  if (distanceFromTop <= fadeEnd) {
    sectionHeader.style.opacity = 0;
  } else if (distanceFromTop <= fadeStart) {
    const opacity = (distanceFromTop - fadeEnd) / (fadeStart - fadeEnd);
    sectionHeader.style.opacity = opacity.toFixed(2);
  } else {
    sectionHeader.style.opacity = 1;
  }

  // FADE BRICKS ===============================
  const bricks = document.querySelectorAll('.brick');

});

});

