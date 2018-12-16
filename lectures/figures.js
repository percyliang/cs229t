// For node.js
require('./sfig/internal/sfig.js');
require('./sfig/internal/Graph.js');
require('./sfig/internal/RootedTree.js');
require('./sfig/internal/metapost.js');
require('./sfig/internal/seedrandom.js');
require('./utils.js');

prez.addSlide(errorDecomp().id('errorDecomp'));

prez.addSlide(asymptoticNormality().id('asymptoticNormality'));
prez.addSlide(asymptoticNormality().id('asymptoticNormality'));
prez.addSlide(pythagorean().id('pythagorean'));
prez.addSlide(momentMappingDiagram({inverse: true}).id('momentMappingDiagram'));

prez.addSlide(uniformConvergence().id('uniformConvergence'));

prez.addSlide(kernelViews().id('kernelViews'));
prez.addSlide(errorDecompOpt().id('errorDecompOpt'));

prez.addSlide(onlineLearningGame().id('onlineLearningGame'));
prez.addSlide(ogdFtrl().id('ogdFtrl'));

// For node.js: output PDF (you must have Metapost installed).
prez.writePdf({outPrefix: 'figures', combine: false});
