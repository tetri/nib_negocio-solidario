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
    '    <h5 class="card-title">' +
    item.nome +
    "</h5>";

  if (item.produtos != "")
    card += '    <p class="card-text">' + item.produtos + "</p>";

  card += "</div>" + '<ul class="list-group list-group-flush">';

  if (item.local != "")
    card +=
      '    <li class="list-group-item">' +
      item.local +
      " <a" +
      '           href="https://www.google.com/maps/search/' +
      item.local +
      '" rel="noreferrer" title="' +
      item.local +
      '"' +
      '            target="_blank" aria-label="ver no mapa"><i class="fas fa-map-marker-alt"></i></a></li>';

  if (item.telefone != "")
    card +=
      '    <li class="list-group-item text-right">' + item.telefone + "</li>";

  card += "</ul>";
  card += '<div class="card-body">';

  if (item.link != "") {
    if (item.link.startsWith("http")) {
      card +=
        '    <a class="card-link" href="' +
        item.link +
        '" rel="noreferrer" title="' +
        item.nome +
        '" target="_blank">' +
        item.link +
        "</a>";
    } else if (item.link.includes("www")) {
      card +=
        '    <a class="card-link" href="http://' +
        item.link +
        '" rel="noreferrer" title="' +
        item.nome +
        '" target="_blank">' +
        item.link +
        "</a>";
    }
  } else card += "    " + item.link;

  card += "</div>";
  card += "</div>";

  return card;
}
