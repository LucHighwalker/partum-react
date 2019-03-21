const spin = ['/', '-', '\\', '-', '/', '-', '\\', '-'];
const dots = ['.       ', '..      ', '...     ', '....    ', '.....   ', '......  ', '....... ', '........'];

class Loading {
  constructor() {
    this.loading = null;
    this.killed = false;
    this.counter = 0;
  }

  startLoading() {
    this.loading = setInterval(() => {
      if (!this.killed) {
        process.stdout.write(`${spin[this.counter]}this might take a while${dots[this.counter]}\r`);
        this.counter += 1;
        if (this.counter === dots.length) {
          this.counter = 0;
        }
      }
    }, 500);
  }

  stopLoading() {
    this.killed = true;
    process.stdout.write('                                \r');
    clearInterval(this.loading);
  }
}

module.exports = new Loading();
