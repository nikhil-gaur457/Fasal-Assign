import React, { useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import MyList from "./components/mylist";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
    let movies = [];

    const [movie, setMovie] = useState();

    function handleMovies(mo) {
        setMovie(mo);
        movies.push(mo);
        localStorage.setItem("list", mo);
        // console.log(movies);
    }

    return (
        <div className="app">
            <Router>
                <Routes>
                    <Route exact path="/" element={<Login />} />
                    <Route path="/home" element={<Home handle={handleMovies} />} />
                    <Route path="/list" element={<MyList />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
