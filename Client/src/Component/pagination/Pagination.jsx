import React from "react";
import style from './pagin.module.css'

const Pagination = ({ totalPosts, postPerPage, setCurrentPage }) => {
  const pages = [];

 

  for (let i = 1; i <= Math.ceil(totalPosts / postPerPage); i++) {
    pages.push(i);
  }



  return (
    <div className={style.container} >
      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(page)}
          className={style.btn_pagination}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
