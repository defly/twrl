import Flummox from 'flummox';
import TwrlActions from './actions/TwrlActions'
import CitiesStore from './stores/CitiesStore'

export default class Flux extends Flummox {
  constructor() {
    super();

    this.createActions('twrl', TwrlActions);
    this.createStore('cities', CitiesStore, this);
  }
}