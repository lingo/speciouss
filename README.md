# Speciouss

A Work In Progess!

This spiders the site you give it, and records all CSS files and all classes used in a MongoDB instance.

The accompanying Express app (`node app/app.js`) allows you to view by class what pages it was used on.

## Installation

~~~sh
git clone ...
cd ...
npm install
~~~

## Usage

If you have docker and the mongo image, you can start a mongo instance using `./startdb.sh` and everything 'should just work'.

### Custom Mongo server
Otherwise, run your own mongodb instance.  If it's not on localhost using the default port, you'll need to change the URL in `config.js`.

### Run spider

~~~sh
./speciouss <START-URL>
~~~


## TODO

Pretty much everything!  So far it spiders okay and you can view the uses of the classes.

More info to come..

- Think about use of Arbor.js

