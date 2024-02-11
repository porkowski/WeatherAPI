//Weather icons from Tiru19 on reddit

//Grab form elements from DOM
const form = document.getElementById("formId");
const text = document.getElementById("Location");

//Create stored forecast array 
let storedForecast = [];

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

async function storeForecast() {
    const location = text.value;
    const forecast = await getForecast(location);
    const arrayWeather = await createObjects(forecast);
    return arrayWeather;
}

function displayInCard(forecastarray) {
    const img = document.querySelectorAll("img");
    img.forEach(image=> {
        const id = image.parentNode.parentNode.getAttribute('id');
        let condition = forecastarray[id].condition;
        if (condition == '1003') {
            let code = 'pcloudy'
        } else if (condition == '1006') {
            let code ='cloudy'
        } else if (condition == '1000') {
            let code='sunny'
        } else if (condition == '1030' || condition =='1063'|| condition =='1069' || condition == '1072' || condition=='1150'||condition=='1153'||condition=='1180'||condition=='1183'||condiiton='1198'||condition =='1204'||condition=='1240'||condition=='1239') {
            let code='Lrain'
        }  else if (condition == '1066'|| condition == '1114'|| condition =='1117'||condition=='1210'||condition=='1213'||condition=='1216'||condition=='1219'||condition=='1222'||condition=='1225'||condition=='1255'||condition=='1258') {
            let code='snow'
        } else if (condition == '1087'||condition=='1273'||condition=='1276'||condition=='1279'||condition=='1282') {
            let code='Tshower'
        } else if (condition == '1135' || condition == '1147') {
            let code ='Foggy'
        } else if (condition =='1171'||condition=='1186'||condition=='1192'||condition=='1195'|| condition=='1201'||condition=='1207'||condition=='1243'||condition=='1246'||condition=='1252') {
            let code='Rain'
        } else if (condition=='1237'||condition=='1261'||condition=='1264') {
            let code='Hail'
        }


        image.setAttribute('src','weather/'+code+'.png');
    })
}

async function submitForm(event) {
    //Prevent form from submitting, just grab location and call getForecast();
    event.preventDefault();
    //Don't need to create new variable, already  declared storedForecast above. Every time the submit button is clicked, another forecast is stored.
    storedForecast = await storeForecast();
    displayInCard(storedForecast);

    }





form.addEventListener('submit',submitForm)






