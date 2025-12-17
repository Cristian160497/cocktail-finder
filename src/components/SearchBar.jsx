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

  const containerRef = useRef(null);
  const dropdownPortalRef = useRef(null);

  const pillRefs = {
    category: useRef(null),
    ingredient: useRef(null),
    alcoholic: useRef(null),
  };

  /* ===============================
     LOAD OPTIONS
  =============================== */
  useEffect(() => {
    loadFilterOptions();
  }, [loadFilterOptions]);

  /* ===============================
     SEARCH DEBOUNCE
  =============================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      searchCocktails(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, searchCocktails]);

  /* ===============================
     CLICK OUTSIDE (PORTAL SAFE)
  =============================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        dropdownPortalRef.current &&
        !dropdownPortalRef.current.contains(e.target)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===============================
     DROPDOWN HELPERS
  =============================== */
  const toggleDropdown = (type) => {
    setActiveDropdown((prev) => (prev === type ? null : type));
  };

  const handleFilterSelect = (type, value) => {
    if (type === "category") setCategory(value);
    if (type === "ingredient") setIngredient(value);
    if (type === "alcoholic") setAlcoholic(value);

    setActiveDropdown(null);

    applyFilters({
      category: type === "category" ? value : selectedCategory,
      ingredient: type === "ingredient" ? value : selectedIngredient,
      alcoholic: type === "alcoholic" ? value : selectedAlcoholic,
    });
  };

  const clearFilter = (type) => {
    if (type === "category") setCategory("");
    if (type === "ingredient") setIngredient("");
    if (type === "alcoholic") setAlcoholic("");
    applyFilters();
  };

  /* ===============================
     PORTAL RENDER
  =============================== */
  const renderDropdown = (type, content) => {
    const rect = pillRefs[type].current?.getBoundingClientRect();
    if (!rect) return null;

    return createPortal(
      <div
        ref={dropdownPortalRef}
        className="filter-dropdown"
        style={{
          position: "fixed",
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width,
          zIndex: 9999,
        }}
      >
        {content}
      </div>,
      document.body
    );
  };

  const activeFiltersCount = [selectedCategory, selectedIngredient, selectedAlcoholic].filter(Boolean).length;

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="netflix-search-container" ref={containerRef}>
      {/* SEARCH INPUT */}
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Cerca cocktail per nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="netflix-search-input"
        />
      </div>

      {/* FILTERS */}
      <div className="netflix-filters">
        {/* CATEGORIA */}
        <button
          ref={pillRefs.category}
          className={`filter-pill ${selectedCategory ? "active" : ""}`}
          onClick={() => toggleDropdown("category")}
        >
          🍹 Categoria
          {selectedCategory && (
            <span
              className="filter-badge"
              onClick={(e) => {
                e.stopPropagation();
                clearFilter("category");
              }}
            >
              X
            </span>
          )}
        </button>

        {activeDropdown === "category" &&
          renderDropdown("category", (
            <>
              <div className="dropdown-option" onClick={() => handleFilterSelect("category", "")}>
                Tutte le categorie
              </div>
              {categories.map((cat) => (
                <div
                  key={cat.strCategory}
                  className="dropdown-option"
                  onClick={() => handleFilterSelect("category", cat.strCategory)}
                >
                  {cat.strCategory}
                </div>
              ))}
            </>
          ))}

        {/* INGREDIENTE */}
        <button
          ref={pillRefs.ingredient}
          className={`filter-pill ${selectedIngredient ? "active" : ""}`}
          onClick={() => toggleDropdown("ingredient")}
        >
          🥃 Ingrediente
            {selectedIngredient && (
            <span
              className="filter-badge"
              onClick={(e) => {
                e.stopPropagation();
                clearFilter("ingredient");
              }}
            >
              X
            </span>
          )}
        </button>

        {activeDropdown === "ingredient" &&
          renderDropdown("ingredient", (
            <>
              <div className="dropdown-option" onClick={() => handleFilterSelect("ingredient", "")}>
                Tutti gli ingredienti
              </div>
              {ingredients.slice(0, 50).map((ing) => (
                <div
                  key={ing.strIngredient1}
                  className="dropdown-option"
                  onClick={() => handleFilterSelect("ingredient", ing.strIngredient1)}
                >
                  {ing.strIngredient1}
                </div>
              ))}
            </>
          ))}

        {/* TIPO */}
        <button
          ref={pillRefs.alcoholic}
          className={`filter-pill ${selectedAlcoholic ? "active" : ""}`}
          onClick={() => toggleDropdown("alcoholic")}
        >
          🍸 Tipo
            {selectedAlcoholic && (
            <span
              className="filter-badge"
              onClick={(e) => {
                e.stopPropagation();
                clearFilter("alcoholic");
              }}
            >
              X
            </span>
          )}
        </button>

        {activeDropdown === "alcoholic" &&
          renderDropdown("alcoholic", (
            <>
              <div className="dropdown-option" onClick={() => handleFilterSelect("alcoholic", "")}>
                Tutti i tipi
              </div>
              {alcoholicTypes.map((type) => (
                <div
                  key={type.strAlcoholic}
                  className="dropdown-option"
                  onClick={() => handleFilterSelect("alcoholic", type.strAlcoholic)}
                >
                  {type.strAlcoholic}
                </div>
              ))}
            </>
          ))}

        {/* CLEAR ALL */}
        {activeFiltersCount > 0 && (
          <button className="clear-all-btn" onClick={resetFilters}>
            Cancella tutto ({activeFiltersCount})
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
