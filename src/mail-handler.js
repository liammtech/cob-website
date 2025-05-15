grecaptcha.ready(() => {
  grecaptcha.execute('6LenIjwrAAAAAAYnqZPnVa8TRjTjWLJy2LrkTRfC', { action: 'submit' })
    .then(async (token) => {
      data.token = token;

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
    });
});
