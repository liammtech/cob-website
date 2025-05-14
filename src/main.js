import panzoom from '@panzoom/panzoom';

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

// Assume we have all image filenames already fetched:
let imageFilenames = []; // This will be populated by your fetch('/images') call.

function getPattern() {
  const vw = window.innerWidth;
  if (vw >= 1440) {
    return [3, 2];  // 3 bricks, then 2, then 3, ...
  } else if (vw >= 900) {
    return [2, 1];  // 2 bricks, then 1, then 2, then 1
  } else {
    return [1];     // one per row for very narrow screens
  }
}

console.log('Gallery:', document.querySelector('.gallery'));

function renderGallery() {
  const gallery = document.querySelector('.gallery');
  // Clear any existing content
  gallery.innerHTML = '';

  // Get pattern for the current viewport width.
  const pattern = getPattern();
  
  let i = 0;
  let rowIndex = 0;
  
  // Loop through imageFilenames, building rows in groups according to the pattern.
  while (i < imageFilenames.length) {
    // Select the pattern for this row:
    const bricksInRow = pattern[rowIndex % pattern.length];
    
    // Create row container with a class reflecting the row type.
    const row = document.createElement('div');
    row.classList.add('row');
    // Optionally add another class, e.g. 'full' or 'offset', if you want different styling
    // For example:
    // row.classList.add(rowIndex % 2 === 0 ? 'full' : 'offset');

    // Create the specified number of bricks:
    for (let j = 0; j < bricksInRow && i < imageFilenames.length; j++, i++) {
      const brick = document.createElement('div');
      brick.classList.add('brick');
      
      const img = document.createElement('img');
      img.src = `assets/images/${imageFilenames[i]}`;
      img.alt = '';
      
      brick.appendChild(img);
      row.appendChild(brick);
    }
    
    gallery.appendChild(row);
    rowIndex++;
  }

  attachHoverFloatLogic();
}

// Initial fetch and render:
fetch('/assets/images/images.json')
  .then(res => res.json())
  .then(filenames => {
    imageFilenames = filenames;
    renderGallery();
  });

// Optionally, listen for window resize and rebuild if the breakpoint changes.
let currentPattern = getPattern();
window.addEventListener('resize', () => {
  const newPattern = getPattern();
  if (newPattern.toString() !== currentPattern.toString()) {
    currentPattern = newPattern;
    renderGallery();
    // You might want to trigger your modal hookup again here.
  }
});

// MODAL =============================================

const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImage');
  const modalClose = document.getElementById('modal-close');

  function updateModalImageSize() {
    const availableHeight = window.innerHeight * 0.8;
    modalImg.style.maxHeight = availableHeight + 'px';
    modalImg.style.maxWidth = '80vw';
  }

  // Open modal
document.querySelector('.gallery').addEventListener('click', (e) => {
  if (e.target.tagName === 'IMG' && e.target.closest('.brick')) {
    modalImg.src = e.target.src;
    modalImg.alt = e.target.alt;
    modal.classList.add('show');
    updateModalImageSize();
  }
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

  // FADE BRICKS ===============================
  const bricks = document.querySelectorAll('.brick');

});

const gallery = document.querySelector('.gallery');
let hoveringBrick = false;

// When entering a brick, add the class
gallery.addEventListener('mouseover', e => {
  if (e.target.closest('.brick')) {
    hoveringBrick = true;
    gallery.classList.add('hovering');
  }
});

// When leaving a brick, check if still over another brick
gallery.addEventListener('mouseout', e => {
  if (e.target.closest('.brick')) {
    // Delay slightly to allow for quick transitions between bricks
    setTimeout(() => {
      const isStillHovering = [...gallery.querySelectorAll('.brick')].some(brick =>
        brick.matches(':hover')
      );

      if (!isStillHovering) {
        hoveringBrick = false;
        gallery.classList.remove('hovering');
      }
    }, 10);
  }
});

// HAMBURGER MENU ========================================

const toggleBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

toggleBtn.addEventListener('click', () => {
  nav.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.site-nav').classList.remove('open');
  });
});

// IMAGE HOVER UP IF IT HITS BOTTOM OF GALLERY 
function attachHoverFloatLogic() {
  const gallery = document.querySelector('.gallery');

  document.querySelectorAll('.brick').forEach(brick => {
    const img = brick.querySelector('img');

    brick.addEventListener('mouseenter', () => {
      const brickRect = brick.getBoundingClientRect();
      const galleryRect = gallery.getBoundingClientRect();

      // Calculate natural image aspect ratio
      const naturalAspect = img.naturalHeight / img.naturalWidth;

      // Estimate what the zoomed height will be (respecting max-height: 90vh)
      const zoomedHeight = Math.min(window.innerHeight * 0.9, brick.offsetWidth * naturalAspect);

      // Predict where the bottom of the zoomed image will land
      const projectedBottom = brickRect.top + zoomedHeight;

      // Calculate overflow beyond the gallery container
      const overflow = projectedBottom - galleryRect.bottom;

      // Apply hover state
      brick.classList.add('hovering');

      // Reset transform styles first
      img.style.transform = '';
      img.style.transformOrigin = '';

      if (overflow > 0) {
        // Nudge upward by the overflow amount plus a small buffer
        img.style.transform = `translateY(-${overflow + 10}px) scale(1.05)`;
        img.style.transformOrigin = 'bottom center';
      } else {
        // Default zoom behaviour
        img.style.transform = 'scale(1.05)';
        img.style.transformOrigin = 'top center';
      }
    });

    brick.addEventListener('mouseleave', () => {
      brick.classList.remove('hovering');
      img.style.transform = '';
      img.style.transformOrigin = '';
    });
  });
}

});

