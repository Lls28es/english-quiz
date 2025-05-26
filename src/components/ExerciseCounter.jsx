import { useEffect, useState } from 'react';

export default function ExcerciseCounter() {
  const [countCategories, setCountCategories] = useState([]);

  useEffect(() => {
    fetch('/english_exercises.json')
      .then((res) => res.json())
      .then((data) => {
        let categories = data.reduce((acum, objeto) => {
          if (
            objeto &&
            // objeto.hasOwnProperty('category') // Instead, we can use the following line to check if the property exists
            Object.prototype.hasOwnProperty.call(objeto, 'category') &&
            !acum.includes(objeto['category'])
          ) {
            acum.push(objeto['category']);
          }
          return acum;
        }, []);

        let countCategories = categories.map((category) => {
          const count = data.filter((q) => q.category === category);
          return { category, count: count.length, exercices: count };
        });
        setCountCategories(countCategories);
      });
  }, []);

  return (
    <div className="pt-5 align-items-center">
      <h3 className="d-inline text-red-500 bg-black bg-opacity-75 rounded-3 px-2 py-1 fs-14">
        {countCategories.reduce((acc, cat) => acc + cat.count, 0)} Exercises
      </h3>
      <h3 className=" text-black mt-1 mb-0 fs-14">
        {countCategories.map((cat, i) => (
          <span key={i} className="d-inline-block bg-danger rounded-2 px-1 m-1">
            {cat.category}:{cat.count}{' '}
          </span>
        ))}
      </h3>
    </div>
  );
}
