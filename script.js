const cards = [...document.querySelectorAll('.gallery-card')];
const filterButtons = [...document.querySelectorAll('.filter-btn')];
const searchInput = document.getElementById('search-input');
const visibleCount = document.getElementById('visible-count');
const emptyState = document.getElementById('empty-state');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxLocation = document.getElementById('lightbox-location');
const lightboxCounter = document.getElementById('lightbox-counter');

let activeFilter = 'all';
let currentIndex = 0;
let visibleCards = [...cards];

function updateGallery() {
  const term = searchInput.value.trim().toLowerCase();
  visibleCards = cards.filter(card => {
    const categoryMatches = activeFilter === 'all' || card.dataset.category === activeFilter;
    const textMatches = `${card.dataset.title} ${card.dataset.location} ${card.dataset.category}`.toLowerCase().includes(term);
    const show = categoryMatches && textMatches;
    card.hidden = !show;
    return show;
  });
  visibleCount.textContent = visibleCards.length;
  emptyState.hidden = visibleCards.length !== 0;
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    updateGallery();
  });
});
searchInput.addEventListener('input', updateGallery);

function showImage(index) {
  if (!visibleCards.length) return;
  currentIndex = (index + visibleCards.length) % visibleCards.length;
  const card = visibleCards[currentIndex];
  const image = card.querySelector('img');
  lightboxImage.src = image.src.replace(/w=\d+/, 'w=1800');
  lightboxImage.alt = image.alt;
  lightboxTitle.textContent = card.dataset.title;
  lightboxLocation.textContent = card.dataset.location;
  lightboxCounter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(visibleCards.length).padStart(2, '0')}`;
}

function openLightbox(card) {
  visibleCards = cards.filter(item => !item.hidden);
  showImage(visibleCards.indexOf(card));
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('close-lightbox').focus();
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
cards.forEach(card => card.addEventListener('click', () => openLightbox(card)));
document.getElementById('close-lightbox').addEventListener('click', closeLightbox);
document.getElementById('previous-image').addEventListener('click', () => showImage(currentIndex - 1));
document.getElementById('next-image').addEventListener('click', () => showImage(currentIndex + 1));

document.addEventListener('keydown', event => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
  if (event.key === 'ArrowRight') showImage(currentIndex + 1);
});
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});
updateGallery();
