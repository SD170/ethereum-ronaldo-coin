import { FunctionComponent, FormEvent } from "react";
interface PostBuyModalProps {
  handlePostBuy: (e: FormEvent) => void;
}

const PostBuyModal: FunctionComponent<PostBuyModalProps> = ({
  handlePostBuy
}) => {
  return (
    <>
      <div
        id="authentication-modal"
        tabIndex={-1}
        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full justify-center items-center flex backdrop-blur-md"
        aria-modal="true"
        role="dialog"
      >
        <div className="relative p-4 w-full max-w-md h-full md:h-auto">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow  border-red-200">
            <form onSubmit={handlePostBuy}>
              <button
                type="submit"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                data-modal-toggle="authentication-modal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <div className="py-6 px-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900 ">
                  Optional customization of{" "}
                  <label className="text-red-600">RON</label>
                </h3>
                <div className="space-y-6">
                  <div>
                    <span className="flex">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Display name
                      </label>
                      <label className="block mb-2 mx-2 text-sm font-medium text-blue-400 ">
                        Optional
                      </label>
                    </span>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      placeholder="any pseudo name"
                      required={false}
                    />
                  </div>
                  <div>
                    <span className="flex">
                      <label
                        htmlFor="note"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Small note
                      </label>
                      <label
                        htmlFor="note"
                        className="block mb-2 mx-2 text-sm font-medium text-blue-400 "
                      >
                        Optional
                      </label>
                    </span>
                    <input
                      type="text"
                      name="note"
                      id="note"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      placeholder="a little note..."
                      required={false}
                    />
                  </div>
                  <span className="flex justify-around">
                    <button
                      type="submit"
                      className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2 "
                    >
                      No, thank you
                    </button>
                    <button
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      I&apos;m all done
                    </button>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostBuyModal;
