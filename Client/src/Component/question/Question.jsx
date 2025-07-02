import React, { useEffect, useState } from 'react'
import axios from '../../API/axiosConfig'
import QuestionCard from './QuestionCard'
import style from './question.module.css'
import Pagination from '../pagination/Pagination';

function Question() {
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
 
  const [questions, setQuestions] = useState([])
  const [search, setSearch] = useState(""); 
  useEffect(() => {
    const getQuestions = async () => {
      try {
        await axios
          .get("/question")
          .then((res) => {
            setQuestions(res.data);
            
          })
          .catch((error) => console.log(error));
      } catch (error) {
        console.log(error, "Something wrong, try again");
        
      }
    }
    getQuestions();
  }, [])

  const filteredQuestions = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.content.toLowerCase().includes(search.toLowerCase())
  );

  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const currentPosts = filteredQuestions.slice(firstIndex, lastIndex);
  

  return (
    <section className={style.main_container}>
      <div className={style.search_container}>
        <input
          type="text"
          placeholder="Search by title or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={style.search_input}
        />
      </div>

      {currentPosts.map((question, index) => (
        <div key={index}>
          <QuestionCard data={question} />
        </div>
      ))}

      <Pagination
        totalPosts={filteredQuestions.length}
        postPerPage={recordsPerPage}
        setCurrentPage={setCurrentPage}
      />
    </section>
  );
}

export default Question