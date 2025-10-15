export default function CocktailModal({ cocktail, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2>{cocktail.strDrink}</h2>
        <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
        <p><strong>Categoria:</strong> {cocktail.strCategory}</p>
        <p><strong>Tipo:</strong> {cocktail.strAlcoholic}</p>
        <p><strong>Bicchiere:</strong> {cocktail.strGlass}</p>
        <p><strong>Istruzioni:</strong> {cocktail.strInstructions}</p>
        <ul>
          {Array.from({ length: 15 }, (_, i) => i + 1)
            .map(i => {
              const ingredient = cocktail[`strIngredient${i}`];
              const measure = cocktail[`strMeasure${i}`];
              return ingredient ? (
                <li key={i}>{measure || ""} {ingredient}</li>
              ) : null;
            })}
        </ul>
      </div>
    </div>
  );
}