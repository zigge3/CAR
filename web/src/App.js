import React, { Component } from 'react';
import { Button } from 'reactstrap';
import openSocket from 'socket.io-client';
const socket = openSocket('/');

class App extends Component {
  constructor(props) {
    super(props);

    socket.on('cardRequest', ({cards}) => {
      console.log(cards);
    })
    socket.on('cardsShow', (cards) => {
      console.log(cards.currentCards);
    })
  }
  drawCards() {
    socket.emit('requestCards', { numberOfCards: 2 });
  }
  showCard() {
    socket.emit('showCard', { text: "David Bowie riding a lightning tiger"  });
  }
  render() {
    return (
      <div className="App">
        <Button onClick={this.drawCards}>Draw cards</Button>
        <Button onClick={this.showCard}>Show cards</Button>

      </div>
    );
  }
}

export default App;
