var print = console.log.bind(console)
var printd = console.dir.bind(console)
var noop = (val=undefined) => val
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
    props = props === null ? undefined : props
    this.idx = this.root = {kind, props, children: [], parent: null}

    return this
  }

  this(kind, props=undefined, predi=noop) {
    props = props === null ? undefined : props
    var child = {kind, props, predi, children: [], parent: this.ctx}
    this.ctx.children.push(child)
    this.idx = child

    return this
  }

  these(kind, list, recur=noop) {
    // TODO
  }

  parent(count=1) {
    var parent = this.ctx.parent

    for(let i = 1; i < count; i++)
      parent = parent.parent

    this.idx = parent

    return this
  }

  content(predi=noop) {
    this.ctx.children.push({kind: undefined, predi, children: () => this.content, isContent: true})

    return this
  }

  render(props={}, ...content) {
    var h = this.h
    this.content = Array.isArray(content[0]) ? content[0] : content

    var rfn = n => {
      var c = []
      var {kind, props=noop, children} = n

      if (kind === undefined && n.isContent)
        return children()

      return h(kind, props(), ...(children.forEach(n => n.predi(true) ? c.push(rfn(n)) : null), c))
    }

    var propsMerged = () => Object.assign(this.root.props || {}, props)  // Merge in new root props.

    return rfn({kind: this.root.kind, props: propsMerged, children: this.root.children})
  }
}

function slimscript(h) {
  return new SlimScript(h)
}

module.exports = slimscript


var s = slimscript(h)
var r = s
.comp('div', {'data-name': 'sam'})
.add
.this('ul', null, () => true)
.add
.this('li')
.add
.content(() => true)
.parent(2)
.add
.this('hr')
.content()
.this('br')
.render({'data-name': 'bob'}, h('div', {}, h('small', null, 'hola')))

// var r = h('div', {'data-name': 'sam'},
//   h('ul',
//     h('li',
//       h('div', {}, h('small', null, 'hola'))
// )),
//   h('hr'),
//   h('div', {}, h('small', null, 'hola')),
//   h('br'))

print(r.outerHTML)
