// Function to fetch game data from Lichess API
export async function fetchLichessGameId(id: string) {
  try {
    const response = await fetch(`https://lichess.org/api/game/${id}`);
    if (!response.ok) {
      console.error(`Lichess API error: ${response.status}`);
      return null;
    }
    const data = await response.json();
    return data.id; // Returns PGN data as text
  } catch (error) {
    console.error("Error fetching Lichess game data:", error);
    return null;
  }
}

export async function fetchLichessGameData(id: string) {
  try {
    const response = await fetch(`https://lichess.org/game/export/${id}`);
    if (!response.ok) {
      console.error(`Lichess API error: ${response.status}`);
      return null;
    }
    const data = await response.text(); // This will be the PGN data as text
    
    return data;
  } catch (error) {
    console.error("Error fetching Lichess game data:", error);
    return null;
  }
}

// Function to fetch user data from Lichess API
export async function fetchLichessUserData(userId: string) {
  try {
    const response = await fetch(`https://lichess.org/api/user/${userId}`);
    if (!response.ok) {
      console.error(`Lichess API error fetching user ${userId}: ${response.status}`);
      return null;
    }
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error(`Error fetching Lichess user ${userId}:`, error);
    return null;
  }
}