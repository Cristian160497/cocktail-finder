import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useCocktailStore } from "../store/cocktailStore";

function SearchBar() {
  const {
    searchTerm,
    selectedCategory,
    selectedIngredient,
    selectedAlcoholic,
    categories,
    ingredients,
    alcoholicTypes,
    setSearchTerm,
    setCategory,
    setIngredient,
    setAlcoholic,
    searchCocktails,
    applyFilters,
    resetFilters,
    loadFilterOptions,
  } = useCocktailStore();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRefs = useRef({});

  useEffect(() => {
    loadFilterOptions();
  }, [loadFilterOptions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) searchCocktails(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, searchCocktails]);

  // Chiudi dropdown quando clicchi fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!Object.values(dropdownRefs.current).some(ref => ref?.contains(event.target))) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (filterName) => {
    const ref = dropdownRefs.current[filterName];
    if (!ref) return;

    if (activeDropdown === filterName) {
      setActiveDropdown(null);
    } else {
      const rect = ref.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // distanza sotto la pill
        left: rect.left + window.scrollX,
        width: rect.width
      });
      setActiveDropdown(filterName);
    }
  };

  const handleFilterSelect = (filterType, value) => {
    if (filterType === "category") setCategory(value);
    if (filterType === "ingredient") setIngredient(value);
    if (filterType === "alcoholic") setAlcoholic(value);
    setActiveDropdown(null);
    applyFilters();
  };

  const clearFilter = (filterType) => {
    if (filterType === "category") setCategory("");
    if (filterType === "ingredient") setIngredient("");
    if (filterType === "alcoholic") setAlcoholic("");
    applyFilters();
  };

  const activeFiltersCount = [selectedCategory, selectedIngredient, selectedAlcoholic].filter(Boolean).length;

  // Funzione helper per renderizzare il dropdown in portal
  const renderDropdown = (filterName, options, selectedValue, filterType) => {
    if (activeDropdown !== filterName) return null;

    return createPortal(
      <div
        className={`filter-dropdown ${filterType === "ingredient" ? "scrollable" : ""}`}
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width
        }}
      >
        <div className="dropdown-option" onClick={() => handleFilterSelect(filterType, "")}>
          {filterType === "category" ? "Tutte le categorie" : filterType === "ingredient" ? "Tutti gli ingredienti" : "Tutti i tipi"}
        </div>
        {options.map((opt) => {
          const value = opt.strCategory || opt.strIngredient1 || opt.strAlcoholic;
          return (
            <div
              key={value}
              className={`dropdown-option ${selectedValue === value ? "selected" : ""}`}
              onClick={() => handleFilterSelect(filterType, value)}
            >
              {value}
              {selectedValue === value && <span className="check-mark">✓</span>}
            </div>
          );
        })}
      </div>,
      document.body
    );
  };

  return (
    <div className="netflix-search-container">
      <div className="search-input-wrapper">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" strokeWidth="2"/>
          <path d="m21 21-4.35-4.35" strokeWidth="2"/>
        </svg>
        <input
          type="text"
          placeholder="Cerca cocktail per nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="netflix-search-input"
        />
      </div>

      <div className="netflix-filters">
        {/* Categoria */}
        <div className="filter-pill-container" ref={el => dropdownRefs.current.category = el}>
          <button
            className={`filter-pill ${selectedCategory ? "active" : ""}`}
            onClick={() => toggleDropdown("category")}
          >
            🍹 Categoria
            {selectedCategory && <span className="filter-badge" onClick={(e) => { e.stopPropagation(); clearFilter("category"); }}>×</span>}
          </button>
        </div>

        {/* Ingrediente */}
        <div className="filter-pill-container" ref={el => dropdownRefs.current.ingredient = el}>
          <button
            className={`filter-pill ${selectedIngredient ? "active" : ""}`}
            onClick={() => toggleDropdown("ingredient")}
          >
            🥃 Ingrediente
            {selectedIngredient && <span className="filter-badge" onClick={(e) => { e.stopPropagation(); clearFilter("ingredient"); }}>×</span>}
          </button>
        </div>

        {/* Tipo */}
        <div className="filter-pill-container" ref={el => dropdownRefs.current.alcoholic = el}>
          <button
            className={`filter-pill ${selectedAlcoholic ? "active" : ""}`}
            onClick={() => toggleDropdown("alcoholic")}
          >
            🍸 Tipo
            {selectedAlcoholic && <span className="filter-badge" onClick={(e) => { e.stopPropagation(); clearFilter("alcoholic"); }}>×</span>}
          </button>
        </div>

        {activeFiltersCount > 0 && (
          <button className="clear-all-btn" onClick={resetFilters}>
            <span className="filters-count">{activeFiltersCount}</span>
            Cancella tutto
          </button>
        )}
      </div>

      {/* Dropdown Portal */}
      {renderDropdown("category", categories, selectedCategory, "category")}
      {renderDropdown("ingredient", ingredients.slice(0,50), selectedIngredient, "ingredient")}
      {renderDropdown("alcoholic", alcoholicTypes, selectedAlcoholic, "alcoholic")}
    </div>
  );
}

export default SearchBar;
