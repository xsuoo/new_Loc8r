require('./locations');
var mongooseDB = require( 'mongoose' );
var dbURI = 'mongodb://localhost:27017/locations';
mongooseDB.connect(dbURI);

mongooseDB.connection.on('connected', function () {
console.log('Mongoose connected to ' + dbURI);
});
mongooseDB.connection.on('error',function (err) {
console.log('Mongoose connection error: ' + err);
});
mongooseDB.connection.on('disconnected', function () {
console.log('Mongoose disconnected');
});
var readLine = require ("readline");
if (process.platform === "win32"){
var rl = readLine.createInterface ({
input: process.stdin,
output: process.stdout
});
rl.on ("SIGINT", function (){
process.emit ("SIGINT");
});
}

gracefulShutdown = function (msg, callback) {
mongooseDB.connection.close(function () {
console.log('Mongoose disconnected through ' + msg);
callback();
});
};
// For nodemon restarts
process.once('SIGUSR2', function () {
gracefulShutdown('nodemon restart', function () {
process.kill(process.pid, 'SIGUSR2');
});
});
// For app termination
process.on('SIGINT', function() {
gracefulShutdown('app termination', function () {
process.exit(0);
});
});
// For Heroku app termination
process.on('SIGTERM', function() {
gracefulShutdown('Heroku app shutdown', function () {
process.exit(0);
});
});
