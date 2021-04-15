<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue' // setup ref toRefs

import HelloWorld from './components/HelloWorld2.vue'  //reative
export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>
