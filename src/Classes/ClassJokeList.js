import React from "react";
import axios from "axios";
import Joke from "./ClassJoke";
import "../JokeList.css";

class JokeList extends React.Component {
  static defaultProps = {
    numJokes: 10,
  };

  constructor(props) {
    super(props);
    this.state = { jokes: [] };
    this.getNewJokes = this.getNewJokes.bind(this);
    this.vote = this.vote.bind(this);
  }

  componentDidMount() {
    if (this.state.jokes.length < this.props.numJokes) this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokes) this.getJokes();
  }

  async getJokes() {
    let j = [];
    let seenJokes = new Set();
    try {
      while (j.length < this.props.numJokes) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({ jokes: j });
    } catch (e) {
      console.log(e);
    }
  }

  getNewJokes() {
    this.setState({ jokes: [] });
  }

  vote(id, delta) {
    this.setState((allJokes) => ({
      jokes: allJokes.jokes.map((j) =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      ),
    }));
  }

  render() {
    const { jokes } = this.state;
    if (jokes.length) {
      let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.getNewJokes}>
            Get New Jokes
          </button>

          {sortedJokes.map((j) => (
            <Joke
              text={j.joke}
              key={j.id}
              id={j.id}
              votes={j.votes}
              vote={this.vote}
            />
          ))}
        </div>
      );
    }

    return null;
  }

  //   return null;
}

export default JokeList;
