const express = require('express');
const router = express.Router();
const fs = require('fs');
const YAML = require('yaml');
const path = require('path');

const handleRequest = async (req) => {
  const lang = req.language;

  const [language, meta, navigation, faces] = await Promise.all([
    YAML.parse(fs.readFileSync('./resources/language.yml', 'utf8')),
    YAML.parse(fs.readFileSync('./resources/' + lang + '/meta.yml', 'utf8')),
    YAML.parse(
      fs.readFileSync('./resources/' + lang + '/navigation.yml', 'utf8')
    ),
    YAML.parse(fs.readFileSync('./resources/' + lang + '/faces.yml', 'utf8')),
  ]);

  return {
    lang,
    language,
    meta,
    navigation,
    faces,
  };
};

const getRandomImages = (folder) => {
  const files = fs.readdirSync('./shared/img/60x60/' + folder, (err, files) => {
    return files;
  });
  const images = files.filter((elem) => path.extname(elem) === '.jpg');

  const shuffled = images
    .map((elem) => ({ elem, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ elem }) => elem);

  return shuffled;
};

router.get('/', async function (req, res, next) {
  const defaults = await handleRequest(req);

  defaults.template = 'faces';
  defaults.filter = defaults[defaults.template];
  defaults.randomImages = getRandomImages(defaults.template);

  res.render('pages/filter', {
    ...defaults,
  });
});

router.get('/indoor', async function (req, res, next) {
  const defaults = await handleRequest(req);

  defaults.template = 'faces';
  defaults.filter = defaults[defaults.template];
  defaults.randomImage = getRandomImage(defaults.template);

  res.render('pages/filter', {
    ...defaults,
  });
});

module.exports = router;
