/* =============================================
   THAIVIVBES 2026 — JavaScript
   ============================================= */

'use strict';

// === NAVBAR SCROLL EFFECT ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// === HAMBURGER MENU ===
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
// Close on link click
mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// === HERO PARTICLES ===
function createParticles() {
  const container = document.getElementById('particles');
  const colors = ['#7c3aed', '#ec4899', '#f59e0b', '#06b6d4', '#10b981'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      --dur: ${6 + Math.random() * 8}s;
      --delay: ${-Math.random() * 10}s;
      box-shadow: 0 0 ${size * 3}px currentColor;
    `;
    container.appendChild(p);
  }
}
createParticles();

// Duplicate floating tags for seamless loop
const floatingTags = document.querySelector('.floating-tags');
if (floatingTags) {
  floatingTags.innerHTML += floatingTags.innerHTML;
}

// === FILTER TABS ===
const filterTabs = document.querySelectorAll('.filter-tab');
const destCards = document.querySelectorAll('.dest-card');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    destCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animationDelay = '0.05s';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// === CARD LIKES ===
const likeButtons = document.querySelectorAll('.card-like');
likeButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isLiked = btn.classList.toggle('liked');
    const icon = btn.querySelector('.like-icon');
    const countEl = btn.querySelector('.like-count');
    icon.textContent = isLiked ? '❤️' : '🤍';
    const current = parseFloat(countEl.textContent.replace('k', '')) * 1000;
    const newCount = isLiked ? current + 1 : current - 1;
    countEl.textContent = newCount >= 1000 ? (newCount / 1000).toFixed(1) + 'k' : newCount;
    btn.style.transform = 'scale(1.25)';
    setTimeout(() => btn.style.transform = '', 200);
  });
});

// === MODAL SYSTEM ===
const backdrop = document.getElementById('modalBackdrop');
let currentModal = null;

function openModal(id) {
  if (currentModal) closeModal();
  currentModal = document.getElementById('modal-' + id);
  if (currentModal) {
    backdrop.classList.add('open');
    currentModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  if (currentModal) {
    currentModal.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    currentModal = null;
  }
}

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Open modal on card click (excluding like/btn clicks)
destCards.forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('.card-like') || e.target.closest('.card-btn')) return;
    const id = card.id.replace('card-', '');
    openModal(id);
  });
});

// Expose to window
window.openModal = openModal;
window.closeModal = closeModal;

// === VIBE CARDS (vibes section) ===
document.querySelectorAll('.vibe-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('selected');
    showToast('✨ Vibe "' + card.querySelector('.vibe-title').textContent + '" đã được chọn!');
  });
});

// === TRIP PLANNER ===
let selectedVibe = null;
let peopleCount = 2;

// Counter buttons
document.getElementById('decreasePeople').addEventListener('click', () => {
  if (peopleCount > 1) {
    peopleCount--;
    document.getElementById('peopleCount').textContent = peopleCount;
  }
});
document.getElementById('increasePeople').addEventListener('click', () => {
  if (peopleCount < 20) {
    peopleCount++;
    document.getElementById('peopleCount').textContent = peopleCount;
  }
});

// Budget slider
const slider = document.getElementById('budgetSlider');
const budgetDisplay = document.getElementById('budgetDisplay');
slider.addEventListener('input', () => {
  const val = parseInt(slider.value);
  budgetDisplay.textContent = val.toLocaleString('vi-VN') + ' VNĐ';
  // Update gradient fill
  const percent = ((val - 500000) / (5000000 - 500000)) * 100;
  slider.style.background = `linear-gradient(to right, #7c3aed ${percent}%, rgba(255,255,255,0.1) ${percent}%)`;
});
// Init slider gradient
slider.dispatchEvent(new Event('input'));

// Vibe option selector (planner form)
document.querySelectorAll('.vibe-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.vibe-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedVibe = btn.dataset.v;
  });
});

// === FORM SUBMIT ===
document.getElementById('plannerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  generateItinerary();
});

function generateItinerary() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const budget = parseInt(slider.value);
  const vibe = selectedVibe || 'chill';
  const selectedDests = [...document.querySelectorAll('.dest-checkboxes input:checked')].map(c => c.value);

  if (!startDate || !endDate) {
    showToast('⚠️ Vui lòng chọn ngày đi và ngày về!');
    return;
  }
  if (selectedDests.length === 0) {
    showToast('⚠️ Vui lòng chọn ít nhất một điểm đến!');
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  if (days <= 0) {
    showToast('⚠️ Ngày về phải sau ngày đi!');
    return;
  }

  const itineraryData = buildItinerary(selectedDests, days, vibe, budget);
  renderItinerary(itineraryData, days, start, budget);
  showToast('🗺️ Itinerary đã được tạo! Cuộn xuống để xem.');
}

function buildItinerary(dests, days, vibe, budget) {
  const destInfo = {
    'bangkok': {
      name: '🏙️ Bangkok',
      activities: {
        morning: ['Khám phá Wat Pho & Grand Palace', 'Ăn sáng Chinatown', 'Thăm Wat Arun nhìn từ bờ sông'],
        afternoon: ['Mua sắm MBK / Siam Paragon', 'Khám phá Jim Thompson House', 'Ice cream tại Terminal 21'],
        evening: ['Jodd Fairs Night Market', 'Rooftop bar Lebua Sky Bar', 'Chinatown ăn hải sản đêm']
      }
    },
    'pai': {
      name: '🌿 Pai',
      activities: {
        morning: ['Bình minh tại Pai Canyon', 'Ăn sáng café view núi', 'Thăm Pai Land Split'],
        afternoon: ['Thuê xe máy dạo Pai Valley', 'Coffee in Motion café', 'Yun Lai Viewpoint mây'],
        evening: ['Pai Walking Street ăn uống', 'Hot Spring ban đêm', 'Fire show tại quán bar']
      }
    },
    'koh-lanta': {
      name: '🏖️ Koh Lanta',
      activities: {
        morning: ['Snorkeling Koh Ha islands', 'Long Beach sáng sớm', 'Kayak vào hang động'],
        afternoon: ['Mu Ko Lanta National Park', 'Lặn biển rạn san hô', 'Hammock trên bãi biển'],
        evening: ['Sunset tại Long Beach', 'BBQ seafood bãi biển', 'Chill bar view biển']
      }
    },
    'chiang-mai': {
      name: '⛰️ Chiang Mai',
      activities: {
        morning: ['Doi Inthanon summit', 'Royal Twin Pagodas', 'Wachirathan Waterfall'],
        afternoon: ['Old City temple hopping', 'Thai cooking class', 'Elephant Nature Park'],
        evening: ['Night Bazaar ăn sắm', 'Riverside restaurants', 'Muay Thai show']
      }
    },
    'khao-sok': {
      name: '🌊 Khao Sok',
      activities: {
        morning: ['Kayak hồ Cheow Larn sớm', 'Trekking rừng nguyên sinh', 'Ngắm vách đá karst từ bè'],
        afternoon: ['Cave exploration', 'Bơi hồ tự nhiên', 'Chèo thuyền'],
        evening: ['Ăn tối trên bè nổi', 'Bat cave hoàng hôn', 'Night jungle trek']
      }
    },
    'phuket': {
      name: '🌴 Phuket',
      activities: {
        morning: ['Promthep Cape sunrise', 'Old Town café & art', 'Phi Phi island day trip'],
        afternoon: ['Kata beach / Karon snorkel', 'Big Buddha viewpoint', 'Phuket Old Town walk'],
        evening: ['Sunset tại Promthep Cape', 'Beach club chilling', 'Bangla Road night life']
      }
    }
  };

  const result = [];
  const daysPerDest = Math.max(1, Math.floor(days / dests.length));
  let dayCount = 0;

  for (const dest of dests) {
    if (dayCount >= days) break;
    const info = destInfo[dest] || { name: dest, activities: { morning: ['Khám phá địa điểm'], afternoon: ['Tham quan'], evening: ['Ăn tối địa phương'] } };
    const numDays = Math.min(daysPerDest, days - dayCount);
    for (let d = 0; d < numDays; d++) {
      const activities = info.activities;
      result.push({
        dest: info.name,
        morning: activities.morning[d % activities.morning.length],
        afternoon: activities.afternoon[d % activities.afternoon.length],
        evening: activities.evening[d % activities.evening.length]
      });
      dayCount++;
    }
  }

  return result;
}

function renderItinerary(data, totalDays, startDate, budget) {
  const resultEl = document.getElementById('plannerResult');
  const totalBudget = budget * totalDays * peopleCount;
  let html = `
    <div class="itinerary-result">
      <div class="itin-header">
        <h3 class="itin-title">🗺️ Itinerary ${totalDays} Ngày</h3>
        <p class="itin-sub">
          👥 ${peopleCount} người · 💰 Tổng ~${totalBudget.toLocaleString('vi-VN')} VNĐ · ✈️ ${data.length} điểm đến
        </p>
      </div>
  `;

  data.forEach((day, idx) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + idx);
    const dateStr = date.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });

    html += `
      <div class="itin-day fade-in-up">
        <div class="itin-day-label">Ngày ${idx + 1} · ${dateStr} · ${day.dest}</div>
        <div class="itin-item">
          <div class="itin-time">🌅 Sáng</div>
          <div class="itin-act">${day.morning}<span>06:00 – 12:00</span></div>
        </div>
        <div class="itin-item">
          <div class="itin-time">☀️ Chiều</div>
          <div class="itin-act">${day.afternoon}<span>12:00 – 18:00</span></div>
        </div>
        <div class="itin-item">
          <div class="itin-time">🌙 Tối</div>
          <div class="itin-act">${day.evening}<span>18:00 – 22:00</span></div>
        </div>
      </div>
    `;
  });

  html += `
    <div style="margin-top:24px;padding:16px;background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.3);border-radius:12px;">
      <p style="font-size:0.82rem;color:#a855f7;font-weight:600;">💡 Tips: Book vé máy bay và khách sạn trước ít nhất 3 tuần. Mang theo kem chống nắng SPF 50+ và áo mưa nhỏ!</p>
    </div>
  `;

  html += '</div>';
  resultEl.innerHTML = html;

  // Trigger animations
  setTimeout(() => {
    resultEl.querySelectorAll('.fade-in-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 80);
    });
  }, 50);

  resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// === SCROLL REVEAL ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.dest-card, .vibe-card, .tip-card').forEach(el => {
  el.classList.add('fade-in-up');
  observer.observe(el);
});

// === TOAST NOTIFICATIONS ===
let toastTimeout;
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// === NAV CTA CLICK ===
document.getElementById('navCta').addEventListener('click', () => {
  document.getElementById('planner').scrollIntoView({ behavior: 'smooth' });
});

// === DATE DEFAULT VALUES ===
const today = new Date();
const nextMonth = new Date(today);
nextMonth.setMonth(today.getMonth() + 1);
const formatDate = d => d.toISOString().split('T')[0];
document.getElementById('startDate').value = formatDate(nextMonth);
const returnDate = new Date(nextMonth);
returnDate.setDate(returnDate.getDate() + 7);
document.getElementById('endDate').value = formatDate(returnDate);

// === CURSOR EFFECT (subtle) ===
const cursor = document.createElement('div');
cursor.style.cssText = `
  position: fixed; width: 20px; height: 20px;
  border: 2px solid rgba(168,85,247,0.6);
  border-radius: 50%; pointer-events: none; z-index: 9999;
  transform: translate(-50%, -50%);
  transition: transform 0.15s ease, opacity 0.2s;
  mix-blend-mode: screen;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('button, a, .dest-card, .vibe-card, .card-like').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    cursor.style.borderColor = 'rgba(245,158,11,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.borderColor = 'rgba(168,85,247,0.6)';
  });
});

console.log('🌴 ThaiVibes 2026 loaded! Let\'s goooo 🔥');
