const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors({ origin: '*' }));

app.get('/news', async (req, res) => {
    try {
        const { data } = await axios.get('https://www.mlb.com/news');
        const $ = cheerio.load(data);
        const articles = $('article.l-grid__content--card');
        const articleData = [];
        articles.each((idx, el) => {
            const article = {
                title: $(el).find('h1.article-item__headline').text().trim(),
                imageURL: $(el).find('img.lazyload--loaded').attr('data-srcset'),
                articleURL: 'https://www.mlb.com' + $(el).find('a.p-button__link').attr('href'),
                paragraph: $(el).find('div.article-item__preview p').text().trim(),
            };
            articleData.push(article);
        });

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(articleData, null, 2));
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al raspar la página');
    }
});


app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
