<template>
  <!-- 不解构 -->
  <!-- <p>{{ obj.testreative }}</p>   -->
  <!-- toRefs解构 -->
  <p> testreative: {{ testreative }}</p>
  <p> newreative :{{ newreative }}</p>
  <input type="button" value="get" @click="get" />
</template>

<script>
import { toRefs, ref, onMounted, reactive, computed } from "vue";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      count: 0,
    };
  },

  setup(props, context) {
    const obj = reactive({
      testreative: 1,
    });

    let { testreative } = toRefs(obj);
    //方式一 只读
    const newreative1 = computed(() => 
       obj.testreative + 1
    );
    console.log(newreative1); //ComputedRefImpl {_dirty: true, __v_isRef: true, __v_isReadonly: true, _setter: ƒ, effect: ƒ}
    
    //方式二 可更改
    const newreative = computed({
      get:()=>{
        return obj.testreative + 1
      },
      set:(val)=>{
        obj.testreative = val
      }
    });
    
    console.log(newreative); //ComputedRefImpl {_dirty: true, __v_isRef: true, __v_isReadonly: false, _setter: ƒ, effect: ƒ}

    

    const gettest = () => {
      if(!newreative.__v_isReadonly){
        newreative.value = 10
      }
    };

    return { testreative, gettest, newreative };
  },
  created() {},
  mounted() {},
  methods: {
    get() {
      this.gettest();
    },
  },
};
</script>
