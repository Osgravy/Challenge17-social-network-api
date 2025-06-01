import express, { json, urlencoded } from 'express';
import { connect, set } from 'mongoose';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(routes);

connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

set('debug', true);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));