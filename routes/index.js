const express = require('express');
const router = express.Router();
const fs = require('fs');
const YAML = require('yaml');

const handleRequest = async () => {
  const [meta, navigation] = await Promise.all([
    YAML.parse(fs.readFileSync('./content/meta.yml', 'utf8')),
    YAML.parse(fs.readFileSync('./content/navigation.yml', 'utf8')),
  ]);

  return {
    meta,
    navigation,
  };
};

/* GET home page. */
router.get('/', async function (req, res, next) {
  await handleRequest();

  res.render('pages/home');
});

module.exports = router;
