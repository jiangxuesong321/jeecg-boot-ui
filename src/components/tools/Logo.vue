<template>
  <div class="logo">
    <router-link :to="routerLinkTo">

      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo颜色根据主题颜色变化 -->
      <!-- <img v-if="navTheme === 'dark'" src="~@/assets/logo-white.png" alt="logo"> -->
      <img src="~@/assets/login_images/luomu.png" alt="logo" >
      <img src="~@/assets/login_images/login2.png" alt="logo" style="display: block;height:30px">
      
      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo颜色根据主题颜色变化 -->

      <!-- <h1 v-if="showTitle">{{ title }}</h1> -->
    </router-link>
  </div>
</template>

<script>
  import { mixin } from '@/utils/mixin.js'

  export default {
    name: 'Logo',
    mixins: [mixin],
    props: {
      title: {
        type: String,
        default: '',
        required: false
      },
      showTitle: {
        type: Boolean,
        default: true,
        required: false
      },
      // 点击Logo跳转地址
      routerLinkTo: {
        type: Object,
        default: () => ({name: 'dashboard'}),
      },
    }
  }
</script>
<style lang="less" scoped>
  /*缩小首页布 局顶部的高度*/
  @height: 75px;

  .sider {
    box-shadow: none !important;
    .logo {
      height: @height !important;
      line-height: 40px !important;
      box-shadow: none !important;
      transition: background 250ms;

      a {
        color: white;
        &:hover {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    &.light .logo {
      background-color: @primary-color;
    }
  }
</style>