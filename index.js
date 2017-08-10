var print = console.log.bind(console)
var printd = console.dir.bind(console)
var noop = () => undefined
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
    this.ctx.children.push({kind: undefined, children: () => this.content, isContent: true})

    return this
  }

  render(props={}, ...content) {
    var h = this.h
    this.content = Array.isArray(content[0]) ? content[0] : content

    var rfn = n => {
      var {kind, props=noop, children} = n

      if (kind === undefined && n.isContent)
        return children()

      return h(kind, props(), ...children.map(rfn))
    }

    var propsMerged = () => Object.assign(this.root.props || {}, props)  // Merge in new root props.

    return rfn({kind: this.root.kind, props: propsMerged, children: this.root.children})
  }
}

var s = new SlimScript(h)
var r = s
.comp('div', {'data-name': 'sam'})
.add
.this('ul')
.add
.this('li')
.add
.content()
.parent(2)
.add
.this('hr')
.content()
.this('br')
.render({'data-name': 'bob'}, h('div', {}, h('small', null, 'hola')))

print(r.outerHTML)
