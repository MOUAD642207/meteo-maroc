// =============================================
// 1. CONFIGURATION
// =============================================
const CONFIG = {
  API_KEY: "VOTRE_CLE_API_OPENWEATHER", // À remplacer
  BASE_URL: "https://api.openweathermap.org/data/2.5",
  UNITS: "metric",
  LANG: "fr",
};

// =============================================
// 2. DONNÉES DES RÉGIONS
// =============================================
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

// =============================================
// 3. ÉTAT DE L'APPLICATION
// =============================================
let currentRegion = null;
let currentCity = null;
let isDarkMode = false;

// =============================================
// 4. NOUVEAU : PARTICULES FLOTTANTES
// =============================================
function createParticles() {
  const container = document.getElementById("particles");
  if (!container) return; // Sécurité si l'élément n'existe pas

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDuration = 15 + Math.random() * 25 + "s";
    particle.style.animationDelay = Math.random() * 20 + "s";
    particle.style.width = 2 + Math.random() * 6 + "px";
    particle.style.height = particle.style.width;
    container.appendChild(particle);
  }
}

// =============================================
// 5. NOUVEAU : TOGGLE THEME (Sombre/Clair)
// =============================================
function toggleTheme() {
  isDarkMode = !isDarkMode;
  const root = document.documentElement;
  const toggleBtn = document.getElementById("themeToggle");

  if (isDarkMode) {
    // Mode sombre
    root.style.setProperty("--bg-gradient-start", "#0f0c29");
    root.style.setProperty("--bg-gradient-end", "#24243e");
    root.style.setProperty("--glass-bg", "rgba(0, 0, 0, 0.5)");
    root.style.setProperty("--glass-border", "rgba(255, 255, 255, 0.1)");
    if (toggleBtn) {
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i><span>Clair</span>';
    }
  } else {
    // Mode clair
    root.style.setProperty("--bg-gradient-start", "#667eea");
    root.style.setProperty("--bg-gradient-end", "#764ba2");
    root.style.setProperty("--glass-bg", "rgba(255, 255, 255, 0.15)");
    root.style.setProperty("--glass-border", "rgba(255, 255, 255, 0.2)");
    if (toggleBtn) {
      toggleBtn.innerHTML = '<i class="fas fa-moon"></i><span>Sombre</span>';
    }
  }
}

// =============================================
// 6. NOUVEAU : ANIMATION DES CARTES
// =============================================
function animateCards() {
  const cards = document.querySelectorAll(".region-card, .city-card");
  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    setTimeout(
      () => {
        card.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      },
      100 + index * 50,
    );
  });
}

// =============================================
// 7. AFFICHER LES RÉGIONS (MODIFIÉ)
// =============================================
function displayRegions() {
  const grid = document.getElementById("regions-grid");
  if (!grid) return;

  grid.innerHTML = REGIONS.map(
    (region) => `
        <div class="region-card" data-region-id="${region.id}">
            <i class="fas ${region.icon}"></i>
            <h3>${region.name}</h3>
            <p>${region.cities.length} villes</p>
        </div>
    `,
  ).join("");

  // Ajouter l'animation après un petit délai
  setTimeout(animateCards, 100);
}

// =============================================
// 8. AFFICHER LES VILLES (MODIFIÉ)
// =============================================
async function showCities(regionId) {
  currentRegion = regionId;
  const region = REGIONS.find((r) => r.id === regionId);

  if (!region) return;

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

    // Ajouter l'animation
    setTimeout(animateCards, 100);

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

// =============================================
// 9. AFFICHER LES DÉTAILS D'UNE VILLE
// =============================================
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
            <h2 style="color: white;">${cityName}</h2>
            
            <div class="weather-main-info">
                <div class="temp-display">
                    <i class="fas ${getWeatherIcon(weather.weather[0].icon)}"></i>
                    <div class="temp-value">${Math.round(weather.main.temp)}°C</div>
                    <div class="temp-desc">${weather.weather[0].description}</div>
                </div>
                <div class="weather-detail-grid">
                    <div class="weather-detail-item">
                        <i class="fas fa-thermometer-half"></i>
                        <div class="label">Ressenti</div>
                        <div class="value">${Math.round(weather.main.feels_like)}°C</div>
                    </div>
                    <div class="weather-detail-item">
                        <i class="fas fa-tint"></i>
                        <div class="label">Humidité</div>
                        <div class="value">${weather.main.humidity}%</div>
                    </div>
                    <div class="weather-detail-item">
                        <i class="fas fa-wind"></i>
                        <div class="label">Vent</div>
                        <div class="value">${Math.round(weather.wind.speed * 3.6)} km/h</div>
                    </div>
                    <div class="weather-detail-item">
                        <i class="fas fa-compress-alt"></i>
                        <div class="label">Pression</div>
                        <div class="value">${weather.main.pressure} hPa</div>
                    </div>
                </div>
            </div>
            
            <h3 style="color: white; margin-top: 2rem;">Prévisions 5 jours</h3>
            <div class="forecast-grid">
                ${forecast.list
                  .filter((item, index) => index % 8 === 0)
                  .slice(0, 5)
                  .map(
                    (day) => `
                    <div class="forecast-day">
                        <div class="date">${new Date(day.dt * 1000).toLocaleDateString("fr-FR", { weekday: "short" })}</div>
                        <i class="fas ${getWeatherIcon(day.weather[0].icon)}"></i>
                        <div class="temp">${Math.round(day.main.temp)}°C</div>
                        <div class="desc">${day.weather[0].description}</div>
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

// =============================================
// 10. FONCTIONS API
// =============================================
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

// =============================================
// 11. HELPER : ICÔNES MÉTÉO
// =============================================
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

// =============================================
// 12. NAVIGATION
// =============================================
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

// =============================================
// 13. RECHERCHE
// =============================================
function handleSearch() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return;

  const region = REGIONS.find(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.cities.some((c) => c.toLowerCase().includes(query.toLowerCase())),
  );

  if (region) {
    showCities(region.id);
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

// =============================================
// 14. GESTION DES ÉVÉNEMENTS
// =============================================
function setupEventListeners() {
  // Délégation d'événements pour les régions (clics sur les cartes)
  document.getElementById("regions-grid").addEventListener("click", (e) => {
    const card = e.target.closest(".region-card");
    if (card) {
      const regionId = card.dataset.regionId;
      showCities(regionId);
    }
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

  // Theme toggle
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
}

// =============================================
// 15. INITIALISATION
// =============================================
document.addEventListener("DOMContentLoaded", () => {
  // Créer les particules
  createParticles();

  // Afficher les régions
  displayRegions();

  // Configurer les événements
  setupEventListeners();
});
