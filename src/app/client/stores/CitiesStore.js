import { Store } from 'flummox';

export default class CitiesStore extends Store {

  constructor(flux) {
    super(); // Don't forget this step

    const messageActionIds = flux.getActionIds('twrl');
    
    this.register(messageActionIds.newCities, this.handleNewCities);

    this.state = {
      cities: ['one'],
    };
  }

  handleNewCities(message) {
    this.setState({
      // cities: ['NY', 'LA', 'WTF', 'OMG'],
      cities: message,
    });
  }

  getCities() {
    return this.state;
  }
}