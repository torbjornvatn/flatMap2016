import React, { Component } from "react";
import { Heading } from "spectacle";

export default class Interactive extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <iframe frameBorder="0" src="http://localhost:3000" width="900px" height="550px" seamless></iframe>
      </div>
    );
  }
}
