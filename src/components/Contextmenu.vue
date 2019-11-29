<template>
  <div ref="contextmenu" tabindex="0" :class="['contextmenu', { show } ]" :style="style" @contextmenu="onContextmenu">
    <div class="item" v-for="item in menus" :key="item.key" @click="onClick(item)">{{ item.title }}</div>
  </div>
</template>

<script>
export default {
  name: 'contextmenu',
  props: {
    menus: Array
  },
  data() {
    return {
      x: 0,
      y: 0,
      show: false
    };
  },
  created: function() {
    this.$emit('ref', {
      onShow: this.onShow
    });
  },
  computed: {
    style: function() {
      return {
        top: this.y + 'px',
        left: this.x + 'px'
      };
    }
  },
  methods: {
    onShow: function({ x, y }) {
      console.log('contextmenu show');
      this.x = x;
      this.y = y;
      this.show = true;
      const contextmenu = this.$refs.contextmenu;
      this.$nextTick(function() {
        contextmenu.focus();
        contextmenu.removeEventListener('blur', this.onBlur);
        contextmenu.addEventListener('blur', this.onBlur);
      });
    },
    onHide: function() {
      this.show = false;
    },
    onBlur: function() {
      this.onHide();
    },
    onClick: function(item) {
      this.onHide();
      this.$emit('click', item);
    },
    onContextmenu: function($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
  }
}
</script>

<style>
.contextmenu {
  display: none;
  position: absolute;
  width: 180px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  background: #FFF;
  outline: none;
}
.contextmenu.show {
  display: flex;
  flex-direction: column;
}
.contextmenu .item {
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--height);
  padding: 0 10px;
  line-height: 0;
  font-size: 14px;
  cursor: pointer;
}
.contextmenu .item:hover {
  background: rgba(0, 0, 0, 0.07);
}
</style>
