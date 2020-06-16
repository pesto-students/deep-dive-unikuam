import React, { Component } from 'react';

class AvailableClients extends Component {
  render() {
    return (
      <div className="avail-user-section">
        {
          this.props.player === null && this.props.clients.map((client, index) => <div key={index}>
          <span>{client}</span>
            <button
              onClick={() => this.props.click(client)}>
              join
            </button>
          </div>)
        }
      </div>
    );
  }
}

export default AvailableClients;
