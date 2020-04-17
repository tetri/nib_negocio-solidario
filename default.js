window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    try {
      navigator.serviceWorker.register("serviceWorker.js");
      //console.log("Service Worker Registered");
    } catch (error) {
      //console.log("Service Worker Registration Failed");
    }
  }
});

function montaCard(item) {
  let card =
    '<div class="card border-secondary mb-3">' +
    '<div class="card-body">' +
    `    <h5 class="card-title">${item.nome}</h5>`;

  if (item.produtos)
    card += `    <p class="card-text">${item.produtos}</p>`;

  card += '</div><ul class="list-group list-group-flush">';

  if (item.local)
    card += `    <li class="list-group-item">${item.local} <a href="https://www.google.com/maps/search/${item.local}" rel="noreferrer" title="${item.local}" target="_blank" aria-label="ver no mapa"> <i class="fas fa-map-marker-alt"></i></a></li>`;

  if (item.telefone)
    card += `    <li class="list-group-item text-right">${item.telefone}</li>`;

  card += '</ul><div class="card-body">';

  if (item.link) {
    if (item.link.startsWith("http")) {
      card += `    <a class="card-link" href="${item.link}" rel="noreferrer" title="${item.nome}" target="_blank">${item.link}</a>`;
    } else if (item.link.startsWith("www")) {
      card += `    <a class="card-link" href="http://'${item.link}" rel="noreferrer" title="${item.nome}" target="_blank">${item.link}</a>`;
    }
  } else {
    card += item.link;
  }

  card += "</div>";
  card += "</div>";

  return card;
}

// -- search.js
function displaySearchResults(results, store) {
  let resultados = "<p>Nenhum resultado encontrado!</p>";

  if (results.length) {
    resultados = "";

    for (let i = 0; i < results.length; i++) {
      let item = store[results[i].ref];

      resultados += montaCard(item);
    }
  }

  document.getElementById("search-results").innerHTML = resultados;
}

function displayItems(_items) {
  let items = "<p>Nenhum item cadastrado!</p>";

  if (_items.length) {
    items = "";

    for (let i = 0; i < _items.length; i++) {
      let item = _items[i];
      //console.debug('item', item);

      items += montaCard(item);
    }
  }

  document.getElementById("items").innerHTML = items;
}

function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");

  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");

    if (pair[0] === variable) {
      return decodeURIComponent(pair[1].replace(/\+/g, "%20"));
    }
  }
}

let searchTerm = getQueryVariable("query");

if (searchTerm) {
  document.getElementById("search-box").setAttribute("value", searchTerm);

  // Initalize lunr with the fields it will be searching on. I've given title
  // a boost of 10 to indicate matches on this field are more important.
  let idx = lunr(function () {
    this.field("id");
    this.field("data");
    this.field("nome", { boost: 10 });
    this.field("produtos", { boost: 10 });
    this.field("local");
    this.field("telefone");
    this.field("entrega");
    this.field("link");
    this.field("ciente");
  });

  for (let key in items) {
    // Add the data to lunr
    idx.add({
      id: key,
      data: items[key].data,
      nome: items[key].nome,
      produtos: items[key].produtos,
      local: items[key].local,
      telefone: items[key].telefone,
      entrega: items[key].entrega,
      link: items[key].link,
      ciente: items[key].ciente,
    });

    let results = idx.search(searchTerm); // Get lunr to perform a search
    displaySearchResults(results, items); // We'll write this in the next section
  }
} else {
  displayItems(items);
}
// -- end search.js
