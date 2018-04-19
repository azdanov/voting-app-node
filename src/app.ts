import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({
    message: 'Hello Nodemon!',
  });
});

app.use('/', router);

export default app;
