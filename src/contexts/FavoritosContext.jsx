import { createContext, useContext, useState, useEffect } from 'react';

const FavoritosContext = createContext();

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState(() => {
    const savedFavoritos = localStorage.getItem('favoritos');
    return savedFavoritos ? JSON.parse(savedFavoritos) : [];
  });

  useEffect(() => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  const toggleFavorito = (produto) => {
    setFavoritos(prev => {
      const isFavorito = prev.some(fav => fav.codigo === produto.codigo);
      if (isFavorito) {
        return prev.filter(fav => fav.codigo !== produto.codigo);
      } else {
        return [...prev, produto];
      }
    });
  };

  const isFavorito = (codigo) => {
    return favoritos.some(fav => fav.codigo === codigo);
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito, isFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export const useFavoritos = () => useContext(FavoritosContext);
