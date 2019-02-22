const FlagBuilder = require('../builders/flag-builder');
const Parser = new FlagBuilder(['--yes=true']);

console.log(Parser.getResult());