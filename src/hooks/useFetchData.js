import { useEffect, useState } from "react";

export const useFetch = (fetchFn, initialValue) => {
  const [isFetching, setIsFetching] = useState();
  const [error, setError] = useState();
  const [fetchedData, setFetchedData] = useState(initialValue);
  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const data = await fetchFn();
        setFetchedData(data);
      } catch (error) {
        setError({ message: error.message || "Could not fetch the data" });
      }
      setIsFetching(false);
    };
    fetchData();
  }, [fetchFn]);
  return { isFetching, error, fetchedData, setFetchedData };
};
