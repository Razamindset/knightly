export const getCountryCode = (countryName?: string | null): string | undefined => {
    if (!countryName) return undefined;
  
    const lowerName = countryName.toLowerCase();
  
    switch (lowerName) {
      case "united states":
      case "usa":
        return "US";
      case "united kingdom":
      case "uk":
        return "GB";
      case "france":
        return "FR";
      case "germany":
        return "DE";
      case "russia":
        return "RU";
      // Add more mappings as needed based on your data
      default:
        return undefined; // Return undefined if no match is found
    }
  };