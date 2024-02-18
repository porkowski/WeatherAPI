


//Grab form elements from DOM
const form = document.getElementById("formId");
const text = document.getElementById("Location");

//Create stored forecast array 
let storedForecast = [];

//Create constructor for Forecast
function Forecast(date,sunrise,sunset,condition,conditionCode,maxtempC,mintempC,maxtempF,mintempF,totalprecipIn,totalprecipMm,tsnowCm,maxwindKph) {
    this.date=date;
    this.sunrise=sunrise;
    this.sunset=sunset;
    this.condition=condition;
    this.conditionCode=conditionCode;
    this.maxtempC=maxtempC;
    this.mintempC=mintempC;
    this.maxtempF=maxtempF;
    this.mintempF=mintempF;
    this.totalprecipIn=totalprecipIn;
    this.totalprecipMm=totalprecipMm;
    this.tsnowCm=tsnowCm;
    this.maxwindKph=maxwindKph;

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

        const day = new Forecast(dayNum,sunrise,sunset,condition,conditionCode,maxtempC,mintempC,maxtempF,mintempF,totalprecipIn,totalprecipMm,tsnowCm,maxwindKph);
        //Push object to array of 3 day forecast
        forecastarray.push(day);

    }

    return forecastarray;
}


  

async function storeForecast() {
    try {
    const location = text.value;
    const forecast = await getForecast(location);
    const arrayWeather = await getData(forecast);
    return arrayWeather;
    }catch {
        alert('An error has occured. Please select another location.')
    }
}

function displayInCard(forecastarray) {
    //First, start with changing the image to the appropriate weather condition
    const img = document.querySelectorAll("img");
    const card = document.querySelectorAll("#card");
    img.forEach(image=> {
        const id = image.parentNode.parentNode.getAttribute('id');
        let condition = forecastarray[id].conditionCode;
        if (condition == '1003') {
             code = 'pcloudy'
        } else if (condition == '1006'|| condition == '1009') {
              code ='Cloudy'
        } else if (condition == '1000') {
              code='sunny'
         } else if (condition == '1030' || condition =='1063'|| condition =='1069' || condition == '1072' || condition=='1150'||condition=='1153'||condition=='1180'||condition=='1183'||condition=='1198'||condition =='1204'||condition=='1240'||condition=='1239'|| condition =='1189') {
             code='Lrain'
        }  else if (condition == '1066'|| condition == '1114'|| condition =='1117'||condition=='1210'||condition=='1213'||condition=='1216'||condition=='1219'||condition=='1222'||condition=='1225'||condition=='1255'||condition=='1258') {
             code='Snow'
        } else if (condition == '1087'||condition=='1273'||condition=='1276'||condition=='1279'||condition=='1282') {
             code='Tshower'
        } else if (condition == '1135' || condition == '1147') {
             code ='Foggy'
        } else if (condition =='1171'||condition=='1186'||condition=='1192'||condition=='1195'|| condition=='1201'||condition=='1207'||condition=='1243'||condition=='1246'||condition=='1252') {
             code='Rain'
        } else if (condition=='1237'||condition=='1261'||condition=='1264') {
             code='Hail'
        }

        image.setAttribute('src','weather/'+code+'.png');
    })

    //Create a list on each div to note all the remaining information per each given day
    card.forEach(card=> {
        
        const id = card.parentNode.getAttribute('id');
        const dayObject = forecastarray[id]; 
        const list = document.createElement("ul");
        
        //if a list already exists, remove it to start from a clear slate
        if (card.querySelector('ul') !== null) {
            card.querySelector('ul').remove();
        }
 

        list.appendChild(document.createElement('li')).textContent = `${dayObject.condition}`;

        //Check if Fahrenheit or Celsius is selected to display one or the other
        let selectedTemp = document.querySelector('input[name="temp"]:checked')
        if (selectedTemp.id == 'F') {
            list.appendChild(document.createElement('li')).textContent = `High of ${Math.round(dayObject.maxtempF)}ºF`
            list.appendChild(document.createElement('li')).textContent = `Low of ${Math.round(dayObject.mintempF)}ºF`
            list.appendChild(document.createElement('li')).textContent = `Sun rise at ${dayObject.sunrise}`
            list.appendChild(document.createElement('li')).textContent = `Sun set at ${dayObject.sunset}`

            if (dayObject.totalprecipIn>0) {
                list.appendChild(document.createElement('li')).textContent = `Total expected precipitation is ${dayObject.totalprecipIn} inches`
            }
        } else if (selectedTemp.id == 'C') {
            list.appendChild(document.createElement('li')).textContent = `High of ${Math.round(dayObject.maxtempC)}ºC`
            list.appendChild(document.createElement('li')).textContent = `Low of ${Math.round(dayObject.mintempC)}ºC`
            list.appendChild(document.createElement('li')).textContent = `Sun rise at ${dayObject.sunrise}`
            list.appendChild(document.createElement('li')).textContent = `Sun set at ${dayObject.sunset}`

            if (dayObject.totalprecipIn>0) {
                list.appendChild(document.createElement('li')).textContent = `Total expected precipitation is ${dayObject.totalprecipMm} mm`
            }
        }

            if (dayObject.maxwindKph<11) {
                list.appendChild(document.createElement('li')).textContent =  `Calm winds expected: Maximum windspeed at ${Math.round(dayObject.maxwindKph)} Kph`
            } else if (11<dayObject.maxwindKph<38) {
                list.appendChild(document.createElement('li')).textContent =  `Moderate winds expected: Maximum windspeed at ${Math.round(dayObject.maxwindKph)} Kph`
            } else if (dayObject.maxwindKph>38) {
                list.appendChild(document.createElement('li')).textContent =  `Heavy winds expected: Maximum windspeed at ${Math.round(dayObject.maxwindKph)} Kph`
            }
            
  
            if (dayObject.tsnowCm>0) {
                list.appendChild(document.createElement('li')).textContent = `Total expected snowfall is ${dayObject.tsnowCm} cm`
            }


        card.appendChild(list);
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






