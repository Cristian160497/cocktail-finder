import React, { useEffect, useState } from "react";
import CocktailModal from "../components/CocktailModal";

export default function Home() {
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [selectedCocktail, setSelectedCocktail] = useState(null);

  useEffect(() => {
    const fetchCocktails = async () => {
      const letters = "abcdefghijklmnopqrstuvwxyz".split("");
      let allCocktails = [];

      for (const letter of letters) {
        try {
          const response = await fetch(
            `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`
          );
          const data = await response.json();
          if (data.drinks) {
            allCocktails = [...allCocktails, ...data.drinks];
          }
        } catch (error) {
          console.error("Errore nel caricamento:", error);
        } finally {
          setLoadedCount((prev) => prev + 1);
        }
      }

      const uniqueCocktails = Array.from(
        new Map(allCocktails.map((drink) => [drink.idDrink, drink])).values()
      );

      setCocktails(uniqueCocktails);
      setLoading(false);
    };

    fetchCocktails();
  }, []);

  return (
    <div className="home-container">
      <header className="header">
        <h1 className="title">🍸 Cocktail Finder</h1>
      </header>

      {loading ? (
        <p className="loading-text">
          Caricamento cocktail... ({loadedCount}/26)
        </p>
      ) : (
        <div className="cocktail-grid">
          {cocktails.map((cocktail) => (
            <div
              key={cocktail.idDrink}
              className="cocktail-card"
              onClick={() => setSelectedCocktail(cocktail)}
            >
              <img
                src={cocktail.strDrinkThumb}
                alt={cocktail.strDrink}
                className="cocktail-image"
              />
              <h2 className="cocktail-name">{cocktail.strDrink}</h2>
            </div>
          ))}
        </div>
      )}

      {selectedCocktail && (
        <CocktailModal
          cocktail={selectedCocktail}
          onClose={() => setSelectedCocktail(null)}
        />
      )}
    </div>
  );
}