import { useState, useEffect } from "react";
import Image from "next/image";
import SearchResults from "./SearchResults";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const getResults = async () => {
      if (searchTerm === "") {
        setSearchResults([]);
      } else {
        const res = await fetch(`/api/search?q=${searchTerm}`);
        if (process.env.NODE_ENV === "production") {
          const { results } = await JSON.parse(await res.json());
          setSearchResults(results);
        } else {
          const { results } = await res.json();
          setSearchResults(results);
        }
      }
    };

    getResults();
  }, [searchTerm]);

  const searchChoseHandler = () => {
    setSearchTerm("");
  };

  return (
    <div className="relative bg-gray-300 p-4">
      <div className="container mx-auto flex items-center justify-center">
        <form
          className="relative text-gray-300 w-72"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="search"
            name="search"
            id="search"
            className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-72 placeholder-gray-300"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value.trimStart().toLowerCase())
            }
            placeholder="Искать Посты ..."
          />
          <div className="absolute top-0 right-0 text-black mt-3 mr-3">
            <Image src="/images/search.svg" alt="" width={20} height={20} />
          </div>
        </form>
      </div>
      <SearchResults results={searchResults} onClick={searchChoseHandler} />
    </div>
  );
}
