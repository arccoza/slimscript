var print = console.log.bind(console)
var printd = console.dir.bind(console)
var h = require('hyperscript')


class SlimScript {
  constructor(h) {
    this.h = h
    this.root = null
    this.idx = null  // idx -> index: the current item element.
    this.ctx = null  // ctx -> context: the current container element.
  }

  get add() {
    this.ctx = this.idx

    return this
  }

  comp(kind, props=undefined) {
    this.idx = this.root = {kind, props, children: [], parent: null}

    return this
  }

  this(kind, props=undefined, predi=undefined) {
    var child = {kind, props, children: [], parent: this.ctx}
    this.ctx.children.push(child)
    this.idx = child

    return this
  }

  parent(count=1) {
    var parent = this.ctx.parent

    for(let i = 1; i < count; i++)
      parent = parent.parent

    this.idx = parent

    return this
  }

  content() {
    this.ctx.children.push(() => this.content)
  }

  render(props={}, ...content) {
    var h = this.h
    this.content = Array.isArray(content[0]) ? content[0] : content

    var rfn = n => {
      var {kind, props=() => null, children} = n

      return h(kind, props(), ...children.map(rfn))
    }

    return rfn(this.root)
  }
}

var s = new SlimScript(h)
var r = s
.comp('div')
.add
.this('ul')
.add
.this('li')
.parent()
.add
.this('hr')
.render()

print(r.outerHTML)
