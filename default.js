var paginas = [];
var paginaAtual = 0;
var mostrandoResultadosDePesquisa = false;
var termoDePesquisa = "";

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
      //console.debug("Service Worker Registered");
    } catch (error) {
      //console.debug("Service Worker Registration Failed");
    }
  }
});

function montaButton(item, total) {
  return `<button type="button" class="btn btn-primary categoria" style="margin-right: 1rem; margin-bottom: 1rem;" data-categoria="${item}">
            ${item} <span class="badge badge-light">${total}</span> <span class="sr-only">itens nesta categoria</span>
          </button>`;
}

function montaCard(item) {
  //console.debug("item @ montaCard", item);
  let card =
    '<div class="card border-secondary mb-3">' +
    '<div class="card-body">' +
    //`    <p>${item.data.toString().hashCode()}</p>` +
    `    <span class="badge badge-pill badge-primary float-right">${item.categoria}</span>` +
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
          `<a class="card-link" href="https://instagram.com/${str.replace(
            "@",
            ""
          )}" rel="noreferrer" title="${item.nome}" target="_blank">${str}</a>`
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

function displayCategories(_categories) {
  let cats = "<p>Nenhuma categoria disponível!</p>";

  if (Object.keys(_categories).length) {
    cats = "";

    for (var key in _categories) {
      if (_categories.hasOwnProperty(key)) {
        //console.debug(key, _categories[key]);

        cats += montaButton(key, _categories[key]);
      }
    }
  }

  $("#categories").empty();
  $("#categories").append(cats);
}

function displayItems(_items) {
  let items = "<p>Nenhum item cadastrado!</p>";

  if (_items.length) {
    items = "";
    for (let item of _items) {
      items += montaCard(item);
    }
  }

  if (mostrandoResultadosDePesquisa) $("#items").empty();

  $("#items").append(items);
}

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

function ordenarDicionarioPorChave(dict) {
  let keys = Object.keys(dict);

  let i,
    len = keys.length;

  keys.sort();

  let sortedDict = {};

  for (i = 0; i < len; i++) {
    k = keys[i];
    sortedDict[k] = dict[k];
  }

  //console.debug('sortedDict', sortedDict);
  return sortedDict;
}

let categorias = {};
for (let item of items) {
  if (categorias[item.categoria] > 0)
    categorias[item.categoria] = categorias[item.categoria] + 1;
  else categorias[item.categoria] = 1;
}
//console.debug("categorias", categorias);
categorias = ordenarDicionarioPorChave(categorias);
displayCategories(categorias);

let _items = items.slice();
paginas = chunkArr(items, 9);
//console.debug('paginas', paginas);
items = _items;
displayItems(paginas[paginaAtual]);

$(window).scroll(function () {
  if (mostrandoResultadosDePesquisa) return;

  let pos = $(window).scrollTop();
  let height = $(document).height() - $(window).height();
  if (pos > height - 20) {
    if (paginas && paginas.length >= paginaAtual + 1) {
      paginaAtual = paginaAtual + 1;
      let a = paginas[paginaAtual];
      //console.debug(paginaAtual, a);
      displayItems(a);
    }
  }
});

$(document).on("keyup", "#search-box", function (e) {
  if (e.keyCode == 13) $("#pesquisar").click();
});

$(document).on("click", "#pesquisar", function () {
  termoDePesquisa = $("#search-box").val().trim();
  if (!termoDePesquisa) return;

  //console.debug('items', items);
  let term = termoDePesquisa.toUpperCase();

  let resultados = [];
  for (let item of items) {
    //console.debug('item', item);
    if (item.categoria.toUpperCase().includes(term)) {
      resultados.push(item);
      continue;
    }

    if (item.nome.toUpperCase().includes(term)) {
      resultados.push(item);
      continue;
    }

    if (item.produtos.toUpperCase().includes(term)) {
      resultados.push(item);
      continue;
    }

    if (item.local.toUpperCase().includes(term)) {
      resultados.push(item);
      continue;
    }

    if (item.telefone.toUpperCase().includes(term)) {
      resultados.push(item);
      continue;
    }

    if (item.link.toUpperCase().includes(term)) {
      resultados.push(item);
      continue;
    }
  }

  mostrandoResultadosDePesquisa = true;
  displayItems(resultados);
  $("#mostrarTodos").parent().show();
});

$(document).on("click", "#mostrarTodos", function () {
  mostrandoResultadosDePesquisa = false;
  termoDePesquisa = "";
  paginaAtual = 0;

  window.scrollTo(0, 0);

  $("#search-box").val("");
  $("#items").empty();
  displayItems(paginas[paginaAtual]);
  $("#mostrarTodos").parent().hide();
  return false;
});

function filtrarPorCategoria(categoria) {
  termoDePesquisa = categoria.trim();
  if (!termoDePesquisa) return;

  //console.debug('items', items);
  let term = termoDePesquisa.toUpperCase();

  let resultados = [];
  for (let item of items) {
    //console.debug('item', item);
    if (item.categoria.toUpperCase().includes(term)) {
      resultados.push(item);
      continue;
    }
  }

  mostrandoResultadosDePesquisa = true;
  displayItems(resultados);
  $("#mostrarTodos").parent().show();
}

$(document).on("click", ".categoria", function () {
  if (mostrandoResultadosDePesquisa) $("#search-box").val("");
  filtrarPorCategoria($(this).data("categoria"));
  return false;
});
