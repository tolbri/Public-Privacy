const createError = require('http-errors');
const express = require('express');
const path = require('path');
const requestLanguage = require('express-request-language');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const YAML = require('yaml');
const fs = require('fs');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = app.get('views');
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// localization
app.use(
  requestLanguage({
    languages: ['en', 'de'],
    queryName: 'locale',
    cookie: {
      name: 'language',
      options: { maxAge: 24 * 3600 * 1000 },
      url: '/languages/{language}',
    },
  })
);

app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  const lang = req.language;
  const meta = YAML.parse(
    fs.readFileSync('./resources/' + lang + '/meta.yml', 'utf8')
  );
  const navigation = YAML.parse(
    fs.readFileSync('./resources/' + lang + '/navigation.yml', 'utf8')
  );

  res.status(err.status || 500);
  res.render('pages/error', {
    meta,
    navigation,
  });
});

module.exports = app;
