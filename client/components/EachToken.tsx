import { FunctionComponent } from "react";
import { ownerDataRedis } from "../interfaces";

interface EachTokenProps {
  tokenDetails: ownerDataRedis;
}

const EachToken: FunctionComponent<EachTokenProps> = ({ tokenDetails }) => {
  const formatDate = (dateStr: string) => {
    let finalStr = "??/??/???? ??:??";
    if (!dateStr) {
      return finalStr;
    }
    const date = new Date(parseInt(dateStr)),
      year = date.getFullYear(),
      month = date.getMonth() + 1, // months are zero indexed
      day = date.getDate(),
      hour = date.getHours(),
      minute = date.getMinutes(),
      second = date.getSeconds(),
      hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
      minuteFormatted = minute < 10 ? "0" + minute : minute,
      morning = hour < 12 ? "am" : "pm";

    finalStr =
      month +
      "/" +
      day +
      "/" +
      year +
      " " +
      hourFormatted +
      ":" +
      minuteFormatted +
      morning;

    return finalStr;
  };

  const formatAddress = (address: string) => {
    if (!address) {
      return "";
    }
    let final =
      address.substring(0, 6) +
      "*****" +
      address.substring(address.length - 6, address.length);
    return final;
  };

  return (
    <>
      <div className="w-full max-w-xs bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 m-10 border border-gray-200 hover:bg-gray-100">
        <div className="flex  justify-center border border-b-black-200">
          <img
            className="p-8 rounded-t-lg w-40 "
            src="/RON-logo.gif"
            alt="product image"
          />
        </div>

        <div className="px-5 py-2">
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
            {/* x-scroll */}
            <h5 className="text-xl font-thin tracking-tight text-gray-900 dark:text-white overflow-hidden ">
              {formatAddress(tokenDetails.address!)}
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
          <div className="flex my-1">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-1 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
              Purchased
            </span>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {formatDate(tokenDetails.createdAt!)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EachToken;
