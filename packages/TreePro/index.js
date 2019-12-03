import TreePro from './src/TreePro.vue'
 
// 为组件提供 install 安装方法，供按需引入
TreePro.install = function (Vue) {
  Vue.component(TreePro.name, TreePro)
}

// 默认导出组件
export default TreePro
