<template>
  <div id="app">
    <div class="main">
      <tree-pro :data="data" :openAll="true" @onEdit="onEdit" @onDelete="onDelete" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
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
              title: '测试0-1'
            }
          ]
        }
      ]
    }
  },
  methods: {
    onEdit: function(data, callback) {
      let key = data.key;
      if (!key) {
        this.addNum = this.addNum || 0;
        ++this.addNum;
        key = 'new_' + this.addNum;
      }
      setTimeout(function() {
        callback(true, { key });
      }, 1000);
    },
    onDelete: function(data, callback) {
      setTimeout(function() {
        callback(true);
      }, 1000);
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
