module.exports = class Options extends Object {
  constructor(name, destination, options = {}) {
    super();
    this.name = name;
    this.destination = destination;
    this.jsx = false;
    this.redux = false;
    this.styleExt = 'css';
    for (var attr in options) {
      this[attr] = options[attr];
    }
  }

  processArgs(args) {
    for (let i = 1; i < args.length; i++) {
      switch(args[i]) {
        case 'redux':
          this.redux = true;
          break;

        case 'jsx':
          this.jsx = true;
          break;

        case 'scss':
          this.styleExt = 'scss'
          break;

        case 'sass':
          this.styleExt = 'sass'
          break;

        default:
          throw new Error(`Invalid option [${args[i]}]. Use 'partum --help' for a list of options.`)
      }
    }
  }
};
