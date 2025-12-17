import React, { useEffect, useState, useRef } from "react";
import { useCocktailStore } from "../store/cocktailStore";
import CocktailCard from "../components/CocktailCard";
import CocktailModal from "../components/CocktailModal";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { cocktailService } from "../services/cocktailService";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registra il plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

function Home() {
  const {
    cocktails,
    loading,
    error,
    fetchCocktails,
  } = useCocktailStore();

  const [selected, setSelected] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

   // Refs per le animazioni
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    fetchCocktails();
  }, [fetchCocktails]);

  // 🎬 ANIMAZIONE 1: Entrance iniziale della pagina
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline per l'entrata coordinata
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Anima solo se i ref esistono
      if (searchRef.current) {
        tl.from(searchRef.current, {
          y: -50,
          opacity: 0,
          duration: 0.8,
        });
      }

      if (titleRef.current) {
        tl.from(titleRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          scale: 0.9,
        }, "-=0.4");
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 🎬 ANIMAZIONE 2: Stagger delle card quando vengono caricate
  useEffect(() => {
    if (!loading && cocktails.length > 0) {
      // Filtra solo i ref validi
      const validCards = cardsRef.current.filter(card => card !== null && card !== undefined);

      if (validCards.length > 0) {
        const ctx = gsap.context(() => {
          gsap.from(validCards, {
            opacity: 0,
            y: 60,
            scale: 0.8,
            rotation: -5,
            duration: 0.6,
            stagger: {
              amount: 0.8,
              from: "start",
              ease: "power2.out"
            },
            ease: "back.out(1.4)",
            clearProps: "opacity, transform"
          });
        }, containerRef);

        return () => ctx.revert();
      }
    }
  }, [loading, cocktails]);

  const handleRetry = () => {
    fetchCocktails();
  };

  // 🎬 ANIMAZIONE 3: Hover effect magnetico sulle card
  const handleCardHover = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      scale: 1.12,
      y: -12,
      rotationY: 5,
      boxShadow: "0 20px 50px rgba(212, 175, 55, 0.4)",
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleCardLeave = (index) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      scale: 1,
      y: 0,
      rotationY: 0,
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  // 🎬 ANIMAZIONE 4: Modal con effetto esplosivo
  const openCocktail = async (idDrink) => {
    setLoadingDetails(true);
    try {
      const res = await cocktailService.getCocktailById(idDrink);
      const details = res?.drinks?.[0] ?? null;
      setSelected(details);

      // Anima l'apertura del modal
      setTimeout(() => {
        const modal = document.querySelector('.modal-backdrop');
        const modalContent = document.querySelector('.modal-content');

        if (modal && modalContent) {
          gsap.fromTo(modal, 
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
          );

          gsap.fromTo(modalContent,
            { 
              scale: 0.7,
              opacity: 0,
              rotationX: -15,
              y: 100
            },
            { 
              scale: 1,
              opacity: 1,
              rotationX: 0,
              y: 0,
              duration: 0.6,
              ease: "back.out(1.4)"
            }
          );
        }
      }, 50);
    } catch (err) {
      console.error("Errore caricamento dettagli:", err);
      setSelected(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  // 🎬 ANIMAZIONE 5: Chiusura modal con effetto
  const closeModal = () => {
    const modal = document.querySelector('.modal-backdrop');
    const modalContent = document.querySelector('.modal-content');

    if (modal && modalContent) {
      gsap.to(modalContent, {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.3,
        ease: "power2.in"
      });

      gsap.to(modal, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => setSelected(null)
      });
    } else {
      setSelected(null);
    }
  };

  return (
     <div className="home-container" ref={containerRef}>
      <div ref={searchRef}>
        <SearchBar />
      </div>

      {loading && <LoadingSpinner />}

      {error && <ErrorMessage message={error} onRetry={handleRetry} />}

      {!loading && !error && cocktails?.length > 0 && (
        <>
          <div className="carousel-header">
            <h2 className="carousel-title" ref={titleRef}>
              Scopri i Cocktail
            </h2>
          </div>

          <div className="cocktail-grid" aria-live="polite">
            {cocktails.map((c, index) => (
              <div
                key={c.idDrink}
                ref={(el) => (cardsRef.current[index] = el)}
                onMouseEnter={(e) => handleCardHover(e, index)}
                onMouseLeave={() => handleCardLeave(index)}
              >
                <CocktailCard
                  cocktail={c}
                  onClick={() => openCocktail(c.idDrink)}
                />
              </div>
            ))}
          </div>

          <div className="carousel-indicator">
            {`Totale cocktail: ${cocktails.length}`}
          </div>
        </>
      )}

      {!loading && !error && cocktails?.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#f8d17a" }}>
          <h2>🍹 Nessun cocktail trovato</h2>
          <p>Prova a modificare i filtri o la ricerca</p>
        </div>
      )}

       {selected && (
        <CocktailModal
         cocktail={selected}
          onClose={closeModal}
        />
      )}

      {loadingDetails && (
        <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
          <div className="carousel-spinner" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

export default Home;