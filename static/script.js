document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const settingsToggle = document.getElementById('settingsToggle');
  const settingsModal  = document.getElementById('settingsModal');
  const closeSettings  = document.getElementById('closeSettings');
  const saveSettings   = document.getElementById('saveSettings');
  const resetDefaultsBtn = document.getElementById('resetDefaults');
  const logoInput      = document.getElementById('logoInput');
  const nameInput      = document.getElementById('nameInput');
  const nameColorInput = document.getElementById('nameColorInput');
  const bgColorInput   = document.getElementById('bgColorInput');
  const bgImageInput   = document.getElementById('bgImageInput');
  const musicInput     = document.getElementById('musicInput');
  const themeAudio     = new Audio();

  const logoEl   = document.getElementById('logo');
  const titleEl  = document.getElementById('title');
  const bodyEl   = document.body;

  // Load saved settings
  function loadSettings() {
    const logo        = localStorage.getItem('customLogo');
    const name        = localStorage.getItem('customName');
    const nameColor   = localStorage.getItem('customNameColor');
    const bg          = localStorage.getItem('customBg');
    const bgImg       = localStorage.getItem('customBgImg');
    const music       = localStorage.getItem('customMusic');

    logoEl.src = logo || '/static/logo.png';
    titleEl.innerText = name || '🎧EchoSplit';
    titleEl.style.color = nameColor || '#000000';
    document.documentElement.style.setProperty('--bg-color', bg || '#ffffff');
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

  // Settings modal toggles
  settingsToggle.addEventListener('click', () => settingsModal.classList.add('visible'));
  closeSettings.addEventListener('click', () => settingsModal.classList.remove('visible'));

  // Save settings
  saveSettings.addEventListener('click', () => {
    if (logoInput.files[0]) {
      const url = URL.createObjectURL(logoInput.files[0]);
      localStorage.setItem('customLogo', url);
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
      const url = URL.createObjectURL(bgImageInput.files[0]);
      localStorage.setItem('customBgImg', url);
      localStorage.removeItem('customBg');
    }
    if (musicInput.files[0]) {
      const url = URL.createObjectURL(musicInput.files[0]);
      localStorage.setItem('customMusic', url);
    }
    loadSettings();
    settingsModal.classList.remove('visible');
  });

  // Reset to defaults
  resetDefaultsBtn.addEventListener('click', () => {
    ['customLogo','customName','customNameColor','customBg','customBgImg','customMusic']
      .forEach(key => localStorage.removeItem(key));
    loadSettings();
    settingsModal.classList.remove('visible');
  });

  // Upload & processing logic (unchanged)
  const form         = document.getElementById('uploadForm');
  const fileInput    = document.getElementById('trackInput');
  const modal        = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!fileInput.files.length) return;
    showProcessing();
    try {
      const formData = new FormData();
      formData.append('track', fileInput.files[0]);
      const uploadRes = await fetch('/upload', { method: 'POST', body: formData });
      const { jobId } = await uploadRes.json();
      let status = '', outputUrl = '';
      while (status !== 'complete') {
        await new Promise(r => setTimeout(r, 3000));
        const data = await (await fetch(`/status/${jobId}`)).json();
        status = data.status;
        if (status === 'complete') outputUrl = data.outputUrl;
      }
      showResults(outputUrl);
    } catch {
      hideModal(); alert('Error processing file.');
    }
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

  function showResults(url) {
    modalContent.innerHTML = `
      <button class="close-btn" id="closeModal">&times;</button>
      <img src="${document.getElementById('logo').src}" class="modal-logo" alt="Logo">
      <a href="${url}" class="download-btn">Download Stems</a>
    `;
    document.getElementById('closeModal').onclick = reset;
  }

  function hideModal() { modal.classList.remove('visible'); }
  function reset() { hideModal(); fileInput.value = ''; modalContent.innerHTML = ''; }
});