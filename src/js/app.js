class App {
  constructor() {
    this.example = 'This is example app!';
  }
  static log(log) {
    console.log(log);
  }
  getExample() {
    return this.example;
  }
}

export default App;
