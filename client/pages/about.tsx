import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";

const about = () => {
  return (
    <>
      <Head>
        <title>About SD17</title>
        <meta name="description" content="About page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="flex justify-center items-center">
        <div className="w-full max-w-sm bg-white rounded-lg border border-red-600 shadow-md shadow-red-500  hover:bg-gray-100">
          <div className="flex flex-col items-center pb-10">
            <img
              className="mb-3 w-24 h-24 rounded-full shadow-lg"
              src="/butters.png"
              alt="dp"
            />
            <h5 className="mb-1 text-xl font-medium text-gray-900 ">
              Saswata Dutta
            </h5>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-1 rounded  ml-3">
              Software Developer
            </span>

            <div className="flex mt-4 space-x-3 md:mt-6">
              <div>
                <Link href="https://github.com/SD170" passHref>
                  <a className="hover-a" target="_blank">
                    GitHub&rarr;
                  </a>
                </Link>
                <br />
                <Link href="https://www.linkedin.com/in/sd170" passHref>
                  <a className="hover-a" target="_blank">
                    LinkedIn&rarr;
                  </a>
                </Link>
                <br />
                <Link
                  href="https://stackoverflow.com/users/11974952/saswata-dutta"
                  passHref
                >
                  <a className="hover-a" target="_blank">
                    Stackoverflow&rarr;
                  </a>
                </Link>
              </div>
            </div>
            <hr className="w-full h-1 bg-red-600" />
            <h5 className="mt-2 text-xl font-medium text-gray-900 ">
              Description
            </h5>
            <p className="m-4 font-light text-gray-700 ">
              <label className="text-red-600 font-semibold">RON</label> is a layer 2
              token(ERC-20) on Ropsten(ETH) TESTNET Blockchain. The smart contract is
              written in <label className="font-semibold">solidity</label> on{" "}
              <label className="font-semibold">truffle</label>. The dApp is
              built using <label className="font-semibold">Next.js</label>.{" "}
              <label className="font-semibold">Redis</label> is used as the primary datastore.
              Deployed on <label className="font-semibold">Vercel</label> platform.

            </p>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          div {
            margin: 10px;
          }
          .hover-a {
            display: inline-block;
            position: relative;
            color: #0087ca;
          }

          .hover-a:after {
            content: "";
            position: absolute;
            width: 100%;
            transform: scaleX(0);
            height: 2px;
            bottom: 0;
            left: 0;
            background-color: #0087ca;
            transform-origin: bottom right;
            transition: transform 0.25s ease-out;
          }

          .hover-a:hover:after {
            transform: scaleX(1);
            transform-origin: bottom left;
          }
        `}
      </style>
    </>
  );
};

export default about;
