const { max } = require("date-fns");

//Grab form elements from DOM
const form = document.getElementById("formId");
const text = document.getElementById("Location");

//Create constructor for Forecast
function Forecast(sunrise,sunset,condition,conditionCode,maxtempC,mintempC,maxtempF,mintempF,totalprecipIn,totalprecipMm,tsnowCm,maxwindKph,maxwindMph) {
    this.sunrise=sunrise;
    this.sunset=sunset;
    this.condition=condition;
    this.condition=conditionCode;
    this.maxtempC=maxtempC;
    this.mintempC=mintempC;
    this.maxtempF=maxtempF;
    this.mintempF=mintempF;
    this.totalprecipIn=totalprecipIn;
    this.totalprecipMm=totalprecipMm;
    this.tsnowCm=tsnowCm;
    this.maxwindKph=maxwindKph;
    this.maxwindMph=maxwindMph;
}

async function getForecast(loc) {
    try {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=3b6092868dac4a54889194837232611&q=${loc}&days=3`, {
        mode: 'cors'
    });
    const json = await response.json();
    const array = json.forecast.forecastday;
    //Return array holding 3 days worth of weather for location
    return array[0];
    } catch(error) {
        console.log(error);
    }
}
  

function submitForm(event) {
    //Prevent form from submitting, just grab location and call getForecast();
    event.preventDefault();
    const location = text.value;
    getForecast(location).then(response=>console.log(response));
}

form.addEventListener('submit',submitForm)






