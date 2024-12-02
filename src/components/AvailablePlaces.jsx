import { useState } from "react";
import Places from "./Places.jsx";
import { useEffect } from "react";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../service.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  // Fetching the data using the fetch(), line 8 to 22
  /**
   * The fetch function returns a Promise that resolves to a response. After the response is received,
   * we use .then to perform further actions. The json() method on the response also returns a Promise.
   * Once resolved, we can set the data using setAvailablePlaces.
   */
  // useEffect(() => {
  //   fetch("http://localhost:3000/places")
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((responseData) => {
  //       setAvailablePlaces(responseData.places);
  //     });
  // }, []);

  /**
   * This function utilizes async and await to handle asynchronous operations.
   * We can use await only inside an async function.
   * First, we await the response after the fetch promise resolves.
   * Then, we await the responseData after the .json() promise resolves.
   */
  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const places = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        setError({ message: error.message || "Could not fetch the data" });
        setIsFetching(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <Error title="An error occurred" message={error.message} />;
  }
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText={"Loading the places..."}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
