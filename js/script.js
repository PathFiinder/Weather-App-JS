document.addEventListener("DOMContentLoaded", function() {
  const formInput = document.querySelector(".form__input");
  const fromButtonIn = document.querySelector(".form__button");
  const formSearchedCities = document.querySelector(".form__searchedCities");
  const mainBarButton = document.querySelector('.main__barIcon');
  const aside = document.querySelector('.aside');
  const asideIcon = document.querySelector('.aside__icon');
  const mainContent = document.querySelector('.main__mainContent');
  const weatherApiKey = "070952ed03622d9e03493687ae0cdfa5";

  const loadCities = () => {
    const repData = [];
    return fetch("https://pathfiinder.github.io/Weather-App-JS/data/pl.json")
      .then(resp => resp.json())
      .then(data => {
        data.forEach(ele => {
          repData.push(ele.city);
        });
        return repData;
      })
      .catch(err => console.log(err));
  };

  const createSingleSearchedCity = value => {
    return `<li class="searchedCities__item" data-name="${value}">${value}, Polska</li>`;
  };

  const getWeekday = (nr) => {
    switch(nr){
      case 0: return "Niedziela"; break;
      case 1: return "Poniedziałek"; break;
      case 2: return "Wtorek"; break;
      case 3: return "Środa"; break;
      case 4: return "Czwartek"; break;
      case 5: return "Piątek"; break;
      case 6: return "Sobota"; break;
    }
  }

  const getWeekdayShort = (nr) => {
    switch(nr){
      case 0: return "niedz"; break;
      case 1: return "pon"; break;
      case 2: return "wt"; break;
      case 3: return "śr"; break;
      case 4: return "czw"; break;
      case 5: return "pt"; break;
      case 6: return "sob"; break;
    }
  }

  const getMonthName = (nr) => {
    switch(nr) {
      case 0: return "Styczeń"; break;
      case 1: return "Luty"; break;
      case 2: return "Marzec"; break;
      case 3: return "Kwiecień"; break;
      case 4: return "Maj"; break;
      case 5: return "Czerwiec"; break;
      case 6: return "Lipiec"; break;
      case 7: return "Sierpień"; break;
      case 8: return "Wrzesień"; break;
      case 9: return "Październik"; break;
      case 10: return "Listopad"; break;
      case 11: return "Grudzień"; break;
    }
  }

  const loadWeather = (city) => {
    return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${weatherApiKey}&units=metric`)
           .then(resp => resp.json())
           .then(data => data)
           .catch(error => console.log(error));
  }

  const getWeather = (nr) => {
    const id = nr.slice(0,2);
      switch(id){
        case "01": 
            return {iconNr: "01", text: "Jest słonecznie"};
        case "02":
            return {iconNr: "02", text: "Jest pochmurno z przejaśnieniami"};
        case "03": 
          return {iconNr: "03", text: "Jest pochmurno"};
        case "04": 
          return {iconNr: "03", text: "Jest pochmurno"};
        case "09": 
          return {iconNr: "04", text: "Pada deszcz"};
        case "10":
          return {iconNr: "06", text: "Jest pochmurno z przejaśnieniami"};
        case "11": 
          return {iconNr: "04", text: "Pada deszcz"};
        case "13": 
          return {iconNr: "05", text: "Pada śnieg"};
        case "50":
          return {iconNr: "07", text: "Mgła"};
      }
  }


  const getWeather5Days = (city) => {
    return fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${weatherApiKey}&units=metric`)
           .then(resp => resp.json())
           .then(data => data)
           .catch(err => console.log(err));
  }


  const createListDate = (list) => {
    let listInnerHtml = "";
    let index = 1;

    if (list.length === 4) {
      for(let i=0;i<=4;i++){
        if(i === 4){
          listInnerHtml += createSingleDate(list[i],index,false);
          console.log(i)
                              
        } else {
          listInnerHtml += createSingleDate(list[i],index,true);
          console.log(i)
        }        
        index++;
      }
      return listInnerHtml;
    } else if (list.length > 4) {
      list.forEach(ele => {
        listInnerHtml += createSingleDate(ele, index,true);
        index++;
      });
      return listInnerHtml;
    }
  }

  const createSingleDate = (value,index,flag) => {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + index);
      console.log(value)
      return `<div class="weatherDaysContainer__item">
                <h3 class="weatherDaysContainer__weekDay">${getWeekdayShort(tomorrow.getDay())}</h3>
                <h3 class="weatherDaysContainer__dayMonth">${tomorrow.getDate()} ${getMonthName(tomorrow.getMonth()).slice(0,3)}</h3>
                ${flag === true ?
                 `<img class="weatherDaysContainer__img" src="../images/${getWeather(value.weather[0].icon).iconNr}.png" alt="Weather img">
                  <p class="weatherDaysContainer__temp">temp. max </br><span class="weatherDaysContainer__temp--bold">${(value.main.temp_max).toFixed(0)} <sup style="font-size:xx-small; vertical-align:super; font-size: 15px;">o</sup>C</p>
                  <p class="weatherDaysContainer__pressure">ciśnienie </br><span class="weatherDaysContainer__temp--bold">${(value.main.pressure).toFixed(0)} hPa</p>` 
                  : `<h3 class="weatherDaysContainer__noItems">Brak danych</h3>`}
                
                </div>`
      
  }


  const createMainContent = async value => {

    const date = new Date();
    const respData = await loadWeather(value);
    const weather = getWeather(respData.weather[0].icon)
    const weather5DaysAll = await getWeather5Days(value);
    const weather5DaysData = [];

    weather5DaysAll.list.forEach((ele) => {
      if(ele.dt_txt.slice(11,13) === "12") {
        if(ele.dt_txt.slice(0,10) !== `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`) {
          weather5DaysData.push(ele);
        }
      }
    })

    mainContent.innerHTML = `
      <div class="mainContent__fullDate"> 
        <p mainContent__date>${getWeekday(date.getDay())}, ${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()}</p>
        <p mainContent__time>${date.getHours()}:${date.getMinutes()}</p>
      </div>
      <img class="mainContent__weatherImg" src="./images/${weather.iconNr}.png" alt="Weather img">
      <h2 class="mainContent__city">${value}</h2>
      <h3 class="mainContent__weatherDescribe">${weather.text}</h3>
      <div class="mainContent__weatherDataContainer weatherDataContainer">
          <div class="weatherDataContainer__item weatherDataContainer__temp">${respData.main.temp.toFixed(1)} <sup style="font-size:xx-small; vertical-align:super; font-size: 15px;">o</sup>C</div>
          <ul class="weatherDataContainer__item weatherDataContainer__list">
            <li class="weatherDataContainer__listItem">temp. min ${respData.main.temp_min.toFixed(1)} <sup style="font-size:xx-small; vertical-align:super; font-size: 14px;">o</sup>C</li>
            <li class="weatherDataContainer__listItem">temp. max ${respData.main.temp_max.toFixed(1)} <sup style="font-size:xx-small; vertical-align:super; font-size: 14px;">o</sup>C</li>
          </ul>
          <ul class="weatherDataContainer__item weatherDataContainer__item--last">
            <li class="weatherDataContainer__listItem">ciśnienie </br> <span class="weatherDataContainer__listItem--bold">${respData.main.pressure} hPa</span></li>
            <li class="weatherDataContainer__listItem">wilgotność </br> <span class="weatherDataContainer__listItem--bold">${respData.main.humidity} %</span></li>
            <li class="weatherDataContainer__listItem">wiatr </br> <span class="weatherDataContainer__listItem--bold">${respData.wind.speed} km/h</span></li>
          </ul>
      </div>
      <div class="mainContent__weatherDaysContainer weatherDaysContainer">
        ${createListDate(weather5DaysData)}
      </div>
    `
  }

  const main = async () => {
    let chosenCity = localStorage.getItem("chosenCity") || "";
    formInput.value = chosenCity || "";

    if (chosenCity !== "") {
      document.querySelector(".aside").classList.add("aside--hide");
      setTimeout(() => document.querySelector(".main").classList.add("main--active"),2500);
      createMainContent(chosenCity);
    } else {
      document.querySelector(".aside").classList.remove("aside--hide");
      document.querySelector(".main").classList.remove("main--active");
    }

    const cities = await loadCities();
    let findedCities = [];

    formInput.addEventListener("input", event => {
      const inputValue = event.target.value;
      findedCities = [];

      while (formSearchedCities.firstChild) {
        formSearchedCities.removeChild(formSearchedCities.firstChild);
      }

      cities.filter(value => {
        if (value.toLowerCase().startsWith(inputValue.toLowerCase())) {
          findedCities.push(value);
        }
      });

      if (inputValue === "") findedCities = [];

      if (findedCities.length === 0) {
        formSearchedCities.classList.remove("form__searchedCities--active");
        fromButtonIn.classList.remove("form__button--hidden");
      } else if (findedCities.length > 0) {
        let innerHtmlValue = "";
        formSearchedCities.classList.add("form__searchedCities--active");
        fromButtonIn.classList.add("form__button--hidden");

        findedCities.forEach(element => {
          innerHtmlValue += createSingleSearchedCity(element);
        });
        formSearchedCities.innerHTML = innerHtmlValue;
      }
    });

    formSearchedCities.addEventListener("click", event => {
      chosenCity = event.target.dataset.name;
      findedCities = [];

      while (formSearchedCities.firstChild) {
        formSearchedCities.removeChild(formSearchedCities.firstChild);
      }

      formSearchedCities.classList.remove("form__searchedCities--active");
      fromButtonIn.classList.remove("form__button--hidden");
      formInput.value = chosenCity;

      localStorage.setItem("chosenCity", chosenCity);
      console.log(chosenCity);
      console.log(findedCities);
    });

    document.querySelector(".form__button--in").addEventListener("click", event => {
        if (chosenCity !== "") {
          document.querySelector(".aside").classList.add("aside--hide");
          document.querySelector(".main").classList.add("main--active");

          console.log(chosenCity)
          createMainContent(chosenCity);
          

        }
      });

    mainBarButton.addEventListener('click', () => {
      aside.classList.toggle("aside--hide");
      aside.style.animationDelay = "0.1s"
      aside.style.animationDuration = "0.5s"
      asideIcon.classList.add('aside__icon--active');
      document.querySelector(".main").classList.toggle("main--active");
    })

    asideIcon.addEventListener('click', () => {
          document.querySelector(".aside").classList.add("aside--hide");
          document.querySelector(".main").classList.add("main--active");       
    })

  };

  main();
});
