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

  comp(...all) {
    this.idx = this.root = {kind: all, children: [], parent: null}

    return this
  }

  this(...all) {
    var child = {kind: all, children: [], parent: this.ctx}
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

  render(props=null, ...children) {
    var h = this.h

    var rfn = n => {
      var [type, props=() => null] = n.kind
      return h(type, props(), ...n.children.map(rfn))
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
