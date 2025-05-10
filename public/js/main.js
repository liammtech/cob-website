document.addEventListener('DOMContentLoaded', () => {
const links = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('.page-section');

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

const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalClose = document.getElementById('modal-close');

// Open modal on image click
document.querySelectorAll('.brick img').forEach(img => {
  img.addEventListener('click', () => {
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modal.classList.add('show');
  });
});

// Close modal
modalClose.addEventListener('click', () => {
  modal.classList.remove('show');
});

// Optional: close when clicking outside image
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show');
  }
});

// Optional: close with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.classList.remove('show');
  }
});

});

