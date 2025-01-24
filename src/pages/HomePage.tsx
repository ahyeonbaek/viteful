import { useEffect } from "react";

const HomePage = () => {
  const testFetch = async () => {
    const result = await fetch("/api/test")
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
        return null;
      });
    console.log(result);
  };
  useEffect(() => {
    testFetch();
  }, []);
  return (
    <>
      <h2>Home Page</h2>
    </>
  );
};
export default HomePage;
