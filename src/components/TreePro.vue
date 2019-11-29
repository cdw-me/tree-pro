<template>
  <div class="tree-pro">
    <div class="container" @click="onClick" @contextmenu="onContextmenu">
      <tree :data="data" />
    </div>
    <contextmenu @ref="onRef" :menu="menu" />
  </div>
</template>

<script>
import Tree from './Tree.vue';
import Contextmenu from './Contextmenu.vue';
export default {
  name: 'TreePro',
  components: {
    Tree,
    Contextmenu
  },
  props: {
    data: Array,
    openAll: { type: Boolean, default: false }
  },
  provide: function() {
    return {
      onSwitch: this.onSwitch,
      isOpen: this.isOpen,
      isActive: this.isActive
    }
  },
  data() {
    return {
      openMap: {},
      activeKey: '',
      menuKey: ''
    };
  },
  computed: {
    menu: function() {
      const menu = [{ key: 'add', title: '添加'}];
      if (this.menuKey) {
        menu.splice(1, 0, 
          { key: 'reanme', title: '重命名' },
          { key: 'delete', title: '删除' }
        );
      }
      return menu;
    }
  },
  methods: {
    onRef: function(ref) {
      this.contextmenu = ref;
    },
    onSwitch: function(key) {
      this.openMap[key] = !this.openMap[key];
    },
    isOpen: function(key) {
      typeof this.openMap[key] === 'undefined' && this.$set(this.openMap, key, this.openAll);
      return this.openMap[key];
    },
    isActive: function(key) {
      return this.activeKey === key;
    },
    closest: function(el, selector) {
      el.nodeName === '#text' && (el = el.parentElement);
      var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
      if (!matchesSelector) {
        return null;
      }
      while (el) {
        if (matchesSelector.call(el, selector)) {
          break;
        }
        el = el.parentElement;
      }
      return el;
    },
    onClick: function($event) {
      const titleBar = this.closest($event.target, '.title-bar');
      if (!titleBar) {
        return ;
      }
      const key = titleBar.getAttribute('data-key');
      this.activeKey = key;
    },
    onContextmenu: function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      const titleBar = this.closest($event.target, '.title-bar');
      const key = titleBar ? titleBar.getAttribute('data-key') : '';
      this.menuKey = key;
      const position = this.getContextmenuPosition($event);
      this.contextmenu.onShow(position);
    },
    getContextmenuPosition: function($event) {
      let el = $event.target;
      const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
      let x = $event.offsetX;
      let y = $event.offsetY;
      while (el) {
        if (matchesSelector.call(el, '.tree-pro')) {
          break;
        }
        x += el.offsetLeft;
        y += el.offsetTop;
        el = el.offsetParent;
      }
      return { x, y };
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.tree-pro {
  --height: 28px;
  position: relative;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  user-select: none;
  color: #444;
  font-size: 14px;
}
.tree-pro .container {
  flex: 1 0 100px;
  width: 100%;
  height: 100%;
  padding-bottom: var(--height);
  overflow-x: hidden;
  overflow-y: auto;
  overflow-y: overlay;
}
.tree-pro ul {
  position: relative;
}
.tree-pro li {
  position: relative;
  height: var(--height);
  overflow: hidden;
}
.tree-pro li.open {
  height: auto;
}
.tree-pro li.open > .title-bar .icon {
  transform: rotateZ(90deg) scaleY(1.5);
}
.tree-pro .title-bar {
  display: flex;
  position: relative;
  cursor: pointer;
}
.tree-pro .title-bar:hover {
  background: rgba(0, 0, 0, 0.07);
}
.tree-pro .title-bar.active {
  background: rgba(0, 0, 0, 0.2);
}
.tree-pro .title-bar .switcher, .tree-pro .title-bar .title {
  display: flex;
  align-items: center;
  height: var(--height);
  line-height: 1;
}
.tree-pro .title-bar .switcher {
  width: var(--height);
  display: flex;
  justify-content: center;
}
.tree-pro .title-bar .switcher.hidden {
  visibility: hidden;
  pointer-events: none;
}
.tree-pro .title-bar .icon {
  transform: scaleY(1.2) translateY(-1px);
  pointer-events: none;
}
.tree-pro .title-bar .title {
  flex: 1 0 20px;
}
.tree-pro .title-bar .title .text {
  width: 20px;
  min-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
ol, ul {
  padding: 0;
	list-style: none;
  margin-block-start: 0;
  margin-block-end: 0;
}
i {
  font-style: normal;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: #f2f5f4;
}
::-webkit-scrollbar-thumb {
  background-color: #d6dfdd;
}
::-webkit-scrollbar-thumb:hover{
    background-color: #b1b9b7;
}
::-webkit-scrollbar-track {
    background-color: #f2f5f4;
}
</style>
