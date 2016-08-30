# Android Material Shadow Generator

*Android icons with that loooong material shadow for everyone!*

![Android icon example](screenshots/android.png) ![Bug icon example](screenshots/bug.png) ![Heart icon example](screenshots/heart.png) ![Idea icon example](screenshots/idea.png)

![Screenshot](screenshots/01.small.png)

## FAQ

### Custom SVG file contains only a single path, but no output is generated

Make sure that your SVG file contains closed paths instead of open ones. For example

![Open vs close paths example](screenshots/faq-closed-paths.png)

The icon on the left contains a single path (made up of two sub paths) that is open at the ends (first
node does not connect to the last node). The icon on the right has closed paths, where the shape of the paths
are that of the stroke width of the original icon.

For Inkscape users there is a nice tool that does the above conversion: "Path" -> "Stroke to Path".


## Build

First, download / setup the dependencies:

```
npm install
```

Next get a hold of [brunch](http://brunch.io/), the build tool used for this project. To install globally:

```
npm install -g brunch
```

Then to start compiling + watching files run

```
npm start
```

which will start a local server at [http://localhost:3333](http://localhost:3333).


## Updating the Google Material Icons

To update the local [Google Material Icons](https://design.google.com/icons/) collection
run `./bin/update-material-icons.sh` which will place all icons under `app/assets/img/material-icons`
and create a file with all icon names under `app/templates/input-material-icons-data.static.jade`.


## Tests

Tests require [PhantomJS](http://phantomjs.org/) (v2.1.1), [CasperJS](http://casperjs.org/) (v1.1.0-beta5) and
the site running at http://localhost:3333 (e.g. `npm start`). Run tests via `npm test`.

![Travis Status](https://api.travis-ci.org/Maddoc42/Android-Material-Icon-Generator.svg?branch=master)


## License
Copyright 2016 Philipp Eichhorn 

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
