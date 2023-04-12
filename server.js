const express = require('express');

const app = express();

const PORT = 8000;

app.use('/', express.static(`${__dirname}/build`));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/build/index.html`);
});

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

