const express = require('express');
const router = express.Router();
const fs = require('fs');
const YAML = require('yaml');

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

router.get('/', async function (req, res, next) {
  const defaults = await handleRequest(req);

  defaults.template = 'faces';
  defaults.filter = defaults[defaults.template];

  res.render('pages/filter', {
    ...defaults,
  });
});

module.exports = router;
