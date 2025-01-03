import express, { Application } from 'express';
import helmet from 'helmet';
import Routes from './routing';

const app: Application = express();

app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads/',express.static('uploads'));
app.use(helmet());

app.set('view engine', 'ejs');

app.use('/api', Routes);

export default app;
