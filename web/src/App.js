import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import openSocket from 'socket.io-client';
const socket = openSocket('/');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      joined: false,
      userName: '',
      users: [],
      message: '',
      messages: []
    };
    socket.on('cardRequest', ({ cards }) => {
      console.log(cards);
    });
    socket.on('cardsShow', cards => {
      console.log(cards.currentCards);
    });
    socket.on('listClients', clients => {
      let message =
        clients
          .filter(client => this.state.users.length && !this.state.users.includes(client))
          .map(client => ({clientName: 'Server', text: `${client} joined!`}))
      this.setState({ users: clients, messages: [...this.state.messages, ...message] });
    });

    socket.on('receiveMessage', message => {
      console.log(message);
      this.setState({ messages: [...this.state.messages, message] });
    });
  }

  componentWillMount() {}
  drawCards() {
    socket.emit('requestCards', { numberOfCards: 2 });
  }
  showCard() {
    socket.emit('showCard', { text: 'David Bowie riding a lightning tiger' });
  }
  handleChangeUsername(e) {
    this.setState({
      userName: e.target.value
    });
  }

  handleChangeMessage(e) {
    this.setState({
      message: e.target.value
    });
  }

  submitMessage(e) {
    e.preventDefault();
    socket.emit('sendMessage', this.state.message);
    this.setState({ message: '' });
  }

  submitUsername(e) {
    e.preventDefault();
    this.setState({ joined: true });
    socket.emit('setUserName', this.state.userName);
  }
  setUserName() {}
  render() {
    let users = this.state.users.map((x, i) => <ListGroupItem key={i}>{x}</ListGroupItem>);
    let messages = this.state.messages.map((x, i) => (
      <p key={i}>{`${x.clientName} said: ${x.text}`}</p>
    ));
    return (
      <div className="App">
        <div className="container">
          <h1>Cards Against React</h1>
          <div className="row">
            <div className="col-8">
            {messages}
            </div>
            <div className="col-4">
              Clients
              <ListGroup>{users}</ListGroup>
            </div>
            <hr />
            {this.state.joined > 0 ? (
              <div className="col-8">
                <form onSubmit={e => this.submitMessage(e)}>
                  <InputGroup>
                    <InputGroupAddon addonType="append">
                      <Button type="submit" disabled={!this.state.message}>Send</Button>
                    </InputGroupAddon>
                    <Input
                      placeholder="Message"
                      value={this.state.message}
                      onChange={e => this.handleChangeMessage(e)}
                    />
                  </InputGroup>
                </form>
              </div>
            ) : (
              <div className="col-4">
                <form onSubmit={e => this.submitUsername(e)}>
                  <InputGroup>
                    <InputGroupAddon addonType="append">
                      <Button type="submit" disabled={!this.state.userName}>Join</Button>
                    </InputGroupAddon>
                    <Input
                      placeholder="Username"
                      value={this.state.userName}
                      onChange={e => this.handleChangeUsername(e)}
                    />
                  </InputGroup>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
