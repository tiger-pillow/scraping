const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs');
app.use(cors())

const url = 'https://edu.epfl.ch/studyplan/en/master/computer-science/'


const sections = fs.readFileSync('/Users/gladys/Desktop/scraping-epfl/webscraper/ready_to_use/propedeutics_sections_list.json')
JSON.parse(sections).map((val, i)=>{
    crawl_by_section(val.sectionURL, val.sectionName)
})

//crawl_by_section(url, 'civil')

async function crawl_by_section(url, name){
    const courses = []
    await axios(url)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('.line-down', html).each((i, element) =>{
                const courseName = $(element).find(".cours-name").find('a').text()
                const url = $(element).find(".cours-name").find('a').attr('href')
                const courseCode = $(element).find(".cours-info").text().split(" ")[0]
                const profNames  = []
                const profUrls = []
                $(element).find(".enseignement-name").find('a').each(function (index, e){
                    profNames.push($(e).text())
                })

                $(element).find(".enseignement-name").find('a').each(function(index, e){
                    profUrls.push($(e).attr('href'))
                })
                const credits = $(element).find(".credit-time").text()
                const langue = $(element).find('.langue').find('abbr').text()
                const term = $(element).find('.exam-text').find('b').text()

                courses.push({
                    courseName: courseName,
                    year: 2022, 
                    language: langue,
                    term: term, 
                    studyplan: [name],
                    url: "https://edu.epfl.ch" + url,
                    courseCode: courseCode,
                    profName: profNames,
                    profUrls: profUrls,
                    credits: credits
                })
            })
            fs.writeFileSync('./propedeutics_courses/'+ name + '.json', JSON.stringify(courses))

        })
      .catch(err => console.log(err))
     // fs.writeFileSync(name + '.json', JSON.stringify(courses))
    }


async function find_major_names_and_links(url) {
    const courses = []
    await axios(url)
        .then(response => {
            //console.log(response.data)
            const html = response.data
            const $ = cheerio.load(html)
            $('li', html).find('a').each((i, element) => {
                const sectionName = $(element).text()
                const url = $(element).attr('href')
                console.log(sectionName, url)
                courses.push({
                    sectionName: sectionName,
                    sectionURL: "https://edu.epfl.ch" + url,
                })
            })
        })
        .catch(err => console.log(err))
    
    fs.writeFileSync("propedeutics_sections_list.json", JSON.stringify(courses))

}




