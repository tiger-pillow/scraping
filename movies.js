const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs');
const { response } = require('express')
const { getRandomValues } = require('crypto')
const { json } = require('body-parser')
app.use(cors())

url = "https://www.imdb.com/chart/top/"

find_movies(url)

async function find_movies(url) {
  const topmovies = []
  await axios(url)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)
      $('tr', html).each(function (index, x) {
        const movie = {}
        movie.title = $(x).find('.titleColumn').find('a').text()
        movie.year = ($(x).find('.titleColumn').find('.secondaryInfo').text().replace("(", "").replace(")", ""))
        movie.rating = $(x).find('strong').text()
        topmovies.push(movie)
      })

    })
  fs.writeFileSync("imdb_250", JSON.stringify(topmovies))
}


