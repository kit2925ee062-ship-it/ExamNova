/**
 * ExamNova Core Application Logic
 */

let appState = {
  currentView: 'view-login',
  currentRole: 'student', // 'student' or 'teacher'
  user: null,
  activeExam: null,
  currentQuestionIndex: 0,
  userAnswers: {}, // { [questionId]: optionIndex }
  markedForReview: {}, // { [questionId]: boolean }
  timerInterval: null,
  timeRemainingSeconds: 0,
  timeElapsedSeconds: 0,
  lastResultData: null,
  charts: {
    studentProgress: null,
    teacherPerformance: null,
    resultRing: null
  }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  const store = getStore();
  appState.user = store.currentUser;
  updateTopBarUser();
  renderAvailableTests();
  renderExamHistory();
  renderTeacherDashboardData();

  // Start at Login view by default (matching slide 1)
  navigateTo('view-login');
}

/* ==========================================
   NAVIGATION & VIEW ROUTING
   ========================================== */
function navigateTo(viewId) {
  // If leaving active exam with timer running, pause timer check
  if (appState.currentView === 'view-exam-attempt' && viewId !== 'view-exam-attempt') {
    clearInterval(appState.timerInterval);
  }

  // Hide all views
  const views = document.querySelectorAll('.app-view');
  views.forEach(v => v.classList.add('hidden'));

  // Show target view
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.remove('hidden');
    appState.currentView = viewId;
  }

  // Highlight active nav pill
  updateNavPillHighlights(viewId);

  // If navigating to student dashboard, render/refresh charts
  if (viewId === 'view-student-dashboard') {
    setTimeout(initStudentProgressChart, 100);
    renderAvailableTests();
  } else if (viewId === 'view-teacher-dashboard') {
    setTimeout(initTeacherPerformanceChart, 100);
    renderTeacherDashboardData();
  } else if (viewId === 'view-history-profile') {
    renderExamHistory();
    updateProfileCards();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNavPillHighlights(viewId) {
  const pills = document.querySelectorAll('.nav-pill');
  pills.forEach(p => {
    p.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm');
    p.classList.add('bg-indigo-950/60', 'text-slate-200');
  });

  const viewIndexMap = {
    'view-login': 0,
    'view-student-dashboard': 1,
    'view-teacher-dashboard': 2,
    'view-exam-attempt': 3,
    'view-results': 4,
    'view-history-profile': 5
  };

  const activeIdx = viewIndexMap[viewId];
  if (activeIdx !== undefined && pills[activeIdx]) {
    pills[activeIdx].classList.remove('bg-indigo-950/60', 'text-slate-200');
    pills[activeIdx].classList.add('bg-indigo-600', 'text-white', 'shadow-sm');
  }
}

function goToHome() {
  if (appState.currentRole === 'teacher') {
    navigateTo('view-teacher-dashboard');
  } else {
    navigateTo('view-student-dashboard');
  }
}

function switchRoleAndNavigate(role, viewId) {
  const store = getStore();
  if (role === 'teacher') {
    appState.currentRole = 'teacher';
    appState.user = store.teacherUser;
  } else {
    appState.currentRole = 'student';
    appState.user = store.currentUser;
  }
  updateTopBarUser();
  navigateTo(viewId);
  showToast(`Switched view to ${role === 'teacher' ? 'Teacher Dashboard' : 'Student Dashboard'}`, 'info');
}

function updateTopBarUser() {
  const avatarEl = document.getElementById('topbar-avatar');
  const nameEl = document.getElementById('topbar-username');
  const roleEl = document.getElementById('topbar-role');

  if (avatarEl && nameEl && roleEl && appState.user) {
    avatarEl.textContent = appState.user.avatar || appState.user.name.charAt(0);
    nameEl.textContent = appState.user.name;
    roleEl.textContent = appState.user.role;
  }

  const studentGreetingName = document.getElementById('student-greeting-name');
  if (studentGreetingName && appState.user) {
    studentGreetingName.textContent = appState.user.name;
  }
}

/* ==========================================
   VIEW 1: AUTHENTICATION / LOGIN
   ========================================== */
function setLoginRole(role) {
  const studentBtn = document.getElementById('login-role-student-btn');
  const teacherBtn = document.getElementById('login-role-teacher-btn');
  const nameInput = document.getElementById('login-name');
  const emailInput = document.getElementById('login-email');

  if (role === 'student') {
    studentBtn.className = "flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition bg-indigo-600 text-white shadow-sm flex items-center justify-center space-x-2";
    teacherBtn.className = "flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition text-slate-600 hover:text-slate-900 flex items-center justify-center space-x-2";
    nameInput.value = "John";
    emailInput.value = "john123@gmail.com";
  } else {
    teacherBtn.className = "flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition bg-purple-600 text-white shadow-sm flex items-center justify-center space-x-2";
    studentBtn.className = "flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition text-slate-600 hover:text-slate-900 flex items-center justify-center space-x-2";
    nameInput.value = "Prof. Anderson";
    emailInput.value = "robert.anderson@examnova.edu";
  }
}

function togglePasswordVisibility() {
  const pwdInput = document.getElementById('login-password');
  const icon = document.getElementById('password-toggle-icon');
  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    pwdInput.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

function quickFillAndLogin(role) {
  setLoginRole(role);
  setTimeout(() => {
    performLogin(role);
  }, 150);
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const studentBtn = document.getElementById('login-role-student-btn');
  const isStudent = studentBtn.classList.contains('bg-indigo-600');
  performLogin(isStudent ? 'student' : 'teacher');
}

function performLogin(role) {
  const store = getStore();
  const nameVal = document.getElementById('login-name').value;
  const emailVal = document.getElementById('login-email').value;

  if (role === 'teacher') {
    appState.currentRole = 'teacher';
    appState.user = {
      ...store.teacherUser,
      name: nameVal || store.teacherUser.name,
      email: emailVal || store.teacherUser.email
    };
    updateTopBarUser();
    navigateTo('view-teacher-dashboard');
    showToast(`Welcome Professor ${appState.user.name}!`, 'success');
  } else {
    appState.currentRole = 'student';
    appState.user = {
      ...store.currentUser,
      name: nameVal || store.currentUser.name,
      email: emailVal || store.currentUser.email
    };
    updateTopBarUser();
    navigateTo('view-student-dashboard');
    showToast(`Welcome back, ${appState.user.name}!`, 'success');
  }
}

/* Native Canvas Chart Fallbacks for 100% Offline / No-CDN Resilience */
function drawFallbackDoughnut(canvas, percent, color) {
  try {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 144;
    const h = canvas.height = 144;
    const x = w / 2;
    const y = h / 2;
    const radius = 54;
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 14;
    ctx.stroke();
    ctx.beginPath();
    const startAngle = -0.5 * Math.PI;
    const endAngle = startAngle + (2 * Math.PI * (percent / 100));
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.strokeStyle = color || '#4F46E5';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.stroke();
  } catch (e) {
    console.warn('Canvas draw failed:', e);
  }
}

function drawFallbackBarChart(canvas) {
  try {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth || 400 : 400;
    const h = canvas.height = 240;
    ctx.clearRect(0, 0, w, h);
    const data = [
      { label: 'Math', val: 82, col: '#6366F1' },
      { label: 'Science', val: 74, col: '#38BDF8' },
      { label: 'English', val: 88, col: '#818CF8' },
      { label: 'Social', val: 65, col: '#A855F7' },
      { label: 'Computer', val: 90, col: '#4F46E5' }
    ];
    const barWidth = 36;
    const gap = (w - (data.length * barWidth)) / (data.length + 1);
    const bottom = h - 30;
    data.forEach((d, i) => {
      const x = gap + i * (barWidth + gap);
      const barH = (d.val / 100) * (bottom - 20);
      const y = bottom - barH;
      ctx.fillStyle = d.col;
      ctx.fillRect(x, y, barWidth, barH);
      ctx.fillStyle = '#64748B';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, x + barWidth / 2, bottom + 16);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(d.val + '%', x + barWidth / 2, y - 6);
    });
  } catch (e) {
    console.warn('Bar draw failed:', e);
  }
}

/* ==========================================
   VIEW 2: STUDENT DASHBOARD
   ========================================== */
function initStudentProgressChart() {
  const canvas = document.getElementById('studentProgressChart');
  if (!canvas) return;

  if (typeof Chart === 'undefined') {
    drawFallbackDoughnut(canvas, 60, '#4F46E5');
    return;
  }

  if (appState.charts.studentProgress) {
    appState.charts.studentProgress.destroy();
  }

  const ctx = canvas.getContext('2d');
  appState.charts.studentProgress = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'In Progress', 'Not Started'],
      datasets: [{
        data: [3, 1, 1],
        backgroundColor: ['#4F46E5', '#38BDF8', '#E2E8F0'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '76%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return ` ${context.label}: ${context.raw} tests`;
            }
          }
        }
      }
    }
  });
}

function renderAvailableTests() {
  const store = getStore();
  const grid = document.getElementById('available-tests-grid');
  if (!grid) return;

  grid.innerHTML = '';

  store.exams.forEach(exam => {
    const qCount = exam.questions.length;
    let iconClass = 'fa-calculator';
    let gradientBg = 'from-indigo-50 to-blue-50';
    let iconColor = 'text-indigo-600 bg-indigo-100';

    if (exam.subject.toLowerCase().includes('science')) {
      iconClass = 'fa-flask-vial';
      iconColor = 'text-emerald-600 bg-emerald-100';
    } else if (exam.subject.toLowerCase().includes('english')) {
      iconClass = 'fa-book-open';
      iconColor = 'text-purple-600 bg-purple-100';
    } else if (exam.subject.toLowerCase().includes('computer') || exam.subject.toLowerCase().includes('intelligence')) {
      iconClass = 'fa-microchip';
      iconColor = 'text-blue-600 bg-blue-100';
    }

    const card = document.createElement('div');
    card.className = "bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between";
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl ${iconColor} flex items-center justify-center text-xl">
            <i class="fa-solid ${iconClass}"></i>
          </div>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            ${exam.durationMinutes} Mins
          </span>
        </div>

        <h4 class="text-base font-bold text-slate-900 font-heading mb-1">${exam.title}</h4>
        <p class="text-xs text-slate-500 mb-4">${exam.description || 'Test covering key fundamental concepts.'}</p>
        
        <div class="flex items-center space-x-3 text-xs text-slate-600 font-medium mb-6">
          <span class="flex items-center"><i class="fa-regular fa-circle-question mr-1 text-slate-400"></i> ${qCount} Questions</span>
          <span>•</span>
          <span class="flex items-center"><i class="fa-regular fa-star mr-1 text-amber-500"></i> ${exam.totalMarks} Marks</span>
        </div>
      </div>

      <button onclick="launchExamById('${exam.id}')" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center justify-center space-x-2">
        <span>Start Test</span>
        <i class="fa-solid fa-play text-xs"></i>
      </button>
    `;
    grid.appendChild(card);
  });
}

/* ==========================================
   VIEW 3: TEACHER DASHBOARD
   ========================================== */
function initTeacherPerformanceChart() {
  const canvas = document.getElementById('teacherPerformanceChart');
  if (!canvas) return;

  if (typeof Chart === 'undefined') {
    drawFallbackBarChart(canvas);
    return;
  }

  if (appState.charts.teacherPerformance) {
    appState.charts.teacherPerformance.destroy();
  }

  const ctx = canvas.getContext('2d');
  appState.charts.teacherPerformance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Math', 'Science', 'English', 'Social', 'Computer'],
      datasets: [{
        label: 'Average Score (%)',
        data: [82, 74, 88, 65, 90],
        backgroundColor: [
          '#6366F1',
          '#38BDF8',
          '#818CF8',
          '#A855F7',
          '#4F46E5'
        ],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: '#F1F5F9' },
          ticks: { callback: v => v + '%' }
        },
        x: {
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: context => ` Class Average: ${context.raw}%`
          }
        }
      }
    }
  });
}

function renderTeacherDashboardData() {
  const store = getStore();

  // Stats
  const examsCountEl = document.getElementById('teacher-stat-exams');
  if (examsCountEl) examsCountEl.textContent = store.exams.length;

  // Activities
  const actList = document.getElementById('teacher-activities-list');
  if (actList) {
    actList.innerHTML = '';
    store.recentActivities.forEach(item => {
      let icon = 'fa-check text-emerald-500 bg-emerald-50';
      if (item.type === 'created') icon = 'fa-plus text-indigo-500 bg-indigo-50';
      if (item.type === 'score') icon = 'fa-trophy text-amber-500 bg-amber-50';
      if (item.type === 'student') icon = 'fa-user-plus text-blue-500 bg-blue-50';

      const div = document.createElement('div');
      div.className = "flex items-start space-x-3";
      div.innerHTML = `
        <div class="w-8 h-8 rounded-full ${icon} flex items-center justify-center text-xs shrink-0 mt-0.5">
          <i class="fa-solid ${icon.split(' ')[0]}"></i>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-slate-800 truncate">${item.text}</p>
          <p class="text-[10px] text-slate-400">${item.time}</p>
        </div>
      `;
      actList.appendChild(div);
    });
  }

  // Upcoming events table
  const eventsTbody = document.getElementById('teacher-events-tbody');
  if (eventsTbody) {
    eventsTbody.innerHTML = '';
    store.upcomingEvents.forEach(evt => {
      const tr = document.createElement('tr');
      tr.className = "hover:bg-slate-50/50 transition";
      const statusBadge = evt.status === 'Upcoming' 
        ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Upcoming</span>`
        : `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">Scheduled</span>`;

      tr.innerHTML = `
        <td class="py-3 px-4 font-semibold text-slate-900">${evt.examName}</td>
        <td class="py-3 px-4 text-slate-600">${evt.subject}</td>
        <td class="py-3 px-4 text-slate-500">${evt.dateTime}</td>
        <td class="py-3 px-4">${statusBadge}</td>
        <td class="py-3 px-4 text-right">
          <button onclick="alert('Exam settings for ${evt.examName}')" class="text-slate-400 hover:text-indigo-600 transition">
            <i class="fa-solid fa-ellipsis"></i>
          </button>
        </td>
      `;
      eventsTbody.appendChild(tr);
    });
  }

  // Submissions evaluation table
  const subTbody = document.getElementById('teacher-submissions-tbody');
  const subCount = document.getElementById('teacher-submissions-count');
  if (subTbody && store.studentSubmissions) {
    subTbody.innerHTML = '';
    if (subCount) subCount.textContent = store.studentSubmissions.length;

    store.studentSubmissions.forEach(sub => {
      const tr = document.createElement('tr');
      tr.className = "hover:bg-slate-50 transition";
      tr.innerHTML = `
        <td class="py-3 px-4 font-semibold text-slate-900">
          <div>${sub.studentName}</div>
          <div class="text-[10px] text-slate-400 font-normal">${sub.studentEmail}</div>
        </td>
        <td class="py-3 px-4 text-slate-600">${sub.studentClass || 'Class 10 A'}</td>
        <td class="py-3 px-4 font-medium text-slate-800">${sub.examTitle}</td>
        <td class="py-3 px-4 text-slate-600">${sub.subject}</td>
        <td class="py-3 px-4 font-bold text-indigo-700">${sub.score} / ${sub.totalMarks}</td>
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${sub.percentage >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
            ${sub.percentage}%
          </span>
        </td>
        <td class="py-3 px-4 text-slate-400 text-xs">${sub.submittedAt}</td>
        <td class="py-3 px-4 text-center">
          <button onclick="openTeacherInspectModal('${sub.id}')" class="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition">
            <i class="fa-regular fa-eye mr-1"></i> Review
          </button>
        </td>
      `;
      subTbody.appendChild(tr);
    });
  }
}

function scrollToTeacherSubmissions() {
  const section = document.getElementById('teacher-submissions-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

function openTeacherInspectModal(submissionId) {
  const store = getStore();
  const sub = store.studentSubmissions.find(s => s.id === submissionId);
  if (!sub) return;

  document.getElementById('inspect-student-subtitle').textContent = `${sub.studentName} • ${sub.examTitle}`;
  document.getElementById('inspect-score').textContent = `${sub.score} / ${sub.totalMarks}`;
  document.getElementById('inspect-percentage').textContent = `${sub.percentage}%`;

  openModal('modal-teacher-inspect');
}

function saveTeacherEvaluation() {
  closeModal('modal-teacher-inspect');
  showToast('Evaluation remarks saved and grade slip dispatched!', 'success');
}

function printCertificate() {
  window.print();
}

/* ==========================================
   VIEW 4: EXAM ATTEMPT (Questions + Timer)
   ========================================= */
function launchExamById(examId) {
  const store = getStore();
  const exam = store.exams.find(e => e.id === examId) || store.exams[0];

  appState.activeExam = exam;
  appState.currentQuestionIndex = 0;
  appState.userAnswers = {};
  appState.markedForReview = {};
  appState.timeElapsedSeconds = 0;
  appState.timeRemainingSeconds = exam.durationMinutes * 60;

  // Set titles
  document.getElementById('exam-attempt-title').textContent = exam.title;
  document.getElementById('exam-attempt-subject').textContent = exam.subject;
  document.getElementById('exam-attempt-qcount').textContent = `${exam.questions.length} Questions`;
  document.getElementById('exam-attempt-totalmarks').textContent = `${exam.totalMarks} Marks`;

  // Start timer
  startExamTimer();

  // Render question and palette
  renderCurrentQuestion();
  renderQuestionPalette();

  navigateTo('view-exam-attempt');
}

function quickStartDemoExam() {
  launchExamById('exam_math');
}

function startExamTimer() {
  clearInterval(appState.timerInterval);
  updateTimerDisplay();

  appState.timerInterval = setInterval(() => {
    appState.timeRemainingSeconds--;
    appState.timeElapsedSeconds++;
    updateTimerDisplay();

    if (appState.timeRemainingSeconds <= 0) {
      clearInterval(appState.timerInterval);
      showToast('Time is up! Submitting exam automatically...', 'warning');
      finalizeExamSubmission();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const display = document.getElementById('exam-timer-display');
  if (!display) return;

  const totalSec = Math.max(0, appState.timeRemainingSeconds);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const pad = n => String(n).padStart(2, '0');
  display.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function renderCurrentQuestion() {
  if (!appState.activeExam) return;

  const questions = appState.activeExam.questions;
  const currentQ = questions[appState.currentQuestionIndex];
  const qNum = appState.currentQuestionIndex + 1;

  // Update badges & counters
  document.getElementById('question-number-badge').textContent = `Question ${qNum} of ${questions.length}`;
  document.getElementById('question-topic-badge').textContent = currentQ.topic || 'General';
  document.getElementById('question-marks-badge').textContent = `+${currentQ.marks || 2} Marks`;
  document.getElementById('nav-counter-display').textContent = `${qNum} / ${questions.length}`;
  document.getElementById('current-question-text').textContent = currentQ.question;

  // Render options (A, B, C, D)
  const optContainer = document.getElementById('current-options-container');
  optContainer.innerHTML = '';

  const labels = ['A', 'B', 'C', 'D', 'E'];
  const selectedAnswer = appState.userAnswers[currentQ.id];

  currentQ.options.forEach((optText, idx) => {
    const isSelected = selectedAnswer === idx;
    const optDiv = document.createElement('div');
    optDiv.className = `quiz-option p-4 rounded-xl border ${isSelected ? 'selected' : 'border-slate-200 bg-white'} flex items-center space-x-3.5`;
    optDiv.onclick = () => selectOptionForCurrentQuestion(idx);

    optDiv.innerHTML = `
      <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}">
        ${labels[idx]}
      </div>
      <div class="text-sm font-medium ${isSelected ? 'text-indigo-900 font-semibold' : 'text-slate-800'}">
        ${optText}
      </div>
    `;
    optContainer.appendChild(optDiv);
  });

  // Review button state
  const isMarked = !!appState.markedForReview[currentQ.id];
  const revBtn = document.getElementById('btn-toggle-review');
  if (revBtn) {
    if (isMarked) {
      revBtn.className = "w-full py-2 px-3 border border-amber-400 bg-amber-500 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5";
      revBtn.innerHTML = `<i class="fa-solid fa-star"></i><span>Marked for Revision</span>`;
    } else {
      revBtn.className = "w-full py-2 px-3 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5";
      revBtn.innerHTML = `<i class="fa-regular fa-star"></i><span>Save for Revision</span>`;
    }
  }

  renderQuestionPalette();
}

function selectOptionForCurrentQuestion(optIndex) {
  if (!appState.activeExam) return;
  const currentQ = appState.activeExam.questions[appState.currentQuestionIndex];
  appState.userAnswers[currentQ.id] = optIndex;
  renderCurrentQuestion();
}

function renderQuestionPalette() {
  if (!appState.activeExam) return;

  const grid = document.getElementById('question-palette-grid');
  if (!grid) return;

  grid.innerHTML = '';
  const questions = appState.activeExam.questions;
  let answeredCount = 0;
  let markedCount = 0;

  questions.forEach((q, idx) => {
    const isAnswered = appState.userAnswers[q.id] !== undefined;
    const isCurrent = idx === appState.currentQuestionIndex;
    const isMarked = !!appState.markedForReview[q.id];

    if (isAnswered) answeredCount++;
    if (isMarked) markedCount++;

    let styleClass = 'palette-unanswered';
    if (isMarked) {
      styleClass = 'palette-review';
    } else if (isCurrent) {
      styleClass = 'palette-current';
    } else if (isAnswered) {
      styleClass = 'palette-answered';
    }

    const btn = document.createElement('button');
    btn.className = `palette-btn ${styleClass}`;
    btn.textContent = idx + 1;
    btn.onclick = () => jumpToQuestionIndex(idx);
    grid.appendChild(btn);
  });

  const unansweredCount = questions.length - answeredCount;
  document.getElementById('count-answered').textContent = answeredCount;
  document.getElementById('count-unanswered').textContent = unansweredCount;
  document.getElementById('count-marked').textContent = markedCount;
}

function jumpToQuestionIndex(idx) {
  if (!appState.activeExam) return;
  if (idx >= 0 && idx < appState.activeExam.questions.length) {
    appState.currentQuestionIndex = idx;
    renderCurrentQuestion();
  }
}

function goToFirstQuestion() {
  jumpToQuestionIndex(0);
}

function goToLastQuestion() {
  if (!appState.activeExam) return;
  jumpToQuestionIndex(appState.activeExam.questions.length - 1);
}

function goToNextQuestion() {
  if (!appState.activeExam) return;
  if (appState.currentQuestionIndex < appState.activeExam.questions.length - 1) {
    jumpToQuestionIndex(appState.currentQuestionIndex + 1);
  } else {
    showToast('You are on the last question!', 'info');
  }
}

function goToPreviousQuestion() {
  if (appState.currentQuestionIndex > 0) {
    jumpToQuestionIndex(appState.currentQuestionIndex - 1);
  }
}

function jumpToFirstUnanswered() {
  if (!appState.activeExam) return;
  const questions = appState.activeExam.questions;
  const unansweredIdx = questions.findIndex(q => appState.userAnswers[q.id] === undefined);
  if (unansweredIdx !== -1) {
    jumpToQuestionIndex(unansweredIdx);
  } else {
    showToast('All questions have been answered!', 'success');
  }
}

function toggleCurrentReview() {
  if (!appState.activeExam) return;
  const currentQ = appState.activeExam.questions[appState.currentQuestionIndex];
  appState.markedForReview[currentQ.id] = !appState.markedForReview[currentQ.id];
  renderCurrentQuestion();
}

function confirmExitExam() {
  if (confirm('Are you sure you want to exit the exam? Your current progress will not be submitted.')) {
    clearInterval(appState.timerInterval);
    navigateTo('view-student-dashboard');
  }
}

function openSubmitModal() {
  if (!appState.activeExam) return;
  const questions = appState.activeExam.questions;
  let answered = 0;
  questions.forEach(q => {
    if (appState.userAnswers[q.id] !== undefined) answered++;
  });
  const unanswered = questions.length - answered;

  document.getElementById('confirm-modal-answered').textContent = `${answered} Questions`;
  document.getElementById('confirm-modal-unanswered').textContent = `${unanswered} Questions`;

  openModal('modal-submit-confirm');
}

function finalizeExamSubmission() {
  closeModal('modal-submit-confirm');
  clearInterval(appState.timerInterval);

  const exam = appState.activeExam;
  const questions = exam.questions;
  let correctCount = 0;
  let scoreObtained = 0;

  questions.forEach(q => {
    const userChoice = appState.userAnswers[q.id];
    if (userChoice !== undefined && userChoice === q.correctIndex) {
      correctCount++;
      scoreObtained += (q.marks || 2);
    }
  });

  const totalQuestions = questions.length;
  const wrongCount = totalQuestions - correctCount;
  const percentage = Math.round((scoreObtained / exam.totalMarks) * 100);

  const timeMins = Math.floor(appState.timeElapsedSeconds / 60);
  const timeSecs = appState.timeElapsedSeconds % 60;
  const pad = n => String(n).padStart(2, '0');
  const timeTakenStr = `${pad(timeMins)}:${pad(timeSecs)}`;

  const resultData = {
    examId: exam.id,
    examTitle: exam.title,
    subject: exam.subject,
    correctCount,
    wrongCount,
    totalQuestions,
    scoreObtained,
    totalMarks: exam.totalMarks,
    percentage,
    timeTaken: timeTakenStr,
    timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  appState.lastResultData = resultData;

  // Persist to store history & teacher submissions
  const store = getStore();
  store.examHistory.unshift({
    id: 'hist_' + Date.now(),
    examId: exam.id,
    testName: exam.title,
    subject: exam.subject,
    date: resultData.timestamp,
    score: scoreObtained,
    totalMarks: exam.totalMarks,
    percentage,
    status: percentage >= 50 ? 'Passed' : 'Failed',
    timeTaken: timeTakenStr
  });

  store.studentSubmissions.unshift({
    id: 'sub_' + Date.now(),
    studentName: appState.user.name || 'John Doe',
    studentEmail: appState.user.email || 'john123@gmail.com',
    studentClass: appState.user.class || 'Class 10 A',
    examTitle: exam.title,
    subject: exam.subject,
    score: scoreObtained,
    totalMarks: exam.totalMarks,
    percentage,
    submittedAt: 'Just now',
    status: 'Evaluated'
  });

  saveStore(store);

  renderResultsView(resultData);
  navigateTo('view-results');
}

/* ==========================================
   VIEW 5: RESULTS PAGE
   ========================================== */
function quickViewResults() {
  if (!appState.lastResultData) {
    // Default preview matching mockup
    appState.lastResultData = {
      examTitle: 'Mathematics Quiz',
      subject: 'Mathematics',
      correctCount: 8,
      wrongCount: 2,
      totalQuestions: 10,
      scoreObtained: 17,
      totalMarks: 20,
      percentage: 85,
      timeTaken: '08:42'
    };
  }
  renderResultsView(appState.lastResultData);
  navigateTo('view-results');
}

function renderResultsView(res) {
  document.getElementById('results-student-name').textContent = appState.user.name || 'John';
  document.getElementById('results-score-percent').textContent = `${res.percentage}%`;
  document.getElementById('results-correct-count').textContent = `${res.correctCount} / ${res.totalQuestions}`;
  document.getElementById('results-wrong-count').textContent = `${res.wrongCount} / ${res.totalQuestions}`;
  document.getElementById('results-total-marks').textContent = `${res.scoreObtained} / ${res.totalMarks}`;
  document.getElementById('results-time-taken').textContent = res.timeTaken;

  const statusBadge = document.getElementById('results-pass-status');
  if (res.percentage >= 75) {
    statusBadge.textContent = 'Passed with Distinction';
    statusBadge.className = 'mt-4 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700';
  } else if (res.percentage >= 50) {
    statusBadge.textContent = 'Passed';
    statusBadge.className = 'mt-4 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700';
  } else {
    statusBadge.textContent = 'Needs Improvement';
    statusBadge.className = 'mt-4 px-3.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700';
  }

  // Trigger Confetti!
  try {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  } catch (e) {
    console.log('Confetti effect triggered');
  }

  // Init Score Ring Chart
  setTimeout(() => {
    initResultRingChart(res.percentage);
  }, 100);
}

function initResultRingChart(percentage) {
  const canvas = document.getElementById('resultScoreRing');
  if (!canvas) return;

  if (typeof Chart === 'undefined') {
    drawFallbackDoughnut(canvas, percentage, '#10B981');
    return;
  }

  if (appState.charts.resultRing) {
    appState.charts.resultRing.destroy();
  }

  const ctx = canvas.getContext('2d');
  const remaining = 100 - percentage;
  appState.charts.resultRing = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [percentage, remaining],
        backgroundColor: ['#10B981', '#E2E8F0'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '80%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });
}

function openSolutionReviewModal() {
  const store = getStore();
  const exam = appState.activeExam || store.exams[0];
  const container = document.getElementById('solutions-list-container');
  if (!container) return;

  container.innerHTML = '';
  const labels = ['A', 'B', 'C', 'D'];

  exam.questions.forEach((q, idx) => {
    const userChoice = appState.userAnswers[q.id];
    const isCorrect = userChoice === q.correctIndex;
    const isUnanswered = userChoice === undefined;

    const div = document.createElement('div');
    div.className = "p-4 rounded-2xl border border-slate-100 bg-slate-50/70";
    
    let statusPill = isCorrect 
      ? `<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700"><i class="fa-solid fa-check mr-1"></i> Correct</span>`
      : isUnanswered
        ? `<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700"><i class="fa-solid fa-minus mr-1"></i> Not Attempted</span>`
        : `<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700"><i class="fa-solid fa-xmark mr-1"></i> Incorrect</span>`;

    let optionsHtml = q.options.map((opt, optIdx) => {
      let optClass = 'bg-white border-slate-200 text-slate-700';
      if (optIdx === q.correctIndex) {
        optClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
      } else if (optIdx === userChoice && !isCorrect) {
        optClass = 'bg-rose-50 border-rose-400 text-rose-900';
      }

      return `
        <div class="p-2.5 rounded-xl border ${optClass} text-xs flex items-center justify-between">
          <span><strong class="mr-2">${labels[optIdx]}.</strong> ${opt}</span>
          ${optIdx === q.correctIndex ? '<span class="text-[10px] font-bold text-emerald-700">Correct Answer</span>' : ''}
          ${optIdx === userChoice && !isCorrect ? '<span class="text-[10px] font-bold text-rose-700">Your Answer</span>' : ''}
        </div>
      `;
    }).join('');

    div.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-bold text-slate-700">Question ${idx + 1} (${q.topic || 'General'})</span>
        ${statusPill}
      </div>
      <p class="text-sm font-semibold text-slate-900 mb-3">${q.question}</p>
      <div class="space-y-2 mb-3">
        ${optionsHtml}
      </div>
      ${q.explanation ? `
        <div class="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900">
          <strong><i class="fa-solid fa-lightbulb text-amber-500 mr-1"></i> Explanation:</strong> ${q.explanation}
        </div>
      ` : ''}
    `;

    container.appendChild(div);
  });

  openModal('modal-solutions-review');
}

/* ==========================================
   VIEW 6: EXAM HISTORY & PROFILE
   ========================================== */
function renderExamHistory() {
  const store = getStore();
  const tbody = document.getElementById('exam-history-tbody');
  const countEl = document.getElementById('history-total-count');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (countEl) countEl.textContent = store.examHistory.length;

  store.examHistory.forEach((item, idx) => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50 transition";
    tr.innerHTML = `
      <td class="py-3 px-4 font-bold text-slate-400">${idx + 1}</td>
      <td class="py-3 px-4 font-semibold text-slate-900">${item.testName}</td>
      <td class="py-3 px-4 text-slate-600">${item.subject}</td>
      <td class="py-3 px-4 text-slate-500">${item.date}</td>
      <td class="py-3 px-4 font-bold text-indigo-700">${item.score}/${item.totalMarks}</td>
      <td class="py-3 px-4 font-bold ${item.percentage >= 75 ? 'text-emerald-600' : 'text-amber-600'}">${item.percentage}%</td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'Passed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">
          ${item.status}
        </span>
      </td>
      <td class="py-3 px-4 text-center">
        <button onclick="previewHistoryDetail('${item.examId}')" class="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition">
          View Result
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function previewHistoryDetail(examId) {
  const store = getStore();
  const exam = store.exams.find(e => e.id === examId) || store.exams[0];
  appState.activeExam = exam;
  openSolutionReviewModal();
}

function updateProfileCards() {
  const store = getStore();
  const user = store.currentUser;

  const cardAvatar = document.getElementById('profile-card-avatar');
  const cardName = document.getElementById('profile-card-name');
  const cardEmail = document.getElementById('profile-card-email');

  if (cardAvatar) cardAvatar.textContent = user.avatar || user.name.charAt(0);
  if (cardName) cardName.textContent = user.fullName || user.name;
  if (cardEmail) cardEmail.textContent = user.email;
}

function openProfileModal() {
  const store = getStore();
  const user = appState.currentRole === 'teacher' ? store.teacherUser : store.currentUser;

  document.getElementById('edit-profile-name').value = user.fullName || user.name;
  document.getElementById('edit-profile-email').value = user.email;
  document.getElementById('edit-profile-role').value = user.role.toUpperCase();

  openModal('modal-edit-profile');
}

function handleEditProfileSubmit(event) {
  event.preventDefault();
  const nameVal = document.getElementById('edit-profile-name').value;
  const emailVal = document.getElementById('edit-profile-email').value;

  const store = getStore();
  if (appState.currentRole === 'teacher') {
    store.teacherUser.name = nameVal.split(' ')[0];
    store.teacherUser.fullName = nameVal;
    store.teacherUser.email = emailVal;
    appState.user = store.teacherUser;
  } else {
    store.currentUser.name = nameVal.split(' ')[0];
    store.currentUser.fullName = nameVal;
    store.currentUser.email = emailVal;
    appState.user = store.currentUser;
  }

  saveStore(store);
  updateTopBarUser();
  updateProfileCards();
  closeModal('modal-edit-profile');
  showToast('Profile updated successfully!', 'success');
}

/* ==========================================
   TEACHER ACTIONS: CREATE EXAM & AI GENERATOR
   ========================================== */
function openCreateExamModal() {
  openModal('modal-create-exam');
}

function handleCreateExamSubmit(event) {
  event.preventDefault();
  const title = document.getElementById('new-exam-title').value;
  const subject = document.getElementById('new-exam-subject').value;
  const duration = parseInt(document.getElementById('new-exam-duration').value) || 15;
  const marks = parseInt(document.getElementById('new-exam-marks').value) || 20;
  const passing = parseInt(document.getElementById('new-exam-passing').value) || 10;

  const qText = document.getElementById('new-q-text').value;
  const opt0 = document.getElementById('new-opt-0').value;
  const opt1 = document.getElementById('new-opt-1').value;
  const opt2 = document.getElementById('new-opt-2').value;
  const opt3 = document.getElementById('new-opt-3').value;
  const correctIdx = parseInt(document.getElementById('new-correct-opt').value) || 0;
  const topic = document.getElementById('new-q-topic').value || subject;
  const expl = document.getElementById('new-q-expl').value || '';

  const newExam = {
    id: 'exam_' + Date.now(),
    title,
    subject,
    description: `Assessment created by teacher covering ${topic}.`,
    durationMinutes: duration,
    totalMarks: marks,
    passingMarks: passing,
    topic,
    questions: [
      {
        id: 1,
        question: qText,
        options: [opt0, opt1, opt2, opt3],
        correctIndex: correctIdx,
        marks: marks,
        topic,
        explanation: expl
      }
    ]
  };

  const store = getStore();
  store.exams.push(newExam);
  store.recentActivities.unshift({
    text: `New exam created: ${title}`,
    time: 'Just now',
    type: 'created'
  });
  saveStore(store);

  closeModal('modal-create-exam');
  renderAvailableTests();
  renderTeacherDashboardData();
  showToast(`Exam "${title}" published successfully!`, 'success');
}

function openAIGeneratorModal() {
  document.getElementById('ai-gen-loader').classList.add('hidden');
  openModal('modal-ai-generator');
}

function simulateAIGeneration() {
  const topic = document.getElementById('ai-gen-topic').value || 'Artificial Intelligence';
  const loader = document.getElementById('ai-gen-loader');
  loader.classList.remove('hidden');

  setTimeout(() => {
    const newExam = {
      id: 'exam_ai_' + Date.now(),
      title: `${topic} Quiz (AI Generated)`,
      subject: 'Computer',
      description: `Auto-generated interactive assessment on ${topic}.`,
      durationMinutes: 15,
      totalMarks: 20,
      passingMarks: 10,
      topic,
      questions: [
        {
          id: 1,
          question: `In the context of ${topic}, what is supervised learning?`,
          options: [
            'Learning without any training data',
            'Learning using labeled training input-output pairs',
            'Random algorithmic guessing',
            'Hardware level GPU computation'
          ],
          correctIndex: 1,
          marks: 4,
          topic,
          explanation: 'Supervised learning uses labeled training datasets to train algorithms to classify data or predict outcomes.'
        },
        {
          id: 2,
          question: 'Which neural network architecture is widely used for natural language processing?',
          options: ['CNN', 'Transformer', 'Linear Perceptron', 'K-Means'],
          correctIndex: 1,
          marks: 4,
          topic,
          explanation: 'Transformers with self-attention mechanisms are the foundational architecture for state-of-the-art NLP models.'
        },
        {
          id: 3,
          question: 'What is overfitting in machine learning models?',
          options: [
            'Model performs well on training data but poorly on unseen test data',
            'Model is too small to fit in memory',
            'Model runs infinitely without converging',
            'Model has zero parameters'
          ],
          correctIndex: 0,
          marks: 4,
          topic,
          explanation: 'Overfitting occurs when a model learns noise in the training data rather than generalizing the underlying distribution.'
        },
        {
          id: 4,
          question: 'Which of the following is an unsupervised learning task?',
          options: ['Sentiment classification', 'Clustering customer segments', 'Spam detection', 'Facial recognition'],
          correctIndex: 1,
          marks: 4,
          topic,
          explanation: 'Clustering identifies intrinsic groupings in unlabeled datasets without predefined categories.'
        },
        {
          id: 5,
          question: 'What metric measures the proportion of true positives among all actual positives?',
          options: ['Precision', 'Recall / Sensitivity', 'F1-Score', 'Accuracy'],
          correctIndex: 1,
          marks: 4,
          topic,
          explanation: 'Recall is True Positives / (True Positives + False Negatives).'
        }
      ]
    };

    const store = getStore();
    store.exams.push(newExam);
    store.recentActivities.unshift({
      text: `AI generated new exam: ${newExam.title}`,
      time: 'Just now',
      type: 'created'
    });
    saveStore(store);

    loader.classList.add('hidden');
    closeModal('modal-ai-generator');
    renderAvailableTests();
    renderTeacherDashboardData();
    showToast(`AI generated 5 questions on "${topic}" and published test!`, 'success');
  }, 1200);
}

function openScheduleModal() {
  openModal('modal-schedule-exam');
}

function handleScheduleExamSubmit(event) {
  event.preventDefault();
  const examTitle = document.getElementById('sched-exam-select').value;
  const dateVal = document.getElementById('sched-exam-date').value;
  const timeVal = document.getElementById('sched-exam-time').value;
  const batchVal = document.getElementById('sched-exam-batch').value;

  const store = getStore();
  const subject = examTitle.includes('Math') ? 'Mathematics' : examTitle.includes('Science') ? 'Science' : 'English';
  
  store.upcomingEvents.unshift({
    examName: examTitle,
    subject: subject,
    dateTime: `${dateVal} at ${timeVal}`,
    status: 'Scheduled'
  });
  
  store.recentActivities.unshift({
    text: `Scheduled session: ${examTitle} (${batchVal})`,
    time: 'Just now',
    type: 'created'
  });

  saveStore(store);
  closeModal('modal-schedule-exam');
  renderTeacherDashboardData();
  showToast(`Successfully scheduled "${examTitle}"!`, 'success');
}

/* ==========================================
   MODAL UTILITIES & TOASTS
   ========================================== */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('hidden');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('hidden');
}

function showNotificationToast() {
  showToast('Notifications: 1. Mathematics Quiz scheduled tomorrow at 10:00 AM. 2. Science test scores published.', 'info');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  let bg = 'bg-slate-900 text-white';
  let icon = 'fa-circle-info text-blue-400';

  if (type === 'success') {
    bg = 'bg-emerald-900/90 text-emerald-100 border border-emerald-500/40';
    icon = 'fa-circle-check text-emerald-400';
  } else if (type === 'warning') {
    bg = 'bg-amber-900/90 text-amber-100 border border-amber-500/40';
    icon = 'fa-triangle-exclamation text-amber-400';
  }

  toast.className = `${bg} backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 text-xs sm:text-sm font-medium transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto max-w-sm`;
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-base shrink-0"></i>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 50);

  // Auto remove
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
