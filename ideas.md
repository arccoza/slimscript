

```js
s.comp('div')
.add
.this('ul', {style: {color: 'red'}})
.this({color} => ['ul', {style: {color: color}}], data)
.this({color} => ['ul', {style: {color: color}}], () => data)
.this('ul', loopItemData => data)
.watch(cb => data.changed(cb))
.these('li', arr)
.these(item => ['li', {style: width: item[0].width}], arr)
.add
.this([, a, b] => ['some text ' + a, {style: {color: b}}])
.parent(2)
.add
.this('hr')
.render('#app')
```