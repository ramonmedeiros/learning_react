import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Confetti from 'react-dom-confetti';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
    {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square value={this.props.squares[i]}
                   onClick={() => this.props.onClick(i)}/>;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      player: 'X',
    };
  }

  handleClick(i) {
    if (calculateWinner(this.generateSquare())) {
      return;
    }

    // check if square was already filled
    if (this.generateSquare()[i] != null) {
      return;
    }

    this.setState({player: this.nextPlayer(this.state.player),
                  history: this.state.history.concat({"player": this.state.player,
                                                      "position": i})
    });
  }

  nextPlayer(player){
    if (player == "X")
      return "O";
    return "X";
  }

  getMoves(move, desc){
    return (
      <li>
        <button onClick={() => this.jumpTo(move)}>{desc}</button>
      </li> 
    )
  }

  generateSquare(){
    let squares = Array(9).fill(null);

    for (let move of this.state.history){
      squares[move["position"]] = move["player"];
    }
    return squares;
  }

  jumpTo(move) {
    this.setState({history: this.state.history.slice(0,move+1),
                  player: this.nextPlayer(this.state.history[move]["player"])})
  }
  render() {
    const config = {
      angle: 90,
      spread: 45,
      startVelocity: 45,
      elementCount: 50,
      dragFriction: 0.1,
      duration: 3000,
      stagger: 0,
      width: "10px",
      height: "10px",
      colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
    };
    const winner = calculateWinner(this.generateSquare());
    let status;
    let confeti;

    if (winner) {
      status = 'Winner: ' + winner;
      confeti = true;
      
    } else {
      status = 'Next player:' + this.nextPlayer(this.state.player);
    }
    let moves = [];
    moves.push(this.getMoves(-1, "Go to start"))
    for (var i = 0; i < this.state.history.length; i++) {
      moves.push(this.getMoves(i, "Player " + this.state.history[i]["player"] + " at position " + this.state.history[i]["position"]));
    };

    return (
      <div className="game">
        <Confetti active={confeti} config={ config } />
        <div className="game-board">
          <Board 
            squares={this.generateSquare()} 
            onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

