import { useRef, useState, useCallback } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { fetchUserPlaces, updatePlaces } from "./service.js";
import Error from "./components/Error.jsx";
import { useFetch } from "./hooks/useFetchData.js";

function App() {
  const selectedPlace = useRef();
  const [errorUpdatingPlace, setErrorUpdatingPlace] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const {
    isFetching,
    error,
    fetchedData: userPlaces,
    setFetchedData: setUserPlaces,
  } = useFetch(fetchUserPlaces, []);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }
  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    try {
      await updatePlaces([selectedPlace, ...userPlaces]);
    } catch (error) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlace({
        message: error.message || "Failed to update places.",
      });
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      );
      try {
        await updatePlaces(
          userPlaces.filter((place) => place.id !== selectedPlace.current.id)
        );
      } catch (error) {
        setUserPlaces(userPlaces);
        setErrorUpdatingPlace({
          message: error.message || "Could not delete...",
        });
      }

      setModalIsOpen(false);
    },
    [userPlaces, setUserPlaces]
  );

  const handleError = () => {
    setErrorUpdatingPlace(null);
  };

  return (
    <>
      <Modal open={errorUpdatingPlace} onClose={handleError}>
        {errorUpdatingPlace && (
          <Error
            title="An error occured"
            message={errorUpdatingPlace.message}
            onConfirm={handleError}
          />
        )}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <Error title="An error occured" message={error.message} />}
        {!error && (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            isLoading={isFetching}
            loadingText={"We are loading user places"}
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
        )}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
