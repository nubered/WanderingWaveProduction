import React from 'react';
import * as d3 from 'd3';
import LeaderBoard from "./leader-board.jsx";

class Gameboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hasWinner: false,
      winner: '',
      cx: '570',
      cy: '225',
      radius: '40'
    };
  }

  componentDidMount() {
    this.props.socket.on('score', function(val) {
      console.log('data', val);
      if (this.state.cx < 1000 && this.state.cx > 140) {
        this.moveTheBall(val.difference);
      } else {
        let leftWon;
        if (this.state.cx >= 1000) {
          leftWon = true;
          this.setState({ winner: this.props.player1 });

        } else if (this.state.cx <= 140) {
          leftWon = false;
          this.setState({ winner: this.props.player2 });
        }

        let onLeft = localStorage.getItem('left'),
          myUserId = localStorage.getItem('userId'),
          myName = localStorage.getItem('display'),
          opponentUserId = this.props.opponentUserId,
          opponentName = this.props.opponent,
          key = this.props.position;

        let winner = opponentUserId,
          loser = myUserId,
          winnerName = opponentName;

        let bool = function(v) { return v === "false" || v === "null" || v === "NaN" || v === "undefined" || v === "0" ? false : !!v; };
        if (bool(onLeft) && leftWon || !bool(onLeft) && !leftWon) {
          winner = myUserId;
          loser = opponentUserId;
          winnerName = myName;
        }

        this.props.socket.emit('gameOver', { winner, loser, key, winnerName });
      }
    }.bind(this));
  }

  getMellowData(data, callback) {
    if (data['data'][0] === '/muse/elements/experimental/mellow') {
      var val = data['data'][1] * 100;
      callback(val);
    }
  }

  moveTheBall(val) {
    var cx = Number(this.state.cx);
    this.setState({ cx: cx + 11.5 * val }, () => { console.log('this is the state data', this.state.cx); });
    d3.select('.ball').transition().duration(100).attr('cx', this.state.cx);
  }

  changeBallSize(val) {
    var r = this.state.radius;
    if (val > 50) {
      this.setState({ radius: r + 5 });
    } else {
      this.setState({ radius: r - 5 });
    }
  }


  render() {

    if (this.state.cx < 1000 && this.state.cx > 140) {
      return (
        <div>
          <div className="players">
          <h1 className="player-1">{this.props.player1}</h1>
          <h1 className="player-2">{this.props.player2}</h1>
          </div>
                <svg width="1140" height="450">
                <circle className ="ball" cx={570} cy={this.state.cy} r={this.state.radius} stroke="#e46696" strokeWidth="3" fill="#e46696" />
                  <line x1="100" y1="25" x2="100" y2="425" style={{stroke:"#e46696", strokeWidth: 1}} />
                  <line x1="1040" y1="25" x2="1040" y2="425" style={{stroke:"#e46696", strokeWidth: 1}} />
                </svg>

        </div>
      );
    } else {
      return (
        <div>
          <h1>Gameover</h1>
          <h3>{this.state.winner} won the game!</h3>
          <LeaderBoard />
        </div>
      );
    }
  }
};

export default Gameboard;
