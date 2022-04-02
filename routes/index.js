require('dotenv').config();

const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
const YAML = require('yaml');
const path = require('path');
const countryList = require('../resources/countries.json');

// Connection URL
const uri = process.env.CONNECTION_STRING;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const handleRequest = async (req, template) => {
  const lang = req.language;

  const [language, meta, navigation, filterPage, filter] = await Promise.all([
    YAML.parse(fs.readFileSync('./resources/language.yml', 'utf8')),
    YAML.parse(fs.readFileSync('./resources/' + lang + '/meta.yml', 'utf8')),
    YAML.parse(
      fs.readFileSync('./resources/' + lang + '/navigation.yml', 'utf8')
    ),
    YAML.parse(fs.readFileSync('./resources/' + lang + '/filter.yml', 'utf8')),
    YAML.parse(
      fs.readFileSync('./resources/' + lang + '/' + template + '.yml', 'utf8')
    ),
  ]);

  let chart = null;
  let randomImages = null;

  if (
    template === 'face' ||
    template === 'bedroom' ||
    template === 'nudity' ||
    template === 'outdoor' ||
    template === 'people' ||
    template === 'religion' ||
    template === 'tattoo'
  ) {
    randomImages = await getRandomImages(template);

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

    const topCountriesCode = countries[0].slice(0, 3);
    const topCountriesValue = countries[1].slice(0, 3);

    const otherCountriesValue = countries[1]
      .slice(3)
      .reduce((partialSum, a) => partialSum + a, 0);

    const countryNames = topCountriesCode.map((elem) => {
      const data = countryList.find((e) => e.code === elem);
      return data.name;
    });

    countries[0] = countryNames;
    countries[1] = topCountriesValue;

    countries[0].push('Rest');
    countries[1].push(otherCountriesValue);

    chart = {
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
  }

  return {
    lang,
    language,
    meta,
    navigation,
    filterPage,
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
  const images = files.filter((elem) => path.extname(elem) === '.webp');
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

const getChartData = (data) => {
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

  const unordered = [];
  for (let i = 0; i < labels.length; i++) {
    unordered.push({ label: labels[i], value: values[i] });
  }

  unordered.sort((a, b) => {
    return a.value < b.value ? -1 : a.value == b.value ? 0 : 1;
  });

  for (let k = 0; k < unordered.length; k++) {
    labels[k] = unordered[k].label;
    values[k] = unordered[k].value;
  }

  labels.reverse();
  values.reverse();

  return [labels, values];
};

router.get('/', async function (req, res, next) {
  const template = 'home';
  const defaults = await handleRequest(req, template);

  res.render('pages/home', {
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
