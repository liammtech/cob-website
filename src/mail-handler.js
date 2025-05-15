document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      honeypot: formData.get('company'),
    };

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
        return;
      }

      if (result.success) {
        if (status) status.textContent = "Message sent!";
        form.reset();
      } else {
        if (status) status.textContent = result.error || "Something went wrong.";
      }
    } catch (err) {
      console.error('Form submit error:', err);
      if (status) status.textContent = "Network error. Try again later.";
    }
  });
});
