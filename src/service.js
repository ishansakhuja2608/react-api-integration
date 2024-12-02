export const fetchAvailablePlaces = async () => {
  const response = await fetch("http://localhost:3000/places");
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return responseData.places;
};

export const updatePlaces = async (places) => {
  const response = await fetch("http://localhost:3000/user-places", {
    method: "PUT",
    body: JSON.stringify({ places: places }), // since js arrays are not attachable, converting it to json
    headers: {
      "Content-Type": "application/json", // informing the request that the data is in the form of the json
    },
  });
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error("Failed to update user data");
  }
  return responseData.message;
};

export const fetchUserPlaces = async () => {
  const response = await fetch("http://localhost:3000/user-places");
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error("failed to fetch user places");
  }

  return responseData.places;
};
