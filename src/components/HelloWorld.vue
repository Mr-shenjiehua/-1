<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
  <p>{{ test }}</p>
  <input type="button" value="get" @click="get">
</template>

<script>
import { toRefs, ref, onMounted } from 'vue'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      count: 0
    }
  },
  //setup在组件实力创建前执行，比create早 可访问 props attrs slots emit 不能访问 data computed methods
  setup(props,context) {
    // console.log('props',props) //Proxy {msg: "Hello Vue 3.0 + Vite"}
    // console.log('context',context) //{expose: ƒ}
    //props是响应式的，无法用es6直接结构，会消除prop的响应，可用setup函数中的 toRefs操作
    //console.log(toRefs(props))//{msg: ObjectRefImpl}
    const { msg } = toRefs(props);

    //console.log(msg) //ObjectRefImpl {_object: Proxy, _key: "msg", __v_isRef: true}
    //console.log(msg.value) //Hello Vue 3.0 + Vite
    
    let test = ref('test'); //ref 函数使任何响应式变量在任何地方起作用
    console.log(test) //{_rawValue: "test", _shallow: false, __v_isRef: true, _value: "test"}

    const gettest = ()=>{
      test.value = '1'   //修改值需加.value
      console.log(test)  //{_rawValue: "1", _shallow: false, __v_isRef: true, _value: "1"}
    }

    // console.log(this) //undefined
    onMounted(() => {     //onMounted在created之后，mounted之前
      // console.log(this)  //undefined
    })
    return { test,gettest };
  },
  created() {
    // console.log('1')
    // console.log(this.test) //test
  },
  mounted() {
    // console.log('2')
    // console.log(this.test); //test

    setTimeout(() => {
      this.test = 'newtest'
      console.log(this.test); //newtest
    }, 1000);
  },
  methods: {
    get(){
      this.gettest();
    }
  },
}
</script>
