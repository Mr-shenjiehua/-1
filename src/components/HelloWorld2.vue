<template>
  <!-- 不解构 -->
  <!-- <p>{{ obj.testreative }}</p>   -->
  <!-- toRefs解构 -->
  <p>{{ testreative }}</p>  
  <p>{{ msg }}</p>
  <input type="button" value="get" @click="get">
</template>

<script>
import { toRefs, ref, onMounted, reactive  } from 'vue'
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

  setup(props,context) {
    
    const obj = reactive({
      testreative:1
    })
    
    console.log(obj);  //Proxy {testreative: 1}

    const { msg } = toRefs(props);

    // return { obj,gettest }; //不解构
    
    let { testreative } = toRefs(obj);
    console.log(testreative);  // ObjectRefImpl {_object: Proxy, _key: "testreative", __v_isRef: true}
    
    const gettest = ()=>{
      obj.testreative++

      testreative.value++      //经toRefs解构的对象，使用时相当于ref，需用.value, 修改后obj也会响应修改
      // msg = '1'             //无法修改 无响应性
      console.log(obj);
    }

    return { testreative, gettest, msg}
  },
  created() {

  },
  mounted() {

  },
  methods: {
    get(){
      this.gettest();
    }
  },
}
</script>
