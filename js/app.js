// Navigation
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const section = document.getElementById(id);
  if (section) section.classList.add('active');
  const link = document.querySelector(`.nav-link[data-section="${id}"]`);
  if (link) link.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Close mobile menu
  document.getElementById('mainNav').classList.remove('open');
}

// Mobile menu
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('mainNav').classList.toggle('open');
});

// Exam state
let revealed = new Set();
let currentFilter = 'all';

function renderQuestions(filter = 'all') {
  currentFilter = filter;
  const container = document.getElementById('questionsContainer');
  const filtered = filter === 'all' ? questions : questions.filter(q => q.cat === filter);
  
  container.innerHTML = filtered.map(q => `
    <div class="question-card ${revealed.has(q.id) ? 'revealed' : ''}" data-id="${q.id}" data-cat="${q.cat}">
      <div class="question-header" onclick="toggleAnswer(${q.id})">
        <span class="q-num">${q.id}</span>
        <span class="q-text">${q.q}</span>
        <span class="q-cat">${q.cat}</span>
      </div>
      <div class="answer-panel">
        <div class="answer-content">
          <strong>Answer:</strong> ${q.a}
          <div class="answer-bn"><strong>বাংলা:</strong> ${q.bn}</div>
        </div>
      </div>
    </div>
  `).join('');
  
  updateScore();
}

function toggleAnswer(id) {
  const card = document.querySelector(`.question-card[data-id="${id}"]`);
  if (!card) return;
  if (revealed.has(id)) {
    revealed.delete(id);
    card.classList.remove('revealed');
  } else {
    revealed.add(id);
    card.classList.add('revealed');
  }
  updateScore();
}

function updateScore() {
  document.getElementById('answeredCount').textContent = revealed.size;
  document.getElementById('scoreCount').textContent = revealed.size;
}

function resetExam() {
  revealed.clear();
  renderQuestions(currentFilter);
}

function showAllAnswers() {
  const filtered = currentFilter === 'all' ? questions : questions.filter(q => q.cat === currentFilter);
  filtered.forEach(q => revealed.add(q.id));
  renderQuestions(currentFilter);
}

function hideAllAnswers() {
  revealed.clear();
  renderQuestions(currentFilter);
}

// Filter tabs
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderQuestions(btn.dataset.filter);
  });
});

// Initial render
renderQuestions();

// PWA Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW reg failed:', err));
  });
}
