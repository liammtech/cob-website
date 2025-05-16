document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoader(); // 👈 start loader immediately

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      honeypot: formData.get('company') || '',
      'cf-turnstile-response': document.querySelector('[name="cf-turnstile-response"]')?.value || ''
    };

    console.log("Sending form data:", data);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const text = await response.text();
      let result;

      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse JSON:', text);
        if (status) status.textContent = "Server error. Try again later.";
        hideLoader(); // 👈 stop loader even if fail
        return;
      }

      if (result.success) {
        if (status) status.textContent = "Message sent!";
        form.reset();
        hideLoader(); // 👈 hide before toast
        showToast();  // 👈 toast shows after loader fades out
      } else {
        if (status) status.textContent = result.error || "Something went wrong.";
        hideLoader();
      }
    } catch (err) {
      console.error('Form submit error:', err);
      if (status) status.textContent = "Network error. Try again later.";
      hideLoader();
    }
  });
});

// 🔔 Toast logic
function showToast() {
  const toast = document.getElementById('contact-toast');
  if (!toast) return;

  toast.classList.remove('hidden'); // unhide
  requestAnimationFrame(() => {     // allow DOM to apply change
    toast.classList.add('show');    // then fade in
  });

  setTimeout(() => {
    hideToast();
  }, 5000);
}

function hideToast() {
  const toast = document.getElementById('contact-toast');
  if (!toast) return;

  toast.classList.remove('show');

  // Wait for the fade-out transition to finish before hiding it
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 400); // match the CSS transition duration
}

function showLoader() {
  const loader = document.getElementById('form-loader');
  if (!loader) return;
  loader.classList.remove('hidden');
  requestAnimationFrame(() => {
    loader.classList.add('show');
  });
}

function hideLoader() {
  const loader = document.getElementById('form-loader');
  if (!loader) return;
  loader.classList.remove('show');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 300); // match transition duration
}
