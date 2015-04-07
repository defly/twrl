import { Actions } from 'flummox';
import SockJS from 'sockjs-client'

export default class TwrlActions extends Actions {

  constructor() {
    super();
    // setInterval(() => this.newCities(), 1500);
    let sock = new SockJS('/ws'); //TODO reconnect

    let self = this;

    sock.onmessage = function(e) {
     self.newCities(e.data)
    };

  };

  newCities(e) {
    return [e];
  }

}