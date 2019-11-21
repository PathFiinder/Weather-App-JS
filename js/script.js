document.addEventListener("DOMContentLoaded", function() {
  const formInput = document.querySelector(".form__input");
  const fromButtonIn = document.querySelector(".form__button");
  const formSearchedCities = document.querySelector(".form__searchedCities");
  const mainBarButton = document.querySelector('.main__barIcon');
  const aside = document.querySelector('.aside');
  const asideIcon = document.querySelector('.aside__icon');
  const mainContent = document.querySelector('.main__mainContent');

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


  const createMainContent = value => {

    const date = new Date();
    console.log(date)
    mainContent.innerHTML = `
      <div class="mainContent__date"> 


      </div>
      <h2 class="mainContent__city">${value}</h2>
    
    
    
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
