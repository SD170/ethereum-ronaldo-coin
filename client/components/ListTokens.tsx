import { FunctionComponent, useEffect, useState } from 'react';

const ListTokens: FunctionComponent = () => {
    const [tokenOwners, setTokenOwners] = useState([])
  useEffect(() => {
    const getAllOwners = async () => {
      const res = await fetch("/api//getOwners", {
        method: "GET"
        // headers: {
        //   "Content-Type": "application/json"
        // }
      });

      const result = await res.json();
      console.log("result of getAllOwners api", result);
      setTokenOwners(result)
    };

    getAllOwners();
  }, []);

  return (
    <>
      <div>ss</div>
    </>
  );
};

export default ListTokens;
