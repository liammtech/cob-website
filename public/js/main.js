const links = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('.page-section');

links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.dataset.page;

    // Hide all sections
    sections.forEach(sec => sec.classList.remove('active'));

    // Show selected one
    document.getElementById(target).classList.add('active');
  });
});
