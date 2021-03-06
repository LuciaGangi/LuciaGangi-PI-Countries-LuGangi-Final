import { clearFilter, getAllCountries } from "../actions/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Country } from "../components/Country";
import { Pagination } from "../components/Pagination";
import { Link } from "react-router-dom";
import mundo from "../img/Mundo_hecho_de_Banderas.gif";
import loading from "../img/loading.gif";
import style from "../Styles/Countries.module.css";

export function Countries() {
  const dispatch = useDispatch();

  const countries = useSelector((state) => state);

  const [currentPage, setCurrentPage] = useState(1);

  const [countriesPerPage, setCountriesPerPage] = useState(10);

  const pageValidator = (currentPage) => {
    if (currentPage === 1) {
      setCountriesPerPage(9);
      return;
    }
    setCountriesPerPage(10);
  };

  useEffect(() => {
    dispatch(getAllCountries());
  }, [dispatch]);

  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountry = Array.isArray(countries.searchCountry)
    ? countries.searchCountry?.slice(indexOfFirstCountry, indexOfLastCountry)
    : countries.allCountries?.slice(indexOfFirstCountry, indexOfLastCountry);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderContext = {
    allCountries:
      countries.allCountries.length === 0 ? (
        <div>
          <div>
            <h2>Loading countries...</h2>
          </div>
          <div>
            <img src={loading} alt="Esperando países..." />
          </div>
        </div>
      ) : (
        currentCountry?.map((country) => (
          <Country
            key={country.id}
            id={country.id}
            flag={country.flag}
            name={country.name}
            region={country.region}
          />
        ))
      ),

    searchCountry: !Array.isArray(countries.searchCountry) ? (
      <>
        <h1>Ups!! No se encuentra el país...</h1>
        <img src={mundo} alt="gif mundo" />
      </>
    ) : (
      currentCountry?.map((country) => (
        <Country
          key={country.id}
          id={country.id}
          flag={country.flag}
          name={country.name}
          region={country.region}
        />
      ))
    ),
  };

  useEffect(() => {
    pageValidator(currentPage);
  }, [currentPage]);

  return (
    <div className={style.container}>
      <div className={style.containerGrid}>
        {!countries.searchCountry
          ? renderContext.allCountries
          : renderContext.searchCountry}
      </div>
      <div>
        <Pagination
          countriesPerPage={countriesPerPage}
          totalCountries={
            countries.searchCountry
              ? countries.searchCountry.length
              : countries.allCountries.length
          }
          paginate={paginate}
        />
      </div>
      <div className={style.containerDouble}>
        {countries.searchCountry ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <button
              className={style.lightButton}
              onClick={() => dispatch(clearFilter())}
            >
              Volver a todos los países
            </button>
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        ></div>
      </div>
    </div>
  );
}
