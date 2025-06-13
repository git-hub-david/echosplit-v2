document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const settingsToggle = document.getElementById('settingsToggle');
  const settingsModal  = document.getElementById('settingsModal');
  const closeSettings  = document.getElementById('closeSettings');
  const saveSettings   = document.getElementById('saveSettings');
  const logoInput      = document.getElementById('logoInput');
  const nameInput      = document.getElementById('nameInput');
  const nameColorInput = document.getElementById('nameColorInput');
  const bgColorInput   = document.getElementById('bgColorInput');
  const bgImageInput   = document.getElementById('bgImageInput');
  const musicInput     = document.getElementById('musicInput');

  const logoEl   = document.getElementById('logo');
  const titleEl  = document.getElementById('title');
  const bodyEl   = document.body;

  let audio;

  // Load saved settings
  function loadSettings() {
    const logo     = localStorage.getItem('customLogo');
    const name     = localStorage.getItem('customName');
    const nameColor= localStorage.getItem('customNameColor');
    const bg       = localStorage.getItem('customBg');
    const bgImg    = localStorage.getItem('customBgImg');
    const music    = localStorage.getItem('customMusic');

    if (logo) logoEl.src = logo;
    if (name) titleEl.innerText = name;
    if (nameColor) titleEl.style.color = nameColor;
    if (bg) {
      document.documentElement.style.setProperty('--bg-color', bg);
      bodyEl.style.backgroundImage = '';
    }
    if (bgImg) {
      bodyEl.style.backgroundImage = `url('${bgImg}')`;
    }
    if (music) {
      audio = new Audio(music);
      audio.loop = true;
      audio.play();
    }
  }

  loadSettings();

  // Settings modal toggles
  settingsToggle.addEventListener('click', () => settingsModal.classList.add('visible'));
  closeSettings.addEventListener('click', () => settingsModal.classList.remove('visible'));

  // Save settings
  saveSettings.addEventListener('click', () => {
    // Logo update
    if (logoInput.files[0]) {
      const url = URL.createObjectURL(logoInput.files[0]);
      localStorage.setItem('customLogo', url);
      logoEl.src = url;
    }
    // Name update
    if (nameInput.value) {
      localStorage.setItem('customName', nameInput.value);
      titleEl.innerText = nameInput.value;
    }
    // Name color
    if (nameColorInput.value) {
      localStorage.setItem('customNameColor', nameColorInput.value);
      titleEl.style.color = nameColorInput.value;
    }
    // Background color
    if (bgColorInput.value) {
      localStorage.setItem('customBg', bgColorInput.value);
      document.documentElement.style.setProperty('--bg-color', bgColorInput.value);
      bodyEl.style.backgroundImage = '';
    }
    // Background image
    if (bgImageInput.files[0]) {
      const url = URL.createObjectURL(bgImageInput.files[0]);
      localStorage.setItem('customBgImg', url);
      bodyEl.style.backgroundImage = `url('${url}')`;
    }
    // Theme music
    if (musicInput.files[0]) {
      const url = URL.createObjectURL(musicInput.files[0]);
      localStorage.setItem('customMusic', url);
      if (audio) audio.pause();
      audio = new Audio(url);
      audio.loop = true;
      audio.play();
    }

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
      hideModal();
      alert('Error processing file.');
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
      <img src="${logoEl.src}" class="modal-logo" alt="Logo">
      <a href="${url}" class="download-btn">Download Stems</a>
    `;
    document.getElementById('closeModal').onclick = reset;
  }

  function hideModal() { modal.classList.remove('visible'); }
  function reset() { hideModal(); fileInput.value = ''; modalContent.innerHTML = ''; }
});