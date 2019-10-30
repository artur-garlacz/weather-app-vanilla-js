const API_KEY = "d7818ca22a941ac71e9f35b02762b407"; //

document.addEventListener("DOMContentLoaded", () => {
    _viewModel.setView()
})
const geocoder = new google.maps.Geocoder();

const _viewModel = {
    addressValue: document.getElementById("title-location"),
    tempValue: document.querySelector(".temp"),
    temp_maxValue: document.querySelector(".high"),
    temp_minValue: document.querySelector(".low"),
    humidityValue: document.querySelector(".humidity-value"),
    pressureValue: document.querySelector(".pressure-value"),
    conditionsValue: document.querySelector(".conditions"),
    currentPosition: null,
    setView: () => {
        _viewModel.getLocation()
        let titleDate = document.getElementById("title-date");
        titleDate.innerHTML = _viewModel.getCurrentTime()
        document.querySelector(".form-search-btn").addEventListener("click", _viewModel.fetchWeatherDataFromUser)
        document.getElementById("location").addEventListener("click", _viewModel.getLocation)
    },
    getLocation: () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                _viewModel.currentPosition = position
                _viewModel.getAddressFromLatLng(position)
                _viewModel.fetchWeatherDataFromLatLng(position)
                console.log(_viewModel.currentPosition)
            });
            console.log(navigator.geolocation)
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    },

    getAddressFromLatLng: position => {
        let { latitude, longitude } = position.coords;
        let latlng = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
        geocoder.geocode({ 'location': latlng }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    console.log(results[0].formatted_address)
                    _viewModel.addressValue.innerHTML = results[0].formatted_address
                } else {
                    _viewModel.addressValue.innerHTML = ""
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        });
    },
    getCurrentTime: () => {
        const date = new Date();
        const monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        let day = date.getDate();
        let monthIndex = date.getMonth();
        let year = date.getFullYear();
        return day + ' ' + monthNames[monthIndex] + ' ' + year + " | " + date.toLocaleTimeString();
    },
    fetchWeatherDataFromLatLng: async position => {
        let { latitude, longitude } = position.coords;
        console.log(_viewModel.currentPosition)
        let currLat = latitude || 50.049683;
        let currLng = longitude || 19.944544;
        let api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${currLat}&lon=${currLng}&appid=${API_KEY}&units=metric`);
        let data = await api_call.json();
        _viewModel.displayData(data)
    },
    fetchWeatherDataFromUser: async () => {
        let city = document.getElementById("city-input").value
        let country = document.getElementById("country-input").value
        console.log(city, country)
        let api_call_by_user = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`);
        let data = await api_call_by_user.json();
        console.log(data)
        if (data.cod === 200) {
            _viewModel.displayData(data)
            _viewModel.addressValue.innerHTML = city + ", " + country
        } else {
            alert("City not found")
        }

    },
    displayData: data => {
        // change image and backgroundColor depends on current weather  
        const { humidity, pressure, temp, temp_max, temp_min } = data.main
        const { main, icon } = data.weather[0]
        const { tempValue,
            temp_maxValue,
            temp_minValue,
            humidityValue,
            pressureValue,
            conditionsValue } = _viewModel

        tempValue.innerHTML = temp
        temp_maxValue.innerHTML = temp_max
        temp_minValue.innerHTML = temp_min
        humidityValue.innerHTML = humidity
        pressureValue.innerHTML = pressure
        conditionsValue.innerHTML = main
        console.log(data)
        document.body.style.backgroundColor = _viewModel.getChangeBackground(main)
        document.querySelector(".inner").innerHTML = ""
        let weatherImg = document.createElement("img");
        weatherImg.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png")
        document.querySelector(".inner").appendChild(weatherImg)
    },
    getChangeBackground: value => {
        // returns backgroundColor depends on current weather
        switch (value) {
            case "Thunderstorm":
                return backgroundColor = "#000000";
            case "Rain":
                return backgroundColor = "#3C424C";
            case "Snow":
                return backgroundColor = "#EDEFF3";
            case "Clouds":
                return backgroundColor = "#979999";
            case "Clear":
                return backgroundColor = "#86B9E0";
            case "Fog":
                return backgroundColor = "#B8B8B8";
            case "Drizzle":
                return backgroundColor = "#B8B8B8";
        }
    }
}