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
    getPosition: position => {
        console.log(position)
        return position
    },
    getAddressFromLatLng: position => {
        let { latitude, longitude } = position.coords;
        let latlng = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
        geocoder.geocode({ 'location': latlng }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    console.log(results[0].formatted_address)
                    _viewModel.addressValue.innerHTML = results[0].formatted_address.split(",")[0]
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
        const { latitude, longitude } = position.coords;
        console.log(_viewModel.currentPosition)
        const currLat = latitude || 50.049683;
        const currLng = longitude || 19.944544;
        const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${currLat}&lon=${currLng}&appid=${API_KEY}&units=metric`);
        const data = await api_call.json();
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
        document.body.style.backgroundColor = "rgb(" + 255 / temp + "," + 255 / temp + "," + 255 / temp + ")";
        console.log(data)
        document.body.style.backgroundColor = _viewModel.getChangeBackground(main)
        let weatherImg = document.createElement("img");
        weatherImg.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png")
        document.querySelector(".inner").appendChild(weatherImg)
    },
    fetchWeatherDataFromUser: () => {
        let city = document.getElementById("city").value
        let country = document.getElementById("city").value
        // const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${currLat}&lon=${currLng}&appid=${API_KEY}&units=metric`);

    },
    getChangeBackground: value => {
        let backgroundColor = null;
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
                return backgroundColor = "#FFB300";
            case "Fog":
                return backgroundColor = "#B8B8B8";
            case "Drizzle":
                return backgroundColor = "#B8B8B8";
        }
        return backgroundColor;

        // if (mI {
        //     mRelativeLayout.setBackgroundColor(Color.parseColor("#FFB300"));
        // }
        // else if (mIcon.equals("clear-night")) {
        //     mRelativeLayout.setBackgroundColor(Color.parseColor("#121735"));
        // }
        // else if (mIcon.equals("rain")) {
        //     mRelativeLayout.setBackgroundColor(Color.parseColor("#3C424C"));
        // }
        // else if (mIcon.equals("snow")) {
        //     mRelativeLayout.setBackgroundColor(Color.parseColor("#EDEFF3"));
        // }
        // else if (mIcon.equals("sleet")) {
        //     mRelativeLayout.setBackgroundColor(Color.parseColor("#B8B8B8"));
        // }
        // else if (mIcon.equals("fog")) {
        //     mRelativeLayout.setBackgroundColor(Color.parseColor("#D3D2D3"));
        // }
        // else if (mIcon.equals("cloudy")) {
        //     mRelativeLayout.setBackgroundColor(Color.parseColor("#C9CACA"));
        // }
        // else if (mIcon.equals("partly-cloudy-day")) {
        //     mRelativeLayout.setBackgroundColor(Color.parseColor("#E8F3F7"));
        // }
        // else if (mIcon.equals("partly-cloudy-night")) {
        //     mRelativeLayout.setBackgroundColor(Color.parseColor("#7F706C"));
        // }
    }


}