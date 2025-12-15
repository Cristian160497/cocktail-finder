import React from "react";

function CocktailCard({ cocktail, onClick }) {
  return (
    <div
      className="cocktail-card"
      onClick={onClick}
      role="button"
      aria-label={`Apri dettagli ${cocktail?.strDrink}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
    >
      <img
        src={cocktail?.strDrinkThumb}
        alt={cocktail?.strDrink}
        loading="lazy"
        onError={(e) => {
          // fallback se immagine mancante
          e.currentTarget.src = "/placeholder-drink.png";
        }}
      />
      <div className="cocktail-title">{cocktail?.strDrink}</div>
    </div>
  );
}

export default CocktailCard;
