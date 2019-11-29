<template>
  <ul>
    <li v-for="item in data" :key="item.key" :class="{ open: isOpen(item.key) }">
      <span :class="['title-bar', { active: isActive(item.key) }]" :data-key="item.key" :style="titleBarStyle">
        <span :class="['switcher', { hidden: isEmptyArray(item.children) }]" @click="onSwitch(item.key)">
          <i class="icon">&gt;</i>
        </span>
        <span class="title">
          <span class="text">{{ item.title }}</span>
        </span>
      </span>
      <tree v-if="!isEmptyArray(item.children)" :data="item.children" :level="level + 1" />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Tree',
  props: {
    data: Array,
    iconSize: { type: Number, default: 24 },
    level: { type: Number, default: 0 },
    padding: { type: Number, default: 10 }
  },
  inject: ['onSwitch', 'isOpen', 'isActive'],
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
  }
}
</script>
