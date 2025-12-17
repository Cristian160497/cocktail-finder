// Base URL per tutte le chiamate API
export const BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

// Endpoints dell'API
export const ENDPOINTS = {
  // Ricerca e filtraggio
  SEARCH_BY_NAME: "/search.php",
  FILTER_BY_CATEGORY: "/filter.php",
  FILTER_BY_INGREDIENT: "/filter.php",
  FILTER_BY_ALCOHOLIC: "/filter.php",
  
  // Dettagli
  LOOKUP_BY_ID: "/lookup.php",
  
  // Liste
  LIST_CATEGORIES: "/list.php?c=list",
  LIST_GLASSES: "/list.php?g=list",
  LIST_INGREDIENTS: "/list.php?i=list",
  LIST_ALCOHOLIC: "/list.php?a=list",
  
  // Random
  RANDOM_COCKTAIL: "/random.php",
};

// Parametri query comuni
export const QUERY_PARAMS = {
  SEARCH_NAME: "s",
  CATEGORY: "c",
  INGREDIENT: "i",
  ALCOHOLIC: "a",
  GLASS: "g",
  LOOKUP_ID: "i",
};