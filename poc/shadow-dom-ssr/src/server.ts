import fs from 'fs';
import express from 'express';

const app = express();
const port = 8080;

const html = fs.readFileSync('./index.html', 'utf-8');

app.use('/dist', express.static('dist'));

app.get('/*', (req, res) => {
  res.send(html);
});

app.listen(port, () => console.log(`Listening on: http://127.0.0.1:${port}`));
