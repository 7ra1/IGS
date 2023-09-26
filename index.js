

const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');

app.use(express.json());

app.get('/download-instagram-video', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const downloadLink = await downloadInstagramVideo(url);
    if (downloadLink) {
      res.json({ downloadLink });
    } else {
      res.status(404).json({ error: 'Video not found or URL is invalid' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const downloadInstagramVideo = async (url) => {
  const apiUrl = 'https://saveig.app/api/ajaxSearch';

  const data = {
    q: url,
    t: 'media',
    lang: 'en',
  };

   const headers = {
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    "Content-Type": "application/x-www-form-urlencoded",
    Origin: "https://saveig.app",
    Referer: "https://saveig.app/en/instagram-video-downloader",
    "Sec-Ch-Ua": '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "set-Gpc": 1,
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.67",
    "X-Requested-With": "XMLHttpRequest",
  };
  try {
    const response = await axios.post(apiUrl, qs.stringify(data), { headers });
    const x = response.data;
    const y = x.data;
    const $ = cheerio.load(y);

    const filter1 = $('.download-items');
    const maindata = filter1.find('.download-items__btn a').attr('href');

    return maindata;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}/download-instagram-video?url=<instagram_video_url>`);
});
