import { BASE_URL, ENDPOINTS, QUERY_PARAMS } from "../constants/api";

// Helper per gestire le chiamate con retry e error handling
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      // Se è l'ultimo tentativo, lancia l'errore
      if (i === retries - 1) {
        throw new Error(`Errore nel caricamento dei dati: ${error.message}`);
      }
      
      // Attendi prima di riprovare (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}

// Service principale per i cocktail
export const cocktailService = {
  // Ottieni tutti i cocktail (categoria Cocktail)
  async getAllCocktails() {
    const url = `${BASE_URL}${ENDPOINTS.FILTER_BY_CATEGORY}?${QUERY_PARAMS.CATEGORY}=Cocktail`;
    return fetchWithRetry(url);
  },

  // Cerca cocktail per nome
  async searchByName(name) {
    if (!name || name.trim() === "") {
      return this.getAllCocktails();
    }
    const url = `${BASE_URL}${ENDPOINTS.SEARCH_BY_NAME}?${QUERY_PARAMS.SEARCH_NAME}=${encodeURIComponent(name)}`;
    return fetchWithRetry(url);
  },

  // Ottieni dettagli di un cocktail specifico
  async getCocktailById(id) {
    const url = `${BASE_URL}${ENDPOINTS.LOOKUP_BY_ID}?${QUERY_PARAMS.LOOKUP_ID}=${id}`;
    return fetchWithRetry(url);
  },

  // Filtra per categoria
  async filterByCategory(category) {
    const url = `${BASE_URL}${ENDPOINTS.FILTER_BY_CATEGORY}?${QUERY_PARAMS.CATEGORY}=${encodeURIComponent(category)}`;
    return fetchWithRetry(url);
  },

  // Filtra per ingrediente
  async filterByIngredient(ingredient) {
    const url = `${BASE_URL}${ENDPOINTS.FILTER_BY_INGREDIENT}?${QUERY_PARAMS.INGREDIENT}=${encodeURIComponent(ingredient)}`;
    return fetchWithRetry(url);
  },

  // Filtra per tipo alcolico
  async filterByAlcoholic(type) {
    const url = `${BASE_URL}${ENDPOINTS.FILTER_BY_ALCOHOLIC}?${QUERY_PARAMS.ALCOHOLIC}=${encodeURIComponent(type)}`;
    return fetchWithRetry(url);
  },

  // Ottieni liste per i filtri
  async getCategories() {
    return fetchWithRetry(`${BASE_URL}${ENDPOINTS.LIST_CATEGORIES}`);
  },

  async getGlasses() {
    return fetchWithRetry(`${BASE_URL}${ENDPOINTS.LIST_GLASSES}`);
  },

  async getIngredients() {
    return fetchWithRetry(`${BASE_URL}${ENDPOINTS.LIST_INGREDIENTS}`);
  },

  async getAlcoholicTypes() {
    return fetchWithRetry(`${BASE_URL}${ENDPOINTS.LIST_ALCOHOLIC}`);
  },

  // Cocktail random
  async getRandomCocktail() {
    return fetchWithRetry(`${BASE_URL}${ENDPOINTS.RANDOM_COCKTAIL}`);
  },

  // Helper per estrarre ingredienti da un cocktail
  extractIngredients(cocktail) {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push({
          name: ingredient,
          measure: measure ? measure.trim() : "q.b.",
        });
      }
    }
    return ingredients;
  },
};