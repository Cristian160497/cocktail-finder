import React from "react";
import { cocktailService } from "../services/cocktailService";

function CocktailModal({ cocktail, onClose }) {
  if (!cocktail) return null;

  const ingredients = cocktailService.extractIngredients(cocktail);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-image-wrapper">
          <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} className="modal-image" />
          <button className="modal-close" onClick={onClose} aria-label="Chiudi">✕</button>
        </div>

        <div className="modal-body">
          <h2 className="modal-title">{cocktail.strDrink}</h2>

          <div className="modal-info-grid">
            <div>
              <small>Categoria</small>
              <p>{cocktail.strCategory}</p>
            </div>
            <div>
              <small>Tipo</small>
              <p>{cocktail.strAlcoholic}</p>
            </div>
            <div>
              <small>Bicchiere</small>
              <p>{cocktail.strGlass}</p>
            </div>
            {cocktail.strIBA && (
              <div>
                <small>IBA</small>
                <p>{cocktail.strIBA}</p>
              </div>
            )}
          </div>

          <div className="modal-section">
            <h4>Ingredienti</h4>
            <ul className="modal-ingredients">
              {ingredients.map((ing, idx) => (
                <li key={idx}>{ing.name} {ing.measure ? `- ${ing.measure}` : ""}</li>
              ))}
            </ul>
          </div>

          <div className="modal-section">
            <h4>Preparazione</h4>
            <div className="modal-instructions">
              <p>{cocktail.strInstructions}</p>
              {cocktail.strInstructionsIT && <p className="modal-italian">{cocktail.strInstructionsIT}</p>}
            </div>
          </div>

          {(cocktail.strTags || cocktail.strImageAttribution) && (
            <div className="modal-tags">
              {cocktail.strTags && <p><strong>Tags:</strong> {cocktail.strTags}</p>}
              {cocktail.strImageAttribution && <p className="modal-credits"><strong>Crediti immagine:</strong> {cocktail.strImageAttribution}</p>}
            </div>
          )}

          <button className="modal-close-btn" onClick={onClose}>Chiudi</button>
        </div>
      </div>
    </div>
  );
}

export default CocktailModal;
