const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searcWeather]");
const userConatiner = document.querySelector(".weather-container");
const grantAcessContainer = document.querySelector(".grant-location-container");
const searchForm  = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))
        {
            userInfoContainer.classList.remove("active");
            grantAcessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // now i m in your weather tab ,toh weather dispaly krna hoga ,so lets check local storage first
            // for coordinates ,if we have saved them there and fetch them by getfromsessionstorage function
            getfromSessionStorage();

        }
    }
    

}

userTab.addEventListener("click",()=>{
    // pass clicked tab an input parameter
    switchTab(userTab)
})
searchTab.addEventListener("click",()=>{
    // pass clicked tab an input parameter
    switchTab(searchTab)
})

// check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // agr local coordinates nhi pde
        grantAcessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates)
        fetchuserWeatherInfo(coordinates)
    }
}

async function fetchuserWeatherInfo(coordinates){
     const {lat,lon} = coordinates;
    //  make grant access container remove
     grantAcessContainer.classList.remove("active") 

    //  make loader visible
    loadingScreen.classList.add("active")

    // api call

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );

         const data =await response.json();
         
         loadingScreen.classList.remove("active");
         userInfoContainer.classList.add("active");

         renderWeatherinfo(data);
    }
    catch(error){
        loadingScreen.classList.remove("active")
        console.log(`error => ${error}`)
    }
}

function renderWeatherinfo(weatherInfo){
    //   firstly we have to fetch elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[ data-windSpeed]");
    const humidity = document.querySelector("[ data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch values from weather info object and put UI elements

   cityName.innerText = weatherInfo?.name;
   countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   desc.innerText = weatherInfo?.weather?.[0]?.description;
   weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
   temp.innerText = `${weatherInfo?.main?.temp} °C `;
   windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
   humidity.innerText = `${weatherInfo?.main?.humidity}%`;
   cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}


function getLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{
      alert("no geolocation support available")
    }
  }

function showPosition(position){
  const userCoordinates={
    lat : position.coords.latitude,
    lon : position.coords.longitude
  }
  sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
  fetchuserWeatherInfo(userCoordinates);
}


const grandAccessButton = document.querySelector("[data-grantAccess]");
grandAccessButton.addEventListener("click", getLocation);

// for search bar

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    let cityName = searchInput.value;

   if( cityName === "")
   return;
 else
         fetchsearchWeatherInfo(cityName);
     
  
});

 async function fetchsearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active"); 
    grantAcessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherinfo(data);
    }
    catch(error){
        console.log(`error is ${error}`)
    }
    
 }

