import { create } from "zustand";
import { cocktailService } from "../services/cocktailService";

export const useCocktailStore = create((set, get) => ({
  // State
  cocktails: [],
  selectedCocktail: null,
  loading: false,
  error: null,
  
  // Filtri
  searchTerm: "",
  selectedCategory: "",
  selectedIngredient: "",
  selectedAlcoholic: "",
  
  // Liste per i filtri
  categories: [],
  ingredients: [],
  alcoholicTypes: [],

  // Actions - Caricamento cocktail
  fetchCocktails: async () => {
    set({ loading: true, error: null });
    try {
      const data = await cocktailService.getAllCocktails();
      set({ 
        cocktails: data.drinks || [], 
        loading: false 
      });
    } catch (error) {
      set({ 
        cocktails: [],
        loading: false,
        error: error?.message || "Errore durante il caricamento dei cocktail.",
      });
    }
  },

  // Ricerca per nome
  searchCocktails: async (term) => {
    set({ loading: true, error: null, searchTerm: term });
    try {
      const data = await cocktailService.searchByName(term);
      set({ 
        cocktails: data.drinks || [], 
        loading: false 
      });
    } catch (error) {
      set({ 
        cocktails: [],
        loading: false,
        error: error?.message || "Errore ricerca cocktail.",
      });
    }
  },

  // Applica filtri combinati
  applyFilters: async () => {
    const { selectedCategory, selectedIngredient, selectedAlcoholic, searchTerm } = get();
    
    set({ loading: true, error: null });
    
    try {
      let data;
      
      // Priorità: ingrediente > categoria > alcolico > ricerca nome
      if (selectedIngredient) {
        data = await cocktailService.filterByIngredient(selectedIngredient);
      } else if (selectedCategory) {
        data = await cocktailService.filterByCategory(selectedCategory);
      } else if (selectedAlcoholic) {
        data = await cocktailService.filterByAlcoholic(selectedAlcoholic);
      } else if (searchTerm) {
        data = await cocktailService.searchByName(searchTerm);
      } else {
        data = await cocktailService.getAllCocktails();
      }
      
      let filteredDrinks = data.drinks || [];
      
      // Applica filtri secondari (client-side)
      // Nota: l'API non supporta filtri multipli, quindi filtriamo lato client
      if (selectedIngredient && selectedCategory) {
        // Dobbiamo fare chiamate aggiuntive per filtrare ulteriormente
        const detailedPromises = filteredDrinks.map(drink => 
          cocktailService.getCocktailById(drink.idDrink)
        );
        const detailedResults = await Promise.all(detailedPromises);
        filteredDrinks = detailedResults
          .map(r => r.drinks?.[0])
          .filter(d => d && d.strCategory === selectedCategory);
      }
      
      set({ 
        cocktails: filteredDrinks, 
        loading: false 
      });
    } catch (error) {
      set({ 
        cocktails: [],
        loading: false,
        error: error?.message || "Errore durante l'applicazione filtri.",
      });
    }
  },

  // Seleziona cocktail per vedere i dettagli
  selectCocktail: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await cocktailService.getCocktailById(id);
      set({ 
        selectedCocktail: data.drinks?.[0] || null, 
        loading: false 
      });
    } catch (error) {
      set({ 
        loading: false,
        error: error?.message || "Errore caricamento dettagli.",
      });
    }
  },

  // Chiudi modal
  clearSelectedCocktail: () => {
    set({ selectedCocktail: null });
  },

  // Carica liste per i filtri
  loadFilterOptions: async () => {
    try {
      const [categoriesData, ingredientsData, alcoholicData] = await Promise.all([
        cocktailService.getCategories(),
        cocktailService.getIngredients(),
        cocktailService.getAlcoholicTypes(),
      ]);
      
      set({
        categories: categoriesData.drinks || [],
        ingredients: ingredientsData.drinks || [],
        alcoholicTypes: alcoholicData.drinks || [],
      });
    } catch (error) {
      console.error("Errore nel caricamento delle opzioni filtri:", error);
    }
  },

  // Setters per i filtri
  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },

  setCategory: (category) => {
    set({ selectedCategory: category });
  },

  setIngredient: (ingredient) => {
    set({ selectedIngredient: ingredient });
  },

  setAlcoholic: (type) => {
    set({ selectedAlcoholic: type });
  },

  // Reset filtri
  resetFilters: () => {
    set({
      searchTerm: "",
      selectedCategory: "",
      selectedIngredient: "",
      selectedAlcoholic: "",
    });
    get().fetchCocktails();
  },

}));