import React, { useRef, useEffect } from 'react';

export default function Carousel({ cocktails }) {
    const slideRef = useRef(null);

    // AUTO-SCROLL
    useEffect(() => {
        const el = slideRef.current;
        if (!el) return;

        let interval = setInterval(() => {
            el.scrollBy({
                left: 260,
                behavior: "smooth",
            });

            // Reset quando arriva in fondo
            if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
                el.scrollTo({ left: 0, behavior: "smooth" });
            }
        }, 2600);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='carousel-container'>
            <div className='carousel' ref={slideRef}>
                {cocktails.map((c) => (
                    <div key={c.idDrink} className='carousel-card'>
                        <img 
                            src={c.strDrinkThumb}
                            alt={c.strDrink}
                            className='carousel-card-image'
                        />
                        <p className='carousel-card-title'>
                            {c.strDrink}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}