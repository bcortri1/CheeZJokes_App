import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
    constructor(props) {
        super(props);
        this.numJokesToGet = 10 || props.numJokesToGet
        this.state = { jokes: [] };
        this.generateNewJokes = this.generateNewJokes.bind(this);
        this.vote = this.vote.bind(this);
    }

    async componentDidMount(prevProps) {
        this.getJokes();
    }

    /* get jokes if there are no jokes */
    async componentDidUpdate(prevProps) {
        if (this.state.jokes.length === 0) this.getJokes();
    }

    async getJokes() {
        let j = [...this.state.jokes];
        let seenJokes = new Set();
        try {
            while (j.length < this.numJokesToGet) {
                let res = await axios.get("https://icanhazdadjoke.com", {
                    headers: { Accept: "application/json" }
                });
                let { status, ...jokeObj } = res.data;

                if (!seenJokes.has(jokeObj.id)) {
                    seenJokes.add(jokeObj.id);
                    j.push({ ...jokeObj, votes: 0 });
                } else {
                    console.error("duplicate found!");
                }
            }
            this.setState({jokes: j});
        } catch (e) {
            console.log(e);
        }
    }

    generateNewJokes() {
        this.setState({jokes: []});
    }


    /* change vote for this id by delta (+1 or -1) */

    vote(id, delta) {
        const allJokes = this.state.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
        this.setState({jokes: allJokes});
    }

    /* render: either loading spinner or list of sorted jokes. */
    render(){
        if(this.state.jokes.length) {
            let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
    
            return (
                <div className="JokeList">
                    <button className="JokeList-getmore" onClick={this.generateNewJokes}>
                        Get New Jokes
                    </button>
    
                    {sortedJokes.map(j => (
                        <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
                    ))}
                </div>
            );
        }

        else{
            return null;
        }
        
    }


}

export default JokeList;
