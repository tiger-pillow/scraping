const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs');
app.use(cors())

const url = 'https://edu.epfl.ch/studyplan/en/bachelor/computer-science/'

find_major_names_and_links(url)

async function find_major_names_and_links(url){
    const courses = []
    await axios(url)
        .then(response => {
            //console.log(response.data)
            const html = response.data
            const $ = cheerio.load(html)
            const masters = $('.bama_cycle', html)

            masters.find('a').each((i, element) =>{
                const courseName = $(element).text()
                console.log(courseName)

            })

        })
      .catch(err => console.log(err))
    }




//app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

