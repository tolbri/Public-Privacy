const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const YAML = require('yaml');
const path = require('path');
const chart = {
  country: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
      },
    ],
  },
  device: {
    labels: ['iOS', 'Android', 'Others'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3],
      },
    ],
  },
};
// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const handleRequest = async (req, template) => {
  const lang = req.language;

  const [language, meta, navigation, page, filter] = await Promise.all([
    YAML.parse(fs.readFileSync('./resources/language.yml', 'utf8')),
    YAML.parse(fs.readFileSync('./resources/' + lang + '/meta.yml', 'utf8')),
    YAML.parse(
      fs.readFileSync('./resources/' + lang + '/navigation.yml', 'utf8')
    ),
    YAML.parse(fs.readFileSync('./resources/' + lang + '/page.yml', 'utf8')),
    YAML.parse(
      fs.readFileSync('./resources/' + lang + '/' + template + '.yml', 'utf8')
    ),
  ]);

  const randomImages = await getRandomImages(template);

  return {
    lang,
    language,
    meta,
    navigation,
    page,
    filter,
    template,
    randomImages,
    chart,
  };
};

const getComments = async (collection) => {
  await client.connect();

  const db = client.db('public-privacy');
  const dbCollection = db.collection(collection);

  return await dbCollection.find({}).toArray();
};

const getRandomImages = async (folder) => {
  const files = await fs.promises.readdir('./shared/img/200x200/' + folder);
  const images = files.filter((elem) => path.extname(elem) === '.jpg');
  const ids = images.map((elem) => {
    const string = elem.match(/\d+/g);
    return parseInt(string[0]);
  });

  const comments = await getComments(folder);

  const items = comments.filter((elem) => ids.includes(elem.local_image_id));

  const shuffled = items
    .map((elem) => ({ elem, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ elem }) => elem);

  return shuffled;
};

router.get('/', async function (req, res, next) {
  const template = 'face';
  const defaults = await handleRequest(req, template);

  res.render('pages/filter', {
    ...defaults,
  });
});

router.get('/face', async function (req, res, next) {
  const template = 'face';
  const defaults = await handleRequest(req, template);

  res.render('pages/filter', {
    ...defaults,
  });
});

router.get('/bedroom', async function (req, res, next) {
  const template = 'bedroom';
  const defaults = await handleRequest(req, template);

  res.render('pages/filter', {
    ...defaults,
  });
});

router.get('/nudity', async function (req, res, next) {
  const template = 'nudity';
  const defaults = await handleRequest(req, template);

  res.render('pages/filter', {
    ...defaults,
  });
});

router.get('/outdoor', async function (req, res, next) {
  const template = 'outdoor';
  const defaults = await handleRequest(req, template);

  res.render('pages/filter', {
    ...defaults,
  });
});

router.get('/people', async function (req, res, next) {
  const template = 'people';
  const defaults = await handleRequest(req, template);

  res.render('pages/filter', {
    ...defaults,
  });
});

router.get('/religion', async function (req, res, next) {
  const template = 'religion';
  const defaults = await handleRequest(req, template);

  res.render('pages/filter', {
    ...defaults,
  });
});

router.get('/tattoo', async function (req, res, next) {
  const template = 'tattoo';
  const defaults = await handleRequest(req, template);

  res.render('pages/filter', {
    ...defaults,
  });
});

router.get('/test', async function (req, res, next) {
  const template = 'tattoo';
  const defaults = await handleRequest(req, template);

  res.render('pages/test', {
    ...defaults,
  });
});

module.exports = router;
