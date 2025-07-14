const API = "https://ota-indol.vercel.app/aniwatch/";

async function carregarAnimes() {
  const container = document.getElementById("anime-container");
  container.innerHTML = "Carregando...";

  try {
    const res = await fetch(API);
    const data = await res.json();

    console.log(data); // DEBUG

    if (!data.spotLightAnimes) throw new Error("spotLightAnimes ausente");

    container.innerHTML = "";
    data.spotLightAnimes.forEach(anime => {
      const el = document.createElement("div");
      el.innerHTML = `
        <h3>${anime.name}</h3>
        <img src="${anime.img}" alt="${anime.name}" width="200">
        <p>${anime.description}</p>
        <hr>
      `;
      container.appendChild(el);
    });

  } catch (err) {
    console.error("Erro ao buscar API:", err);
    container.innerHTML = `<p style="color:red">Erro ao carregar os animes.</p>`;
  }
}

carregarAnimes();
