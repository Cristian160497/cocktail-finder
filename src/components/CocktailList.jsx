import CocktailCard from "./CocktailCard";

export default function CocktailList({ cocktails, onSelect }) {
    return (
        <div>
            {cocktails.map((drink) => {
                <CocktailCard 
                    key={drink.idDrink}
                    drink={drink}
                    onClick={onSelect}
                />
            })}
        </div>
    );
}