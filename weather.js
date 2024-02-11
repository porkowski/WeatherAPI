//Grab form elements from DOM
const form = document.getElementById("formId");
const text = document.getElementById("Location");

//Create constructor for Forecast
function Forecast(date,sunrise,sunset,condition,conditionCode,maxtempC,mintempC,maxtempF,mintempF,totalprecipIn,totalprecipMm,tsnowCm,maxwindKph,maxwindMph) {
    this.date=date;
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
    return array;
    } catch(error) {
        console.log(error);
    }
}
  

function submitForm(event) {
    //Prevent form from submitting, just grab location and call getForecast();
    event.preventDefault();
    const location = text.value;
    getForecast(location).then(response=>createObjects(response)).then(info=>console.log(info[0])).catch(error=>alert(error));
}

function getData(array) {
    let forecastarray= [];
    for (date of array) {
        //Create variables for each parameter that will be used to create new Forecast Object
        const astro = date.astro;
        const d = date.day;


        const dayNum = date.date;
        const sunrise = astro.sunrise;
        const sunset = astro.sunset;
        const condition = d.condition.text;
        const conditionCode = d.condition.code;
        const maxtempC = d.maxtemp_c;
        const mintempC = d.mintemp_c;
        const maxtempF = d.maxtemp_f;
        const mintempF = d.mintemp_f;
        const totalprecipIn = d.totalprecip_in;
        const totalprecipMm = d.totalprecip_mm;
        const tsnowCm = d.totalsnow_cm;
        const maxwindKph = d.maxwind_kph;
        const maxwindMph = d.maxwindMph;
         
        const day = new Forecast(dayNum,sunrise,sunset,condition,conditionCode,maxtempC,mintempC,maxtempF,mintempF,totalprecipIn,totalprecipMm,tsnowCm,maxwindKph,maxwindMph);
        
        //Push object to array of 3 day forecast
        forecastarray.push(day);

    }

    return forecastarray;
}

async function createObjects(array) {

    const forecastInfo = await getData(array);   
    return forecastInfo;
}



form.addEventListener('submit',submitForm)






