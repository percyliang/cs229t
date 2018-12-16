G = sfig.serverSide ? global : this;
sfig.importAllMethods(G);

// Latex macros
sfig.latexMacro('R', 0, '\\mathbb{R}');
sfig.latexMacro('P', 0, '\\mathbb{P}');
sfig.latexMacro('E', 0, '\\mathbb{E}');
sfig.latexMacro('sF', 0, '\\mathcal{F}');
sfig.latexMacro('sH', 0, '\\mathcal{H}');
sfig.latexMacro('sP', 0, '\\mathcal{P}');
sfig.latexMacro('sQ', 0, '\\mathcal{Q}');
sfig.latexMacro('sX', 0, '\\mathcal{X}');
sfig.latexMacro('diag', 0, '\\text{diag}');

sfig.initialize();

G.prez = sfig.presentation();

// Useful functions (not standard enough to put into an sfig library).

G.frameBox = function(a) { return frame(a).bg.strokeWidth(1).fillColor('white').end; }
G.bigFrameBox = function(a) { return frameBox(a).padding(10).scale(1.4); }

G.bigArrow = function(a, b) { return arrow(a, b).strokeWidth(10).color('brown'); }
G.bigLeftArrow = function(s) { return leftArrow(s || 100).strokeWidth(10).color('brown'); }
G.bigRightArrow = function(s) { return rightArrow(s || 100).strokeWidth(10).color('brown'); }
G.bigUpArrow = function(s) { return upArrow(s || 100).strokeWidth(10).color('brown'); }
G.bigDownArrow = function(s) { return downArrow(s || 100).strokeWidth(10).color('brown'); }

G.xseq = function() { return new sfig.Table([arguments]).center().margin(5); }
G.yseq = function() { return ytable.apply(null, arguments).margin(10); }

G.stmt = function(prefix, suffix) {
  var m;
  if (!suffix && (m = prefix.match(/^([^:]+): (.+)$/))) {
    prefix = m[1];
    suffix = m[2];
  }
  return prefix.fontcolor('darkblue') + ':' + (suffix ? ' '+suffix : '');
}
G.headerList = function(title) {
  var contents = Array.prototype.slice.call(arguments).slice(1);
  return ytable.apply(null, [title ? stmt(title) : _].concat(contents.map(function(line) {
    if (line == _) return _;
    if (typeof(line) == 'string') return bulletedText([null, line]);
    if (line instanceof sfig.PropertyChanger) return line;
    return indent(line);
  })));
}

G.node = function(x, shaded) { return overlay(circle(20).fillColor(shaded ? 'lightgray' : 'white') , x).center(); }
G.indent = function(x, n) { return frame(x).xpadding(n != null ? n : 20).xpivot(1); }
G.stagger = function(b1, b2) { b1 = std(b1); b2 = std(b2); return overlay(b1.numLevels(1), pause(), b2); }

G.dividerSlide = function(text) {
  return slide(null, nil(), parentCenter(text)).titleHeight(0);
}

G.moveLeftOf = function(a, b, offset) { return transform(a).pivot(1, 0).shift(b.left().sub(offset == null ? 5 : offset), b.ymiddle()); }
G.moveRightOf = function(a, b, offset) { return transform(a).pivot(-1, 0).shift(b.right().add(offset == null ? 5 : offset), b.ymiddle()); }
G.moveTopOf = function(a, b, offset) { return transform(a).pivot(0, 1).shift(b.xmiddle(), b.top().up(offset == null ? 5 : offset)); }
G.moveBottomOf = function(a, b, offset) { return transform(a).pivot(0, -1).shift(b.xmiddle(), b.bottom().down(offset == null ? 5 : offset)); }
G.moveCenterOf = function(a, b) { return transform(a).pivot(0, 0).shift(b.xmiddle(), b.ymiddle()); }
G.moveBottomLeftOf = function(a, b, offset) { return transform(a).pivot(1, -1).shift(b.left().sub(offset == null ? 5 : offset), b.bottom().down(offset == null ? 5 : offset)); }

////////////////////////////////////////////////////////////

G.asymptoticNormality = function() {
  var w = 200;
  var h = 100;
  function eps(f) { return ellipse(w * f, h * f).rotate(30); }
  function pt(x, y, color) { return circle(5).fillColor(color).shiftBy(x, y); }
  return overlay(
    t0 = pt(0, 0, 'black'), moveLeftOf('$\\theta^*$', t0),
    t1 = pt(100, 50, 'red'), moveRightOf('$\\hat\\theta$', t1),
    line(t0, t1).dashed(),
    eps(1),
    eps(0.8),
    eps(0.6),
    eps(0.4),
  _);
}

G.uniformConvergence = function() {
  var width = 500;
  Math.seedrandom(30);
  function L(x) {
    return Math.pow(0.06 * (x - width / 2), 2);
  }
  function Lhat(x) {
    var s = 0;
    for (var i = 0; i < 10; i++)
      s += Math.random() - 0.5;
    return L(x) + 30 * s;
  }
  function pt(x, y, color) { return circle(3).fillColor(color).shift(x, y); }
  function curve(f, color, h, L, first) {
    var segments = [];
    var xs = [];
    var ys = [];
    var n = 50;
    var mini = 0;
    for (var i = 0; i < n; i++) {
      var x = width * i / n;
      xs[i] = x;
      ys[i] = f(x);
      if (ys[i] < ys[mini])
        mini = i;
      if (i == 0) continue;
      segments.push(line([xs[i-1], ys[i-1]], [xs[i], ys[i]]).color(color).strokeWidth(2));
    }
    var seg = first ? segments[0] : segments[segments.length - 1];

    var p = pt(xs[mini], ys[mini], color);
    segments.push(p);
    segments.push(moveBottomOf(h, p));
    segments.push(moveLeftOf(std(L).color(color), seg));
    return new Overlay(segments);
  }
  return overlay(
    curve(L, 'black', '$h^*$', 'expected risk $L$', true),
    curve(Lhat, 'red', '$\\hat h_\\text{ERM}$', 'empirical risk $\\hat L$', false),
  _);
}

G.onlineLearningGame = function() {
  function l(x) { return ytable(std(x).orphan(true), leftArrow(150)).center(); }
  function r(x) { return ytable(std(x).orphan(true), rightArrow(150)).center(); }
  function player(x) { return frameBox(redbold(x)).padding(5, 180).bg.strokeWidth(3).end; }
  return overlay(
    xtable(
      player('Learner'),
      ytable(
        l('$x_1$'),
        r('$p_1$'),
        l('$y_1$'),
        '...',
        l('$x_T$'),
        r('$p_T$'),
        l('$y_T$'),
      _).margin(40).center(),
      player('Nature'),
    _).center().margin(5),
  _);
}

G.ogdFtrl = function() {
  // TODO
  return overlay(
    arrow([-10, 0], [200, 0]),
    arrow([0, -10], [100, 0]),
  _);
}

G.errorDecomp = function() {
  return overlay(
    //center(a = ellipse(350, 100).fillColor('brown').fillOpacity(0.2)),
    //transform('all predictors').pivot(-1, -1).scale(0.8).shift(a.left(), a.top()),
    t = circle(5).fillColor('orange').shiftBy(-400, 0),
    moveLeftOf(bold('oracle').fontcolor('orange'), t),
    e = ellipse(200, 60).strokeWidth(2).fillColor('blue').fillOpacity(0.3),
    center('$\\blue{\\sH}$').shiftBy(150, -50),
    b = circle(5).fillColor('green').shift(e.left(), e.ymiddle()),
    moveBottomLeftOf('$\\green{h^*}$', b, 0),
    c = circle(5).fillColor('brown').shiftBy(-10, 10),
    moveRightOf('$\\brown{\\hat h}$', c),
    l1 = line(t, [e.left(), e.ymiddle()]).dashed().strokeWidth(3),
    moveTopOf(bold('approximation'), l1).scale(0.8),
    l2 = line([e.left(), e.ymiddle()], c).dashed().strokeWidth(3),
    moveTopOf(bold('estimation'), l2).scale(0.8),
  _);
}

G.errorDecompOpt = function() {
  return overlay(
    //center(a = ellipse(350, 100).fillColor('brown').fillOpacity(0.2)),
    //transform('all predictors').pivot(-1, -1).scale(0.8).shift(a.left(), a.top()),
    t = circle(5).fillColor('orange').shiftBy(-400, 0),
    moveLeftOf(bold('oracle').fontcolor('orange'), t),
    e = ellipse(200, 60).strokeWidth(2).fillColor('blue').fillOpacity(0.3),
    center('$\\blue{\\sH}$').shiftBy(150, -50),
    b = circle(5).fillColor('green').shift(e.left(), e.ymiddle()),
    moveBottomLeftOf('$\\green{h^*}$', b, 0),
    c = circle(5).fillColor('brown').shiftBy(-10, 10),
    moveBottomOf('$\\brown{\\hat h_\\text{ERM}}$', c),
    l1 = line(t, [e.left(), e.ymiddle()]).dashed().strokeWidth(3),
    moveTopOf(bold('approximation'), l1).scale(0.8),
    l2 = line([e.left(), e.ymiddle()], c).dashed().strokeWidth(3),
    moveTopOf(bold('estimation'), l2).scale(0.8),
    d = circle(5).fillColor('brown').shiftBy(100, 10),
    l3 = line(c, d).dashed().strokeWidth(3),
    moveTopOf(bold('optimization'), l3).scale(0.8),
    moveRightOf('$\\brown{\\hat h_\\text{ALG}}$', d),
    ellipse(50, 30).strokeWidth(2).fillColor('orange').fillOpacity(0.3).shiftBy(100, 0),
  _);
}

G.kernelViews = function() {
  function box(a) { return frameBox(a).padding(5); }
  return overlay(
    ytable(
      phi = box('Feature map $\\phi(x)$'),
      xtable(
        k = box('Kernel $k(x,x\')$'),
        h = box('RKHS $\\sH$ with $\\|\\cdot\\|_\\sH$'),
      _).margin(200),
    _).margin(100).center(),
    a1 = arrow(phi, k),
    moveCenterOf(opaquebg('unique'), a1),
    a2 = arrow(k, h).drawArrow(true),
    moveCenterOf(opaquebg(frame('unique').padding(5)), a2),
    a3 = arrow(h, phi),
  _);
}

G.pythagorean = function() {
  function box(a) { return frameBox(a).padding(5); }
  return overlay(
    Q = decoratedLine([-300, 0], [50, 0]).drawArrow(true).strokeWidth(5).color('red'),
    P = decoratedLine([0, down(50)], [0, up(200)]).drawArrow(true).strokeWidth(5).color('blue'),
    o = circle(7).color('black'),
    p = circle(7).color('black').shift(0, up(100)),
    q = circle(7).color('black').shift(-150, 0),
    moveTopOf('$\\blue{\\sP = \\{ p_\\theta \\propto \\exp \\{ \\theta \\cdot \\phi(x) \\} : \\theta \\in \\R^d \\}}$', P),
    moveLeftOf('$\\red{\\sQ = \\{ q : \\E_q[\\phi(x)] = \\hat\\mu \\}}$', Q),
    moveBottomLeftOf('$\\hat p$', o),
    moveRightOf('$p$', p),
    moveBottomOf('$q$', q),
    line([-20, 0], [-20, up(20)]).strokeWidth(2),
    line([-20, up(20)], [0, up(20)]).strokeWidth(2),
    line(p, q).dashed().strokeWidth(3),
  _);
}

G.pt = function(x, y) { return circle(5).fillColor('black').shift(x, y); }
G.momentMappingDiagram = function(opts) {
  return parentCenter(overlay(
    xtable(
      overlay(
        Theta = ellipse(120, 80).fillColor('pink').strokeWidth(2),
        moveLeftOf('$\\Theta$', Theta),
        opts.pause ? showLevel(2) : _,
        p1 = pt(20, up(40)), moveLeftOf('$\\theta^*$', p1),
        opts.pause ? showLevel(4) : _,
        opts.inverse ? overlay(p2 = pt(30, up(10)), moveLeftOf('$\\hat\\theta$', p2)) : _,
      _),
      opts.pause ? showLevel(1) : _,
      overlay(
        Moments = ellipse(180, 100).fillColor('lightblue').strokeWidth(2),
        moveRightOf('$\\R^p$', Moments),
        opts.pause ? showLevel(2) : _,
        q1 = pt(-70, up(40)), moveRightOf('$m^*$', q1),
        opts.pause ? showLevel(3) : _,
        opts.inverse ? overlay(q2 = pt(-100, up(10)), moveRightOf('$\\hat m$', q2)) : _,
      _),
    _).xmargin(80).center(),
    opts.pause ? showLevel(2) : _,
    M = arrow(p1, q1).strokeWidth(2).color('gray'), moveTopOf('$\\blue{M}$', M),
    opts.pause ? showLevel(4) : _,
    opts.inverse ? overlay(Minv = arrow(q2, p2).strokeWidth(2).color('gray'), moveBottomOf('$\\red{M^{-1}}$', Minv)) : _,
  _));
}
