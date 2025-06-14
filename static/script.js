document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const form         = document.getElementById('uploadForm');
  const fileInput    = document.getElementById('trackInput');
  const modal        = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const file = fileInput.files[0];
    // Enforce MP3 only
    if (!file || !file.name.toLowerCase().endsWith('.mp3')) {
      alert('Please upload an MP3 file.');
      fileInput.value = '';
      return;
    }
    showProcessing();
    // Simulate processing delay for mock results
    setTimeout(() => showMockResults(), 3000);
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
        <img src="${document.getElementById('logo').src}" class="modal-logo" alt="Logo">
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