import React from "react";
import styles from './Pagination.module.css'
export const Pagination = ({ resultsPerPage, totalResults, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalResults / resultsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className={`${styles.paginationList}`}>
        {pageNumbers.map((number) => (
          <li
              className={`${styles.paginationItem}`}
            key={number}
            onClick={() => paginate(number)}
          >
            <button>{number}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
