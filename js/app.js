window.addEventListener('load', () => {
    let longitude;
    let latitude;

    const temp = {
        description: document.querySelector('.temperature-description'),
        degree: document.querySelector('.temperature-degree'),
        degreeSection: document.querySelector('.degree-section'),
        span: document.querySelector('.degree-section span')
    };

    const location = {
        timezone: document.querySelector('.location-timezone')
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            longitude = position.coords.longitude;
            latitude = position.coords.latitude;


            const proxy = "https://cors-anywhere.herokuapp.com/"
            const darkSkyApi = `${proxy}https://api.darksky.net/forecast/ddc78902b33a3015b36c9228ea9f9313/${latitude},${longitude}`;

            const key = 'AIzaSyAIgyfaTSNcXoZg6DFdUjH3jMS0qJpGipo';
            const latlng = `${latitude},${longitude}`;

            //const api = `${proxy}https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=500&key=${key}`;
            const googleApi = `${proxy}https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${key}`;

            const urls = [darkSkyApi, googleApi]

            Promise.all(urls.map(url => 
                fetch(url)
                .then(response => response.json())
                ))
                .then(data => {
                    console.log(data);

                    const code = data[1].plus_code.compound_code.split(' ')[1]
                    const cityLength = code.length - 1;
                    const city = code.substr(0, cityLength);
                    location.timezone.textContent = city;

                    const { temperature, summary, icon } = data[0].currently;
                    
                    // Set DOM elements from the API
                    temp.degree.textContent = temperature;
                    temp.description.textContent = summary;
                    // location.timezone.textContent = data.timezone;

                    // Formula for Celcius
                    const celcius = (temperature - 32) * (5 / 9);

                    // Set the icon
                    setIcons(icon, document.querySelector('.icon'));

                    // Change temperature to Celcius/Farenheit
                    temp.degreeSection.addEventListener('click', () => {
                        if (temp.span.textContent === '°F') {
                            temp.span.textContent = '°C';
                            temp.degree.textContent = Math.floor(celcius);
                        }
                        else if (temp.span.textContent === '°C') {
                            temp.span.textContent = '°F';
                            temp.degree.textContent = temperature;
                        }
                    });
                });
        });
    }

    function setIcons (icon, iconID) {
        const skycons = new Skycons({ "color": "white" });
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }

});