"use strict";

// CONSTANTES
// Input, donde meten la búsqueda
const searchText = document.querySelector(".js_formInput");
// Botón de buscar
const searchButton = document.querySelector(".js-formButton");
// Botón de reset
const resetButton = document.querySelector("js-resetButton");
// Donde se pintan las series
const seriesList = document.querySelector(".js-searchResult");
// Zona de búsqueda, el form
const requestPanel = document.querySelector(".js-form");
// Donde se pintan las favoritas
const listFav = document.querySelector(".js-favListCompleted");


// VARIABLES
let series = [];
let favorites = [];


// AL ARRANCAR LA PÁGINA
getFromLocalStorage();

function handleSearch() {
  apiRequest(searchText.value);
}

//Obtener los datos de la API
function apiRequest() {
  return fetch(`https://api.tvmaze.com/search/shows?q=${searchText.value}`)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        const series = data[i];
        series.push(show);
      }
      paintSeries();
    })
    .catch((error) => {
      console.log(error);
    });
}
  

// PINTAR LAS SERIES
function paintSeries() {
    // Lo que vamos a rellenar
    seriesList.innerHTML = "";
    let html = "";
    let favClass = "";
    // Bucle: que recorra las series del API
    for (const serie of series) {
      const isFav = isFavorite(serie);
      if (isFav) {
        favClass = "serie--favorite";
      } else {
        favClass = "";
      }
      html = `<li id=${serie.id} class= "searchResult_elem js-searchResult_elem ${favClass}">`;
      // Si la serie no tiene imagen
      if (null === serie.image) {
        html += `<img class="searchResult_elem-img" 
          src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" 
          title=${serie.name} alt=${serie.name}/>`;
      } else {
          // Si tiene, que se muestre su imagen correspondiente
        html += `<img class="searchResult_elem-img"
          src=${serie.image.medium}
          title=${serie.name} alt=${serie.name}/>`;
      }
      // Que se muestre el título
      html += `<h3>${serie.name}</h3>`;
      html += `</li>`;
      seriesList.innerHTML += html;
      listenClickSeries();
    }
  }

// ???
function isFavorite(idSerie) {
    // el find devolverá undefined si la serie no está en el array de favoritas
    const favoriteFound = favorites.find((idFavorite) => {
        // el return dirá si la serie está o no en favoritas
      return idFavorite.id === idSerie.id;
    });
    if (favoriteFound === undefined) {
      // return dirá false cuando la serie no esté en favoritas
      return false;
    } else {
      // return dirá true cuando la serie sí esté en favoritas
      return true;
    }
  }

// ESCUCHAR EVENTOS EN LAS SERIES
function listenClickSeries() {
    const seriesCards = document.querySelectorAll(".js-searchResult_elem");
    for (const serieCard of seriesCards)
      serieCard.addEventListener("click", addFavorites);
  }


  // AÑADIR SERIE A FAVORITAS
function addFavorites(ev) {
    // Sacar id de la serie seleccionada
    const serieSelected = parseInt(ev.currentTarget.id);
    // Encontrar el id de la serie seleccionada entre las id de favoritas
    const serieClicked = series.find((idSerie) => {
      return idSerie.id === serieSelected;
    });
    const favAlready = favorites.findIndex((idFavorite) => {
      return idFavorite.id === serieSelected;
    });
  // Agregar serie
    if (favAlready === -1) {
      favorites.push(serieClicked);
    } else {
      favorites.splice(favAlready, 1);
    }
    paintSeries();
    paintFavorites();
    updateLocalStorage();
  }

// PINTAR LAS SERIES FAVORITAS
function paintFavorites() {
    // Lo que vamos a rellenar
    listFav.innerHTML = "";
    let htmlFav = "";
   // Bucle: que recorra las series de favoritas
    for (const serie of favorites) {
      htmlFav = `<li id=${serie.id} class="fav_section-list js-favSectionList">`;
      htmlFav += `<button id="${serie.id}" class="js-deleteCross fav_elem-delete ">x</button>`;
      // Si la serie favorita no tiene imagen
      if (null === serie.image) {
        htmlFav += `<img class="fav_elem-img"
            src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" 
            title=${serie.name} alt=${serie.name}/>`;
      } else {
          // Si la serie favorita tiene imagen
        htmlFav += `<img class="fav_elem-img"
            src=${serie.image.medium}
            title=${serie.name} alt=${serie.name}/>`;
      }
      htmlFav += `<h4 class="fav_elem-serieTitle"> ${serie.name}</h4>`;
      htmlFav += `</li>`;
      listFav.innerHTML += htmlFav;
  
      listenClickedFavorites();
    }
  }

  // ESCUCHAR EVENTOS EN LAS SERIES FAVORITAS
function listenClickedFavorites() {
    const favCards = document.querySelectorAll(".js-deleteCross");
    for (const favCard of favCards) favCard.addEventListener("click", deleteFav);
  }
  
  // ELIMINAR SERIE DE FAVORITAS
  function deleteFav(ev) {
    const favClicked = parseInt(ev.currentTarget.id);
    const favSelected = favorites.findIndex((idFav) => idFav.id === favClicked);
    favorites.splice(favSelected, 1);
    paintSeries();
    paintFavorites();
    updateLocalStorage();
  }
  
  function favHidden() {
    const favSection = document.querySelector(".js-favArea");
    if ((favSection.innerHTML = "")) {
      favSection.classList.add("js-hidden");
    } else {
      favSection.classList.remove("js-hidden");
    }
  }
  
  // preventDefault para evitar que la página se recargue involuntariamente
function handleForm(ev) {
    ev.preventDefault();
  }
  
  // Local storage
function updateLocalStorage() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function getFromLocalStorage() {
  favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
  paintFavorites();
}

// Hacer reset
function resetFavorites() {
  favorites = [];
  updateLocalStorage();
  paintFavorites();;
  for (const series of seriesList) {
    seriesList.classList.remove('selected');
  }
}

  // LISTENERS PRINCIPALES
  // Cuando se pulsa el botón de buscar:
  searchButton.addEventListener("click", handleSearch);
  // Cuando se pulsa sobre alguna serie:
  requestPanel.addEventListener("submit", handleForm);
  //Cuando se pulsa sobre el botón de reset: 
  resetButton.addEventListener('click', resetFavorites);
