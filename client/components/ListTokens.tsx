import { FunctionComponent, useEffect, useState, useCallback } from "react";
import { ownerDataRedis } from "../interfaces";
import EachToken from "./EachToken";

interface EachTokenProps {
  tokenOwners: ownerDataRedis[];
}

const ListTokens: FunctionComponent<EachTokenProps> = ({tokenOwners}) => {

  return (
    <div className="flex flex-wrap justify-around">
    
      {tokenOwners.map((to) => (
        <span key={to.entityId}>
          <EachToken tokenDetails={to} />
        </span>
      ))}
    </div>
  );
};

export default ListTokens;
