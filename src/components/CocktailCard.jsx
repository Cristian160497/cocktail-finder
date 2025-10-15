import React from "react";

function CocktailCard({ cocktail, onSelect }) {
  return (
    <li className="cocktail-card" onClick={() => onSelect(cocktail)}>
      <img
        src={cocktail.strDrinkThumb}
        alt={cocktail.strDrink}
        className="cocktail-image"
      />
      <h3>{cocktail.strDrink}</h3>
    </li>
  );
}

export default CocktailCard;