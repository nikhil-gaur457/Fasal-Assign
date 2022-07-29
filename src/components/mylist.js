const baseURL = "https://image.tmdb.org/t/p/original/";
const MyList = () => {
    const movie = localStorage.getItem("list");
    console.log(movies);
    let movies = [];
    movies.push(movie);
    return (
        <div className="container">
            {movies.map((movie) => {
                return (
                    <div className="card" key={movie.id}>
                        <div className="list">
                            <img className="list_img" src={baseURL + movie.backdrop_path} alt="" />
                            <h2>{movie.title}</h2>
                        </div>
                        <p>{movie.overview}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default MyList;
