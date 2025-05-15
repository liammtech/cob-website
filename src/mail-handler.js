document.addEventListener('DOMContentLoaded', () => {
  console.log('mail-handler.js loaded!');
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  console.log("Form data:");
  console.log(form);
  console.log("Status data:");
  console.log(status);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect data
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      honeypot: formData.get('company'), // the hidden honeypot field
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        status.textContent = "Message sent! Thanks.";
        form.reset();
      } else {
        status.textContent = result.error || "Something went wrong.";
      }
    } catch (err) {
      console.error('Form submit error:', err);
      status.textContent = "Network error. Try again later.";
    }
  });
});
