import { useContext, useState } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import { getMatch, getDogDetails } from "../services/api";

export default function MatchPage() {
  const { favorites } = useContext(FavoritesContext);
  const [match, setMatch] = useState(null);

  const generateMatch = async () => {
    if (!favorites.length) return alert("No favorites selected");
    const matchId = await getMatch(favorites);
    const matchDetails = await getDogDetails([matchId.match]);
    setMatch(matchDetails[0]);
  };

  return (
    <div>
      <h1>Your Best Match</h1>
      {match ? (
        <div>
          <img src={match.img} alt={match.name} />
          <p>Name: {match.name}</p>
          <p>Breed: {match.breed}</p>
        </div>
      ) : (
        <button onClick={generateMatch}>Find My Match</button>
      )}
    </div>
  );
}
