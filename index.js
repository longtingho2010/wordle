const PORT = 8000;

const axios = require("axios");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/word", async (reg, res) => {
  const options = {
    method: "GET",
    url: "https://random-words5.p.rapidapi.com/getMultipleRandom",
    params: {
      count: "5",
      wordLength: "5",
    },
    headers: {
      "X-RapidAPI-Key": "c39516e6b6msh435947c0b1d056ep1ed971jsn5e07ce639f74",
      "X-RapidAPI-Host": "random-words5.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.json(response.data[0]);
  } catch (error) {
    console.error(error);
  }
});
app.get("/check", async (req, res) => {
  const word = req.query.word;
  const options = {
    method: "GET",
    url: "https://twinword-word-graph-dictionary.p.rapidapi.com/association/",
    params: { entry: word },
    headers: {
      "X-RapidAPI-Key": "c39516e6b6msh435947c0b1d056ep1ed971jsn5e07ce639f74",
      "X-RapidAPI-Host": "twinword-word-graph-dictionary.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.json(response.data.result_msg);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => console.log(`serer running on port ${PORT}`));
