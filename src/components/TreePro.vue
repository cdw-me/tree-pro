<template>
  <div :class="['tree-pro', { doing: !!doingKey }]">
    <div class="container" @click="onClick" @contextmenu="onContextmenu">
      <tree :data="data" />
    </div>
    <contextmenu @ref="onRef" :menus="menus" @click="onContextmenuClick" />
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
      isActive: this.isActive,
      isEdit: this.isEdit,
      isDoing: this.isDoing,
      doEdit: this.doEdit
    }
  },
  data() {
    return {
      activeKey: '',
      menuKey: '',
      editKey: '',
      doingKey: ''
    };
  },
  computed: {
    menus: function() {
      const menus = [{ key: 'add', title: '添加'}];
      if (this.menuKey) {
        menus.splice(1, 0, 
          { key: 'reanme', title: '重命名' },
          { key: 'delete', title: '删除' }
        );
      }
      return menus;
    }
  },
  created: function() {
    this.treeMap = {};
  },
  methods: {
    onRef: function(ref) {
      this.contextmenu = ref;
    },
    setTreeMap: function(key, item, parentKey) {
      if (typeof this.treeMap[key] === 'undefined') {
        item.parentKey = parentKey;
        this.$set(item, 'open', this.openAll);
        this.treeMap[key] = item;
      }
    },
    onSwitch: function(key) {
      this.treeMap[key].open = !this.treeMap[key].open;
    },
    isOpen: function(key, item, parentKey) {
      this.setTreeMap(key, item, parentKey);
      return item.open;
    },
    isActive: function(key) {
      return this.activeKey === key;
    },
    isEdit: function(key) {
      return this.editKey === key;
    },
    isDoing: function(key) {
      return this.doingKey === key;
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
    },
    onContextmenuClick: function(menu) {
      console.log('menu', menu);
      switch(menu.key) {
        case 'add':
          this.onAdd();
          break;
        case 'reanme':
          this.onRename();
          break;
        case 'delete':
          this.onDelete();
          break;
      }
    },
    onAdd: function() {
      const key = this.menuKey;
      this.addNum = this.addNum || 0;
      ++this.addNum;
      const item = {
        key: '_new_' + this.addNum,
        title: '',
        children: [],
        parentKey: key,
        open: this.openAll
      }

      this.editKey = item.key;

      if (!key) {
        this.data.push(item);
        return ;
      }

      if (typeof this.treeMap[key].children === 'undefined') {
        this.$set(this.treeMap[key], 'children', [item]);
      } else {
        this.treeMap[key].children.push(item);
      }
      this.treeMap[key].open = true;
    },
    onRename: function() {
      const key = this.menuKey;
      this.editKey = key;
    },
    onDelete: function() {
      const key = this.menuKey;
      this.doingKey = key;
      const _this = this;
      const data = { key };
      this.$emit('onDelete', data, function(res) {
        _this.doingKey = '';
        if (res) {
          const item = _this.treeMap[key];
          const parentKey = item.parentKey;
          const i = _this.treeMap[parentKey].children.indexOf(item);
          _this.treeMap[parentKey].children.splice(i, 1);
        }
      });
    },
    doEdit: function($event, item) {
      const value = $event.target.value;
      const isAdd = /^_new_\d+/.test(item.key);
      console.log(value, item);
      if (!value) {
        this.editKey = '';
        if (isAdd) {
          const parentKey = item.parentKey;
          const i = this.treeMap[parentKey].children.indexOf(item);
          this.treeMap[parentKey].children.splice(i, 1);
        }
        return ;
      }

      if (value === item.title) {
        this.editKey = '';
        return ;
      }

      this.doingKey = item.key;
      const data = { title: value };
      const _this = this;
      if (!isAdd) {
        data.key = item.key;
      }
      this.$emit('onEdit', data, function(res, data) {
        _this.doingKey = '';
        if (res) {
          _this.editKey = '';
          item.key = data.key;
          item.title = value;
        } else {
          $event.target.focus();
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
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
.tree-pro.doing {
  pointer-events: none;
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
.tree-pro li.open > .title-bar .switcher .icon {
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
.tree-pro .title-bar .switcher,
.tree-pro .title-bar .title,
.tree-pro .title-bar .text,
.tree-pro .title-bar .edit {
  display: flex;
  align-items: center;
  height: var(--height);
  line-height: 1;
}
.tree-pro .title-bar .text,
.tree-pro .title-bar .edit {
  flex: 1 0 auto;
}
.tree-pro .title-bar .loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--height);
  height: var(--height);
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
.tree-pro .title-bar .switcher .icon {
  transform: scaleY(1.2) translateY(-1px);
  pointer-events: none;
}
.tree-pro .title-bar .title {
  flex: 1 0 20px;
}
.tree-pro .title-bar .title .text > span {
  width: 20px;
  min-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tree-pro .title-bar .edit input {
  flex: 1 1 auto;
  width: 10px;
  height: 100%;
  outline: none;
}
.tree-pro .title-bar .edit input:not(:focus) {
  border: 0;
  background: transparent;
}
.tree-pro .title-bar .loading .icon {
  position: relative;
  display: inline-block;
  width: 24px;
  height: 24px;
  animation: rotate 1s linear infinite;
}
.tree-pro .title-bar .loading .icon .line {
  position: absolute;
  width: 2px;
  height: 15%;
  bottom: 50%;
  left: 50%;
  margin-left: -1px;
  background: rgba(0, 0, 0, 0.8);
  transform-origin: center bottom;
}
@num: 8;
.loop(@i) when (@i <= @num) {
    .loop(@i + 1);
    .tree-pro .title-bar .loading .icon .line:nth-child(@{i}) {
      opacity: @i / @num;
      transform: rotateZ((360deg / @num) * (@i - 1)) translateY(-150%) scaleX(0.5);
    }
}
.loop(1);
@keyframes rotate {
  to { transform: rotateZ(360deg) }
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
