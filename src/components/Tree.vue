<template>
  <ul>
    <li v-for="item in data" :key="item.key" :class="{ open: isOpen(item.key, item, parentKey) }">
      <span :class="['title-bar', { active: isActive(item.key) }]" :data-key="item.key" :style="titleBarStyle">
        <span :class="['switcher', { hidden: isEmptyArray(item.children) }]" @click="onSwitch(item.key)">
          <i class="icon">&gt;</i>
        </span>
        <span class="title">
          <span class="text" v-if="!isEdit(item.key)" :title="item.title"><span>{{ item.title }}</span></span>
          <span class="edit" v-else>
            <input v-once :value="item.title" v-focus autofocus @blur="doEdit($event, item)" />
          </span>
          <span class="loading" v-if="isDoing(item.key)">
            <i class="icon">
              <span class="line" v-for="(item, i) in Array(8)" :key="i"></span>
            </i>
          </span>
        </span>
      </span>
      <tree v-if="!isEmptyArray(item.children)" :parentKey="item.key" :data="item.children" :level="level + 1" />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Tree',
  props: {
    parentKey: { default: '' },
    data: Array,
    iconSize: { type: Number, default: 24 },
    level: { type: Number, default: 0 },
    padding: { type: Number, default: 10 }
  },
  inject: ['onSwitch', 'isOpen', 'isActive', 'isEdit', 'isDoing', 'doEdit'],
  computed: {
    titleBarStyle: function() {
      return {
        paddingRight: this.padding + 'px',
        paddingLeft: (this.padding + this.iconSize * this.level) + 'px'
      };
    }
  },
  methods: {
    isEmptyArray: function(array) {
      return !array || array.length === 0;
    }
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus()
      }
    }
  }
}
</script>
