const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs');
const { response } = require('express')
const { getRandomValues } = require('crypto')
app.use(cors())

//constants prep
url = "https://people.epfl.ch/"
const intervals = []

// stopped at 330000 - 
// going to  335000

// start from 335000 going to 340000 -- still appending to large 3 
withWait() 

async function withWait(){
  i = 336572
  while (i < 340000) {
    await scrape_person(url, i).then(async (response) => {
      if (response) {
        fs.appendFileSync('./people_info/large3.json', JSON.stringify(response) + ",")
      }
    })
    i += 1
   
  }
}

async function scrape_person(url, i){
  url = url + i.toString()
  const oneperson = await axios(url)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)

      // get names 
      const name = $('.main-container', html).find('h1').text()
      // if this name exists, then get the sections 
      if (name == "" || name == null){
        return null
      } else {
          //parse names
          namessplit = name.split(" ")
          firstname = namessplit[0]
          lastname = namessplit[namessplit.length - 1]
          
          //parse sections
          const section = []
          $('.main-container', html).find('small').each(function(index, x){
            section.push($(x).find('a').text())
            }
          )
          //parse emails
          var email = $('.main-container', html).find('.btn').text()
          
          //push to array
          temp = {
            sciper: i, 
            name: name, 
            firstname: firstname, 
            lastname: lastname, 
            email: email, 
            section: section.slice(0, -2)
          }
        return temp
        }
    })
    return oneperson
}


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}