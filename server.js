const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5500;

app.use(express.static('public'));

app.get('/images', (req, res) => {
  const imagesDir = path.join(__dirname, 'public/img');

  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Error reading image directory', err);
      return res.status(500).json({ error: 'Failed to read image directory' });
    }

    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    res.json(imageFiles);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});