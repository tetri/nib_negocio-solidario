var paginas = []
var paginaAtual = 0;

String.prototype.hashCode = function () {
  var hash = 0;
  if (this.length == 0) return hash;
  for (i = 0; i < this.length; i++) {
    char = this.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

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
    //`    <p>${item.data.toString().hashCode()}</p>` +
    `    <h5 class="card-title">${item.nome}</h5>`;

  if (item.produtos) card += `    <p class="card-text">${item.produtos}</p>`;

  card += '</div><ul class="list-group list-group-flush">';

  if (item.local)
    card += `    <li class="list-group-item">${item.local} <a href="https://www.google.com/maps/search/${item.local}" rel="noreferrer" title="${item.local}" target="_blank" aria-label="ver no mapa"> <i class="fas fa-map-marker-alt"></i></a></li>`;

  if (item.telefone) {
    card += '<li class="list-group-item text-right">';

    //console.debug('telefone', item.telefone);
    let telefone = [];

    item.telefone = item.telefone.replaceAll("-", "");
    item.telefone = item.telefone.replaceAll("/", " ");
    item.telefone = item.telefone.replaceAll("(45)", "45");
    //item.telefone = item.telefone.replace('45 ', '45');
    for (let str of item.telefone.split(" ")) {
      if (!str) continue;

      if (/\b\d{11}\b/g.test(str)) {
        //telefone com 11 dígitos
        //console.debug("telefone com 11 dígitos: ", str);
        telefone.push(
          `<a href="tel:${str}" title="ligar para ${item.nome}">${str}</a>`
        );
        continue;
      }

      if (/\b\d{10}\b/g.test(str)) {
        //telefone com 10 dígitos
        //console.debug("telefone com 10 dígitos: ", str);
        telefone.push(
          `<a href="tel:${str}" title="ligar para ${item.nome}">${str}</a>`
        );
        continue;
      }

      if (/\b\d{9}\b/g.test(str)) {
        //telefone com 9 dígitos
        //console.debug("telefone com 9 dígitos: ", str);
        telefone.push(
          `<a href="tel:${str}" title="ligar para ${item.nome}">${str}</a>`
        );
        continue;
      }

      if (/\b\d{8}\b/g.test(str)) {
        //telefone com 8 dígitos
        //console.debug("telefone com 8 dígitos: ", str);
        telefone.push(
          `<a href="tel:${str}" title="ligar para ${item.nome}">${str}</a>`
        );
        continue;
      }

      telefone.push(str);
    }

    card += telefone.join(" ");

    card += "</li>";
  }

  card += "</ul>";

  if (item.link) {
    card += '<div class="card-body">';

    let link = [];
    for (let str of item.link.split(" ")) {
      if (!str) continue;

      //console.debug('str in link', link)
      if (validURL(str)) {
        if (str.startsWith("www"))
          link.push(
            `<a class="card-link" href="http://${str}" rel="noreferrer" title="${item.nome}" target="_blank">${str}</a>`
          );
        else
          link.push(
            `<a class="card-link" href="${str}" rel="noreferrer" title="${item.nome}" target="_blank">${str}</a>`
          );
        continue;
      }

      if (validEmail(str)) {
        link.push(
          `<a class="card-link" href="mailto:${str}" rel="noreferrer" title="${item.nome}">${str}</a>`
        );
        continue;
      }

      if (str.startsWith("@"))
        link.push(
          `<a class="card-link" href="https://instagram.com/${str.replace("@","")}" rel="noreferrer" title="${item.nome}" target="_blank">${str}</a>`
        );
      else link.push(str);
    }
    card += link.join(" ");

    card += "</div>";
  }

  card += "</div>";

  return card;
}

String.prototype.replaceAll = function (f, r) {
  return this.split(f).join(r);
};

function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

function validEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
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

  //document.getElementById("items").innerHTML = items;
  $("#items").append(items);
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

  for (let key in window.store) {
    // Add the data to lunr
    idx.add({
      id: key,
      data: window.store[key].data,
      nome: window.store[key].nome,
      produtos: window.store[key].produtos,
      local: window.store[key].local,
      telefone: window.store[key].telefone,
      entrega: window.store[key].entrega,
      link: window.store[key].link,
      ciente: window.store[key].ciente,
    });

    let results = idx.search(searchTerm); // Get lunr to perform a search
    displaySearchResults(results, window.store); // We'll write this in the next section
  }
} else {
  //displayItems(items);
  
  const chunkArr = (arr, chunkNo) => {
    let newArr = [];
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      if (arr[0] !== "" && arr[0] !== undefined) {
        let a = arr.splice(0, chunkNo);
        newArr.push(a);
      }
    }
    return newArr;
  };

  paginas = chunkArr(items, 9);
  let a = paginas[paginaAtual];
  console.debug(paginaAtual, a);
  displayItems(a);
}

$(window).scroll(function () {
  let pos = $(window).scrollTop();
  let height = $(document).height() - $(window).height();
  if (pos === height) {
    if (paginas && paginas.length >= paginaAtual + 1) {
      paginaAtual = paginaAtual + 1;
      let a = paginas[paginaAtual];
      console.debug(paginaAtual, a);
      displayItems(a);
    }
  }
});
