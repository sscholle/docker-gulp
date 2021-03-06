var gulp = require('gulp');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;
var watch = require('gulp-watch');
var batch = require('gulp-batch');

var server;

// `gulp` - Provides a live reloading development enviornment
gulp.task('default', ['serve:devserver']);

// part of the default task, provides a watch over the server side code, on a change it will run the `server` task
gulp.task('serve:devserver', ['server'], function() {
  watch('**/*.js', batch(function (events, done) {
        gulp.start('server', done);
    }));
});

// Provides a reloading node server for the development environment
gulp.task('server', function() {
  if (server) {
    server.kill();
  }
  server = spawn('node', ['./src/app.js'], {stdio: 'inherit'});
  server.on('close', function close(code) {
    if (code === 8) {
      gutil.log('Error detected, waiting for changes...');
    }
  });
});

// On exit just make sure we kill the dev server with prejudice
process.on('exit', function() {
  if (server) server.kill();
});
