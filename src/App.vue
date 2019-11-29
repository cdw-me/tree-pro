<template>
  <div id="app">
    <div class="main">
      <tree-pro :data="data" :openAll="true" />
    </div>
  </div>
</template>

<script>
import TreePro from './components/TreePro.vue'

export default {
  name: 'app',
  components: {
    TreePro
  },
  data() {
    return {
      data: [
        {
          key: '0',
          title: '测试0',
          children: [
            {
              key: '0-0',
              title: '测试0-0',
              children: [
                {
                  key: '0-0-0',
                  title: '测试0-0-0',
                  children: [
                      
                  ]
                },
                {
                  key: '0-0-1',
                  title: '测试0-0-1',
                  children: [
                      
                  ]
                }
              ]
            },
            {
              key: '0-1',
              title: '测试0-1',
              children: [
                  
              ]
            }
          ]
        }
      ]
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}
html {
  height: 100%;
}
body {
  display: flex;
  margin: 0;
  height: 100%;
}
#app {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20px;
}
.main {
  width: 300px;
  height: 100%;
  border: 1px solid rgba(0,0,0,.07);
}

</style>
