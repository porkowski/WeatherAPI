//Grab form elements from DOM
const form = document.getElementById("formId");
const text = document.getElementById("Location");

async function getForecast(loc) {
    try {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=3b6092868dac4a54889194837232611&q=${loc}&days=3`, {
        mode: 'cors'
    });
    const json = await response.json();
    return json.forecast.forecastday;
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






