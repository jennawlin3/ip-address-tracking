const $searchInput = document.querySelector("#search-input");
const $btnSearch = document.querySelector("#search-btn");
const $submitSearch = document.querySelector("#ip-search_form");
const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const urlPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
let ipValue;
let urlValue;

const $ipAddress = document.querySelector("#ip-address");
const $ipLocation = document.querySelector("#location");
const $ipTimezone = document.querySelector("#timezone");
const $ispInfo = document.querySelector("#isp-info");
let result;

var map = L.map('map', {
    center: [34.08057, -118.07285],
    zoom: 15
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

var marker = L.marker([34.08057, -118.07285]).addTo(map);

$searchInput.addEventListener("input", e => {
    if(e) {
        if(ipPattern.test(e.target.value)) {
            ipValue = e.target.value;
        }
        if(urlPattern.test(e.target.value)) {
            urlValue = e.target.value;
        }        
    }
})

$submitSearch.addEventListener("submit", e => {
    e.preventDefault();
})

$btnSearch.addEventListener("click", e => {
    e.preventDefault();

    if(ipValue !== undefined || urlValue !== undefined) {
        async function searchIP() {  
            try {
                if(ipValue) {
                    const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_hBWuru09UHU8uxTrgNdjWnDA8QIcu&ipAddress=
                    ` + ipValue);
                    console.log(response);
                    if(response.status === 404) {
                        console.log("Oops, insert another IP or URL");
                    }

                    result = await response.json();
                    $ipAddress.textContent = result.ip;
                    $ipLocation.textContent = result.location["region"] + "," + result.location["country"];
                    $ipTimezone.textContent = result.location["timezone"];
                    $ispInfo.textContent = result.isp || "Not provided by the API";
                    console.log(result);
                    paintMap(result);        
                }
                if(urlValue) {
                    const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_hBWuru09UHU8uxTrgNdjWnDA8QIcu&domain=
                    ` + urlValue);

                    result = await response.json();
                    $ipAddress.textContent = result.ip;
                    $ipLocation.textContent = result.location["region"] + "," + result.location["country"];
                    $ipTimezone.textContent = result.location["timezone"];
                    $ispInfo.textContent = result.isp || "Not provided by the API";
                    console.log(result);
                    paintMap(result);
                }
            } catch (error) {
            console.log(`There was an error, please enter a valid IP Address or a valid url`)
        } 
    }
    searchIP();
    $submitSearch.reset();
    ipValue = "";
    urlValue = "";
    } else {
        console.log("Insert a valid url or an IP address");
    }
});

async function paintMap(result) {
    
    map.flyTo([result.location.lat, result.location.lng], 15, { animate: true, duration: 0.4 });

    marker.setLatLng([result.location.lat, result.location.lng]);    
}


