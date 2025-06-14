document.addEventListener('DOMContentLoaded', () => {
  const settingsToggle   = document.getElementById('settingsToggle');
  const settingsModal    = document.getElementById('settingsModal');
  const closeSettings    = document.getElementById('closeSettings');
  const saveSettings     = document.getElementById('saveSettings');
  const resetDefaultsBtn = document.getElementById('resetDefaults');
  const logoInput        = document.getElementById('logoInput');
  const nameInput        = document.getElementById('nameInput');
  const nameColorInput   = document.getElementById('nameColorInput');
  const bgColorInput     = document.getElementById('bgColorInput');
  const bgImageInput     = document.getElementById('bgImageInput');
  const musicInput       = document.getElementById('musicInput');
  const themeAudio       = new Audio();

  const logoEl   = document.getElementById('logo');
  const titleEl  = document.getElementById('title');
  const bodyEl   = document.body;

  function loadSettings() {
    const logo      = localStorage.getItem('customLogo');
    const name      = localStorage.getItem('customName');
    const nameColor = localStorage.getItem('customNameColor');
    const bg        = localStorage.getItem('customBg');
    const bgImg     = localStorage.getItem('customBgImg');
    const music     = localStorage.getItem('customMusic');

    logoEl.src      = logo || '/static/logo.png';
    titleEl.innerText = name || '🎧EchoSplit';
    titleEl.style.color = nameColor || '#000';
    document.documentElement.style.setProperty('--bg-color', bg || '#fff');
    bodyEl.style.backgroundImage = bgImg ? `url('${bgImg}')` : '';

    if (music) {
      themeAudio.src = music;
      themeAudio.loop = true;
      themeAudio.play().catch(() => {});
    } else {
      themeAudio.pause();
      themeAudio.src = '';
    }
  }

  loadSettings();
  settingsToggle.addEventListener('click', () => settingsModal.classList.add('visible'));
  closeSettings.addEventListener('click', () => settingsModal.classList.remove('visible'));

  saveSettings.addEventListener('click', () => {
    if (logoInput.files[0]) {
      localStorage.setItem('customLogo', URL.createObjectURL(logoInput.files[0]));
    }
    if (nameInput.value) {
      localStorage.setItem('customName', nameInput.value);
    }
    if (nameColorInput.value) {
      localStorage.setItem('customNameColor', nameColorInput.value);
    }
    if (bgColorInput.value) {
      localStorage.setItem('customBg', bgColorInput.value);
      localStorage.removeItem('customBgImg');
    }
    if (bgImageInput.files[0]) {
      localStorage.setItem('customBgImg', URL.createObjectURL(bgImageInput.files[0]));
      localStorage.removeItem('customBg');
    }
    if (musicInput.files[0]) {
      localStorage.setItem('customMusic', URL.createObjectURL(musicInput.files[0]));
    }
    loadSettings();
    settingsModal.classList.remove('visible');
  });

  resetDefaultsBtn.addEventListener('click', () => {
    ['customLogo','customName','customNameColor','customBg','customBgImg','customMusic']
      .forEach(key => localStorage.removeItem(key));
    loadSettings();
    settingsModal.classList.remove('visible');
  });

  const form         = document.getElementById('uploadForm');
  const fileInput    = document.getElementById('trackInput');
  const modal        = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const file = fileInput.files[0];
    if (!file || !file.name.toLowerCase().endsWith('.mp3')) {
      alert('Please upload an MP3 file.');
      fileInput.value = '';
      return;
    }
    showProcessing();
    setTimeout(showMockResults, 3000);
  });

  function showProcessing() {
    modal.classList.add('visible');
    modalContent.innerHTML = `
      <button class="close-btn" id="closeModal">&times;</button>
      <div class="spinner"></div>
      <h2>Processing</h2>
      <p>This should take 30-90 seconds depending on file size.</p>
    `;
    document.getElementById('closeModal').onclick = reset;
  }

  function showMockResults() {
    modalContent.innerHTML = `
      <button class="close-btn" id="closeModal">&times;</button>
      <div style="text-align:center;">
        <img src="${logoEl.src}" class="modal-logo" alt="Logo">
        <h2>Download Your Stems</h2>
      </div>
      <ul class="stem-list">
        <li><a href="#" download="vocals.mp3">vocals.mp3</a></li>
        <li><a href="#" download="drums.mp3">drums.mp3</a></li>
        <li><a href="#" download="bass.mp3">bass.mp3</a></li>
        <li><a href="#" download="other.mp3">other.mp3</a></li>
      </ul>
    `;
    document.getElementById('closeModal').onclick = reset;
  }

  function reset() {
    modal.classList.remove('visible');
    fileInput.value = '';
    modalContent.innerHTML = '';
  }
});