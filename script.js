// Configuration
const CONFIG = {
  API_KEY: "VOTRE_CLE_API_OPENWEATHER", // À remplacer
  BASE_URL: "https://api.openweathermap.org/data/2.5",
  UNITS: "metric",
  LANG: "fr",
};

// Données des 12 régions du Maroc avec leurs villes principales
const REGIONS = [
  {
    id: "tanger-tetouan",
    name: "Tanger-Tétouan-Al Hoceïma",
    icon: "fa-umbrella-beach",
    cities: ["Tanger", "Tétouan", "Al Hoceïma", "Chefchaouen", "Ksar El Kébir"],
  },
  {
    id: "oriental",
    name: "Oriental",
    icon: "fa-mountain",
    cities: ["Oujda", "Nador", "Berkane", "Saïdia", "Jerada"],
  },
  {
    id: "fes-meknes",
    name: "Fès-Meknès",
    icon: "fa-landmark",
    cities: ["Fès", "Meknès", "Ifrane", "Sefrou", "Taza"],
  },
  {
    id: "rabat-sale",
    name: "Rabat-Salé-Kénitra",
    icon: "fa-city",
    cities: ["Rabat", "Salé", "Kénitra", "Témara", "Skhirat"],
  },
  {
    id: "beni-mellal",
    name: "Beni Mellal-Khénifra",
    icon: "fa-tree",
    cities: ["Beni Mellal", "Khénifra", "Azilal", "Fquih Ben Salah"],
  },
  {
    id: "casablanca",
    name: "Casablanca-Settat",
    icon: "fa-building",
    cities: ["Casablanca", "Mohammédia", "Settat", "El Jadida", "Benslimane"],
  },
  {
    id: "marrakech",
    name: "Marrakech-Safi",
    icon: "fa-palette",
    cities: ["Marrakech", "Safi", "Essaouira", "Chichaoua", "Al Haouz"],
  },
  {
    id: "draa-tafilalet",
    name: "Drâa-Tafilalet",
    icon: "fa-sun",
    cities: ["Ouarzazate", "Zagora", "Tinghir", "Errachidia", "Midelt"],
  },
  {
    id: "souss-massa",
    name: "Souss-Massa",
    icon: "fa-water",
    cities: ["Agadir", "Inezgane", "Taroudant", "Tiznit", "Chtouka Aït Baha"],
  },
  {
    id: "guelmim-oued",
    name: "Guelmim-Oued Noun",
    icon: "fa-camel",
    cities: ["Guelmim", "Tan-Tan", "Sidi Ifni", "Assa Zag"],
  },
  {
    id: "laayoune",
    name: "Laâyoune-Sakia El Hamra",
    icon: "fa-desert",
    cities: ["Laâyoune", "Boujdour", "Smara", "Tarfaya"],
  },
  {
    id: "dakhla-oued",
    name: "Dakhla-Oued Ed-Dahab",
    icon: "fa-fish",
    cities: ["Dakhla", "Oued Ed-Dahab", "Aousserd"],
  },
];

// État de l'application
let currentRegion = null;
let currentCity = null;

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  displayRegions();
  setupEventListeners();
});

// Afficher les régions
function displayRegions() {
  const grid = document.getElementById("regions-grid");
  grid.innerHTML = REGIONS.map(
    (region) => `
        <div class="region-card" data-region-id="${region.id}">
            <i class="fas ${region.icon}"></i>
            <h3>${region.name}</h3>
            <p>${region.cities.length} villes</p>
        </div>
    `,
  ).join("");
}

// Gestion des événements
function setupEventListeners() {
  // Clic sur les régions
  document.querySelectorAll(".region-card").forEach((card) => {
    card.addEventListener("click", () => {
      const regionId = card.dataset.regionId;
      showCities(regionId);
    });
  });

  // Bouton retour régions
  document.getElementById("backToRegions").addEventListener("click", () => {
    showRegionsView();
  });

  // Bouton retour villes
  document.getElementById("backToCities").addEventListener("click", () => {
    showCitiesView(currentRegion);
  });

  // Recherche
  document.getElementById("searchBtn").addEventListener("click", handleSearch);
  document.getElementById("searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });
}

// Afficher les villes d'une région
async function showCities(regionId) {
  currentRegion = regionId;
  const region = REGIONS.find((r) => r.id === regionId);

  document.getElementById("regions-section").style.display = "none";
  document.getElementById("cities-section").style.display = "block";
  document.getElementById("city-detail-section").style.display = "none";

  document.getElementById("region-title").textContent =
    `Villes de ${region.name}`;

  const grid = document.getElementById("cities-grid");
  grid.innerHTML =
    '<div class="loading"><i class="fas fa-spinner"></i> Chargement...</div>';

  try {
    const citiesWithWeather = await Promise.all(
      region.cities.map(async (city) => {
        const weather = await getWeatherData(city);
        return { name: city, weather };
      }),
    );

    grid.innerHTML = citiesWithWeather
      .map(
        ({ name, weather }) => `
            <div class="city-card" data-city="${name}">
                <i class="fas fa-city"></i>
                <h3>${name}</h3>
                <div class="temperature">${Math.round(weather.main.temp)}°C</div>
                <div class="weather-condition">
                    <i class="fas ${getWeatherIcon(weather.weather[0].icon)}"></i>
                    <span>${weather.weather[0].description}</span>
                </div>
            </div>
        `,
      )
      .join("");

    // Ajouter les événements de clic sur les villes
    document.querySelectorAll(".city-card").forEach((card) => {
      card.addEventListener("click", () => {
        const cityName = card.dataset.city;
        showCityDetail(cityName);
      });
    });
  } catch (error) {
    grid.innerHTML = `<p style="color: red;">Erreur de chargement: ${error.message}</p>`;
  }
}

// Afficher les détails d'une ville
async function showCityDetail(cityName) {
  currentCity = cityName;
  document.getElementById("cities-section").style.display = "none";
  document.getElementById("city-detail-section").style.display = "block";

  const content = document.getElementById("city-detail-content");
  content.innerHTML =
    '<div class="loading"><i class="fas fa-spinner"></i> Chargement...</div>';

  try {
    const weather = await getWeatherData(cityName);
    const forecast = await getForecastData(cityName);

    content.innerHTML = `
            <h2 style="color: var(--primary);">${cityName}</h2>
            
            <div style="display: flex; align-items: center; justify-content: center; gap: 2rem; margin: 1.5rem 0; flex-wrap: wrap;">
                <div style="text-align: center;">
                    <i class="fas ${getWeatherIcon(weather.weather[0].icon)}" style="font-size: 4rem; color: var(--accent);"></i>
                    <div style="font-size: 3rem; font-weight: bold;">${Math.round(weather.main.temp)}°C</div>
                    <div style="font-size: 1.2rem; color: #555;">${weather.weather[0].description}</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-item">
                        <i class="fas fa-thermometer-half"></i>
                        <div>Ressenti: ${Math.round(weather.main.feels_like)}°C</div>
                    </div>
                    <div class="weather-detail-item">
                        <i class="fas fa-tint"></i>
                        <div>Humidité: ${weather.main.humidity}%</div>
                    </div>
                    <div class="weather-detail-item">
                        <i class="fas fa-wind"></i>
                        <div>Vent: ${Math.round(weather.wind.speed * 3.6)} km/h</div>
                    </div>
                    <div class="weather-detail-item">
                        <i class="fas fa-compress-alt"></i>
                        <div>Pression: ${weather.main.pressure} hPa</div>
                    </div>
                </div>
            </div>
            
            <h3 style="margin-top: 2rem; color: var(--primary);">Prévisions 5 jours</h3>
            <div class="forecast-grid">
                ${forecast.list
                  .filter((item, index) => index % 8 === 0)
                  .slice(0, 5)
                  .map(
                    (day) => `
                    <div class="forecast-day">
                        <div class="date">${new Date(day.dt * 1000).toLocaleDateString("fr-FR", { weekday: "short" })}</div>
                        <i class="fas ${getWeatherIcon(day.weather[0].icon)}" style="font-size: 2rem; color: var(--secondary);"></i>
                        <div style="font-size: 1.3rem; font-weight: bold;">${Math.round(day.main.temp)}°C</div>
                        <div style="font-size: 0.9rem; color: #666;">${day.weather[0].description}</div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `;
  } catch (error) {
    content.innerHTML = `<p style="color: red;">Erreur: ${error.message}</p>`;
  }
}

// Fonctions API
async function getWeatherData(city) {
  const url = `${CONFIG.BASE_URL}/weather?q=${city},MA&units=${CONFIG.UNITS}&lang=${CONFIG.LANG}&appid=${CONFIG.API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Ville non trouvée: ${city}`);
  return response.json();
}

async function getForecastData(city) {
  const url = `${CONFIG.BASE_URL}/forecast?q=${city},MA&units=${CONFIG.UNITS}&lang=${CONFIG.LANG}&appid=${CONFIG.API_KEY}`;
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Impossible de récupérer les prévisions pour ${city}`);
  return response.json();
}

// Helper: Icônes météo
function getWeatherIcon(iconCode) {
  const icons = {
    "01d": "fa-sun",
    "01n": "fa-moon",
    "02d": "fa-cloud-sun",
    "02n": "fa-cloud-moon",
    "03d": "fa-cloud",
    "03n": "fa-cloud",
    "04d": "fa-cloud",
    "04n": "fa-cloud",
    "09d": "fa-cloud-rain",
    "09n": "fa-cloud-rain",
    "10d": "fa-cloud-sun-rain",
    "10n": "fa-cloud-moon-rain",
    "11d": "fa-bolt",
    "11n": "fa-bolt",
    "13d": "fa-snowflake",
    "13n": "fa-snowflake",
    "50d": "fa-smog",
    "50n": "fa-smog",
  };
  return icons[iconCode] || "fa-cloud";
}

// Navigation
function showRegionsView() {
  document.getElementById("regions-section").style.display = "block";
  document.getElementById("cities-section").style.display = "none";
  document.getElementById("city-detail-section").style.display = "none";
  currentRegion = null;
  currentCity = null;
}

function showCitiesView(regionId) {
  if (regionId) {
    document.getElementById("regions-section").style.display = "none";
    document.getElementById("cities-section").style.display = "block";
    document.getElementById("city-detail-section").style.display = "none";
    showCities(regionId);
  }
}

// Recherche
function handleSearch() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return;

  // Chercher dans les régions
  const region = REGIONS.find(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.cities.some((c) => c.toLowerCase().includes(query.toLowerCase())),
  );

  if (region) {
    showCities(region.id);
    // Si c'est une ville spécifique, afficher directement ses détails
    const cityMatch = region.cities.find(
      (c) => c.toLowerCase() === query.toLowerCase(),
    );
    if (cityMatch) {
      setTimeout(() => showCityDetail(cityMatch), 500);
    }
  } else {
    alert("Aucune région ou ville trouvée");
  }
}
