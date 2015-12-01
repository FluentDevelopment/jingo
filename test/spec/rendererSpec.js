
var Renderer = require("../../lib/renderer");

describe ("Renderer", function() {

  it ("should render bracket tags1", function() {
    var text = "a [[Foo]] b";
    expect(Renderer.render(text)).to.be.equal("<p>a <a class=\"internal\" href=\"/wiki/Foo\">Foo</a> b</p>\n");
  });

  it ("should render bracket tags2", function() {
    var text = "a [[Foo]][[Foo]][[Foo]] b";
    expect(Renderer.render(text)).to.be.equal("<p>a <a class=\"internal\" href=\"/wiki/Foo\">Foo</a><a class=\"internal\" href=\"/wiki/Foo\">Foo</a><a class=\"internal\" href=\"/wiki/Foo\">Foo</a> b</p>\n");
  });

  it ("should render bracket tags3", function() {
    var text = "a [[Foo Bar]] b";
    expect(Renderer.render(text)).to.be.equal("<p>a <a class=\"internal\" href=\"/wiki/Foo-Bar\">Foo Bar</a> b</p>\n");
  });

  it ("should render bracket tags4", function() {
    var text = "a [[Foo]][[Bar]] b";
    expect(Renderer.render(text)).to.be.equal("<p>a <a class=\"internal\" href=\"/wiki/Foo\">Foo</a><a class=\"internal\" href=\"/wiki/Bar\">Bar</a> b</p>\n");
  });

  it ("should render bracket tags5", function() {
    var text = "a [[Foo]] [[Bar]] b";
    expect(Renderer.render(text)).to.be.equal("<p>a <a class=\"internal\" href=\"/wiki/Foo\">Foo</a> <a class=\"internal\" href=\"/wiki/Bar\">Bar</a> b</p>\n");
  });

  it ("should render bracket tags6", function() {
    var text = "a [[Il marito di Foo|Foobar]] [[Bar]] b";
    expect(Renderer.render(text)).to.be.equal("<p>a <a class=\"internal\" href=\"/wiki/Foobar\">Il marito di Foo</a> <a class=\"internal\" href=\"/wiki/Bar\">Bar</a> b</p>\n");
  });

  it ("should render bracket tags7", function() {
    var text = "a [[Foo / Bar]] b";
    expect(Renderer.render(text)).to.be.equal("<p>a <a class=\"internal\" href=\"/wiki/Foo-%2B-Bar\">Foo / Bar</a> b</p>\n");
  });

  it ("should render bracket tags8", function() {
    var text = "[[Foo]], [[Bar]]";
    expect(Renderer.render(text)).to.be.equal("<p><a class=\"internal\" href=\"/wiki/Foo\">Foo</a>, <a class=\"internal\" href=\"/wiki/Bar\">Bar</a></p>\n");
  });

  it ("should not render escaped tags 1", function() {
    var text = "a \\[[Foo]] b";
    expect(Renderer.render(text)).to.be.equal("<p>a [[Foo]] b</p>\n");
  });

  it ("should not render escaped tags 2", function() {
    var text = "a \\[[Foo]][[Bar]] b";
    expect(Renderer.render(text)).to.be.equal("<p>a [[Foo]]<a class=\"internal\" href=\"/wiki/Bar\">Bar</a> b</p>\n");
  });

  it ("should not render escaped tags 3", function() {
    var text = "a [[Foo]]\\[[Bar]] b";
    expect(Renderer.render(text)).to.be.equal("<p>a <a class=\"internal\" href=\"/wiki/Foo\">Foo</a>[[Bar]] b</p>\n");
  });

  it ("should not render escaped tags 4", function() {
    var text = "a \\[[Foo]]\\[[Bar]] b";
    expect(Renderer.render(text)).to.be.equal("<p>a [[Foo]][[Bar]] b</p>\n");
  });

  it ("should not render escaped tags 5", function() {
    var text = "a \\[[Foo / Bar]] b";
    expect(Renderer.render(text)).to.be.equal("<p>a [[Foo / Bar]] b</p>\n");
  });

  it ("should render tags after escaped backslash 1", function() {
    var text = "a \\\\[[Foo]] b";
    expect(Renderer.render(text)).to.be.equal("<p>a \\<a class=\"internal\" href=\"/wiki/Foo\">Foo</a> b</p>\n");
  });

  it ("should not render escaped tags 1", function() {
    var text = "a \\\\\\[[Foo]] b";
    expect(Renderer.render(text)).to.be.equal("<p>a \\[[Foo]] b</p>\n");
  });

  it ("should replace {{TOC}} with the table of contents", function() {
    var text = "{{TOC}}\n\n # Heading 1 \n\n This is some text";
    expect(Renderer.render(text)).to.be.equal("<ul>\n<li><p><a href=\"#heading-1\">Heading 1</a></p>\n<h1 id=\"heading-1\">Heading 1</h1>\n<p>This is some text</p>\n</li>\n</ul>\n");
  });


});
