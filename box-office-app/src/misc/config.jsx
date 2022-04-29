const API_BASE_URL = 'https://api.tvmaze.com';

export async function apiGet(queryString) {
  const response = await fetch(`${API_BASE_URL}${queryString}`).then(r =>
    r.json()
  );
  return response;
}

/** easier way to fetch the results from the api, code to be placed directly inside home.jsx */
// fetch(`https://api.tvmaze.com/search/shows?q=${input}`)
//   .then(r => r.json())
//   .then(result => {
//     setResults(result); //setting result state
//     console.log(result);
//   });
