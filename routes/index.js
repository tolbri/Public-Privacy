const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const YAML = require('yaml');
const path = require('path');
const countryList = require('../resources/countries.json');

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

  let allDevices = randomImages.map((elem) => elem.comment_data.device);
  allDevices = allDevices.map((elem) => {
    if (elem !== 'ios' && elem !== 'and') {
      return 'other';
    } else return elem;
  });

  const devices = await getChartData(allDevices);
  devices[0] = devices[0].map((elem) => {
    if (elem === 'ios') {
      return 'iOS';
    } else if (elem === 'and') {
      return 'Android';
    } else return 'Other';
  });

  const allCountries = randomImages.map((elem) => elem.comment_data.country);
  const countries = await getChartData(allCountries);
  countries[0] = countries[0].slice(0, 3);
  countries[1] = countries[1].slice(0, 3);

  const countryNames = countries[0].map((elem) => {
    const data = countryList.find((e) => e.code === elem);
    console.log(elem);
    return data.name;
  });

  countries[0] = countryNames;

  const chart = {
    device: {
      labels: devices[0],
      datasets: [
        {
          data: devices[1],
        },
      ],
    },
    country: {
      labels: countries[0],
      datasets: [
        {
          data: countries[1],
        },
      ],
    },
  };

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

const getChartData = async (data) => {
  const labels = [];
  const values = [];
  const arr = [...data];
  let prev = null;

  arr.sort();
  for (const element of arr) {
    if (element !== prev) {
      labels.push(element);
      values.push(1);
    } else ++values[values.length - 1];
    prev = element;
  }

  labels.reverse();
  values.reverse();

  return [labels, values];
};

router.get('/', async function(req, res, next) {
  const template = 'face';
  const defaults = await handleRequest(req, template);

  res.render('pages/filter', {
    ...defaults,
  });
});

router.get('/face', async function(req, res, next) {
  const template = 'face';
  const defaults = await handleRequest(req, template);

  res.render('pages/filter', {
    ...defaults,
  });
});

router.get('/bedroom', async function(req, res, next) {
  const template = 'bedroom';
  const defaults = await handleRequest(req, template);

  res.render('pages/filter', {
    ...defaults,
  });
});

router.get('/nudity', async function(req, res, next) {
  const template = 'nudity';
  const defaults = await handleRequest(req, template);

  res.render('pages/filter', {
    ...defaults,
  });
});

router.get('/outdoor', async function(req, res, next) {
  const template = 'outdoor';
  const defaults = await handleRequest(req, template);

  res.render('pages/filter', {
    ...defaults,
  });
});

router.get('/people', async function(req, res, next) {
  const template = 'people';
  const defaults = await handleRequest(req, template);

  res.render('pages/filter', {
    ...defaults,
  });
});

router.get('/religion', async function(req, res, next) {
  const template = 'religion';
  const defaults = await handleRequest(req, template);

  res.render('pages/filter', {
    ...defaults,
  });
});

router.get('/tattoo', async function(req, res, next) {
  const template = 'tattoo';
  const defaults = await handleRequest(req, template);

  res.render('pages/filter', {
    ...defaults,
  });
});

router.get('/test', async function(req, res, next) {
  const template = 'tattoo';
  const defaults = await handleRequest(req, template);

  res.render('pages/test', {
    ...defaults,
  });
});

module.exports = router;
