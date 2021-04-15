export function showData(...args) {
  console.log('this', this)
  console.log('args', args)
  args.forEach((item) => {
    console.log(item, this[item])
  })
}