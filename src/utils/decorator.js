/*
* by: chen ming
* time: 2019/11/13
* desc: 一些公用的装饰器（注解）
* */


export function decorator_click_event(){
  let _arguments = [...arguments]
  return (target, name, descriptor)=>{
    const method = descriptor.value
    descriptor.value = (...args) => {

      // console.log( args)
      method.apply(target, args)
    }
    return descriptor
  }
}


export function decorator_format_str(){
  return (target, name, descriptor)=>{
    console.log(descriptor)
    descriptor.value = 'change'
    return descriptor
  }
}
