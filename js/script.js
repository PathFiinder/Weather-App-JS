document.addEventListener("DOMContentLoaded", function() {
  const formInput = document.querySelector(".form__input");
  const fromButtonIn = document.querySelector('.form__button');
  const formSearchedCities = document.querySelector(".form__searchedCities");
  formInput.value = "";

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
    return `<li class="searchedCities__item">${value}, Polska</li>`;
  };
  const main = async () => {
    let chosenCity = "";
    const cities = await loadCities();

    formInput.addEventListener("input", event => {
      const inputValue = event.target.value;
      let findedCities = [];

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
        fromButtonIn.classList.remove('form__button--hidden');
      } else if (findedCities.length > 0) {
        let innerHtmlValue = "";
        formSearchedCities.classList.add("form__searchedCities--active");
        fromButtonIn.classList.add('form__button--hidden');
        findedCities.forEach(element => {
          innerHtmlValue += createSingleSearchedCity(element);
        });
        formSearchedCities.innerHTML = innerHtmlValue;
      }

      console.log(findedCities);
    });
  };
  main();
});
