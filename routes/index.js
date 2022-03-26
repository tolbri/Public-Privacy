const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const YAML = require('yaml');
const path = require('path');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const handleRequest = async (req) => {
  const lang = req.language;

  const [language, meta, navigation, filterPage, face] = await Promise.all([
    YAML.parse(fs.readFileSync('./resources/language.yml', 'utf8')),
    YAML.parse(fs.readFileSync('./resources/' + lang + '/meta.yml', 'utf8')),
    YAML.parse(
      fs.readFileSync('./resources/' + lang + '/navigation.yml', 'utf8')
    ),
    YAML.parse(fs.readFileSync('./resources/' + lang + '/filter.yml', 'utf8')),
    YAML.parse(fs.readFileSync('./resources/' + lang + '/face.yml', 'utf8')),
  ]);

  return {
    lang,
    language,
    meta,
    navigation,
    filterPage,
    face,
  };
};

const getComments = async (collection) => {
  await client.connect();

  const db = client.db('public-privacy');
  const dbCollection = db.collection('face');

  return await dbCollection.find({}).toArray();
};

const getRandomImages = async (folder) => {
  const files = await fs.promises.readdir('./shared/img/200x200/' + folder);
  const images = files.filter((elem) => path.extname(elem) === '.jpg');
  const ids = images.map((elem) => {
    const string = elem.match(/\d+/g);
    return parseInt(string[0]);
  });

  const comments = await getComments();

  const items = comments.filter((elem) => ids.includes(elem.local_image_id));

  const shuffled = items
    .map((elem) => ({ elem, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ elem }) => elem);

  return shuffled;
};

router.get('/', async function (req, res, next) {
  const defaults = await handleRequest(req);

  defaults.template = 'face';
  defaults.filter = defaults[defaults.template];
  defaults.randomImages = await getRandomImages(defaults.template);

  res.render('pages/filter', {
    ...defaults,
  });
});

module.exports = router;
