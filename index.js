import express from "express";
import axios from "axios";
import 'dotenv/config';

const app = express();
const port = 3000;
const apiKEY = process.env.API_KEY;
const URL = 'https://api.openweathermap.org/data/2.5/weather';

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", {
        weatherIcon: null,
        temperature: null
    });
});

app.post("/getWeather", async (req, res) => {
    try {
        const city = req.body.city;
        const weatherResponse = await axios.get(`${URL}?q=${city}&appid=${apiKEY}`);
        
        console.log(weatherResponse.data);
        
        const weatherData = weatherResponse.data;

        if (weatherData.cod === '404') {
            res.render('index', { message: "City not found" });
        }
        
        const weatherIcon = weatherData.weather[0].icon;
        const temperatureCelsius = (weatherData.main.temp - 273.15).toFixed(1);
        
        res.render('index.ejs', {
            weatherIcon: weatherIcon,
            temperature: temperatureCelsius
        });
    } catch (error) {
        console.error('Error Details:', error.response ? error.response.data : error.message);
        res.render('index.ejs', { message: 'City not found.' });
    }
});


app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
});
