import { FunctionComponent } from "react";
import { ownerDataRedis } from "../interfaces";

interface EachTokenProps {
  tokenDetails: ownerDataRedis;
}

const EachToken: FunctionComponent<EachTokenProps> = ({ tokenDetails }) => {
  return (
    <>
      <div className="w-full max-w-xs bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 m-10 border border-gray-200 hover:bg-gray-100" >
        <a href="#" className="flex  justify-center border border-b-black-200">
          <img
            className="p-8 rounded-t-lg w-40 "
            src="/RON-logo.gif"
            alt="product image"
          />
        </a>

        <div className="px-5 pb-5">
          <div className="flex my-1">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-1 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
              Owner
            </span>
            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white overflow-hidden">
              {tokenDetails.name}
            </h5>
          </div>
          <div className="flex my-1">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-1 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
              Address
            </span>
            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white overflow-x-scroll">
              {tokenDetails.address}
            </h5>
          </div>
          <div className="flex my-1">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-1 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
              Note
            </span>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {tokenDetails.note}
            </p>
          </div>
        </div>
      </div>
      {/* <div className="">
        {tokenDetails.entityId} - 
        {tokenDetails.address} -
        {tokenDetails.name} -
        {tokenDetails.note} -
      </div> */}
    </>
  );
};

export default EachToken;
