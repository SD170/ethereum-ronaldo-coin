import { FunctionComponent } from "react";
import { ownerDataRedis } from "../interfaces";

interface EachTokenProps {
  tokenDetails: ownerDataRedis;
}

const EachToken: FunctionComponent<EachTokenProps> = ({ tokenDetails }) => {
  return (
    <>
      <div className="">
        {tokenDetails.entityId} - 
        {tokenDetails.address} -
        {tokenDetails.name} -
        {tokenDetails.note} -
      </div>
    </>
  );
};

export default EachToken;
