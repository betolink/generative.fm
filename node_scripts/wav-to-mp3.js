'use strict';

const path = require('path');
const { Lame } = require('node-lame');
const glob = require('glob');

glob('./samples/vsco2-contrabass-susvib-wav/*.wav', (err, files) => {
  files.forEach(filename => {
    const basename = path.basename(filename, '.wav');
    const decoder = new Lame({
      output: `./samples/vsco2-contrabass-susvib-mp3/${basename}.mp3`,
    }).setFile(filename);
    decoder.decode();
  });
});
