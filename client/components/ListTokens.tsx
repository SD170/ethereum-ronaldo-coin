import { FunctionComponent, useEffect, useState, useCallback } from "react";
import { ownerDataRedis } from "../interfaces";
import EachToken from "./EachToken";

interface EachTokenProps {
  tokenOwners: ownerDataRedis[];
}

const ListTokens: FunctionComponent<EachTokenProps> = ({tokenOwners}) => {
  // const [tokenOwners, setTokenOwners] = useState<ownerDataRedis[]>([]);

  // const getAllOwners = useCallback(async () => {
  //   const res = await fetch("/api/getOwners", {
  //     method: "GET"
  //   });

  //   const result = await res.json();
  //   // console.log("result of getAllOwners api", result);
  //   setTokenOwners(result);
  // }, []); // setTokenOwners is already memoised as setState()'s are as per react. So no need to include it in the dependency array

  // useEffect(() => {
  //   // console.log("tokenOwners",tokenOwners);
  //   getAllOwners();
  // }, [getAllOwners]);

  return (
    <>
    
      {tokenOwners.map((to) => (
        <span key={to.entityId}>
          <EachToken tokenDetails={to} />
        </span>
      ))}
    </>
  );
};

export default ListTokens;
