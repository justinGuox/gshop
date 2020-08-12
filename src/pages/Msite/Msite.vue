<template>
  <section class="msite">
    <!--首页头部-->
    <HeaderTop :title="address.name">
      <router-link class="header_search" slot="left" to="/search">
        <i class="iconfont icon-sousuo"></i>
      </router-link>
      <span class="header_login" slot="right">
        <router-link class="header_login_text" :to="userInfo._id ? '/userinfo' : '/login'" v-if="!userInfo.phone">{{userInfo.name || '登录|注册'}}
        </router-link>
        <router-link class="header_login_text" v-else>{{userInfo.phone || '登录|注册'}}
        </router-link>
      </span>
    </HeaderTop>
    <!--首页导航-->
    <nav class="msite_nav">
      <div class="swiper-container" v-if="categorys.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(categorys, index) in categorysArr" :key="index">
            <a href="javascript:" class="link_to_food" v-for="(category, index) in categorys" :key="index">
              <div class="food_container">
                <img :src="baseImageUrl+category.image_url"/>
              </div>
              <span>{{category.title}}</span>
            </a>
          </div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>
      </div>
      <img src="./images/msite_back.svg" alt="back" v-else>
    </nav>
    <!--首页附近商家-->
    <div class="msite_shop_list">
      <div class="shop_header">
        <i class="iconfont icon-xuanxiang"></i>
        <span class="shop_header_title">附近商家</span>
      </div>
      <ShopList />
    </div>
  </section>
</template>

<script>
import {mapState} from 'vuex'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'

import HeaderTop from '../../components/HeaderTop/HeaderTop'
import ShopList from '../../components/ShopList/ShopList'
export default {
  data () {
    return {
      baseImageUrl: 'http://fuss10.elemecdn.com/'
    }
  },
  computed: {
    ...mapState(['address', 'categorys', 'userInfo']),

    // 根据categorys这个一维数组生成一个二维数组
    // 小数组中的元素个数最大是8
    categorysArr () {
      const {categorys} = this
      // 准备一个空的2维数组
      const array = []
      let minArr = []
      // 遍历categorys
      categorys.forEach(category => {
        if (minArr.length === 8) {
          minArr = []
        }
        if (minArr.length === 0) {
          array.push(minArr)
        }
        minArr.push(category)
      })
      return array
    }
  },
  watch: {
    categorys (newValue) { // 监视categorys，如果发生变化则执行下列方法
      // 界面更新就立即创建Swiper对象
      this.$nextTick(() => {
        // 创建一个Swuper实例对象,实现轮播
        // eslint-disable-next-line no-new
        new Swiper('.swiper-container', {
          loop: true, // 循环模式选项
          // 如果需要分页器
          pagination: {
            el: '.swiper-pagination'
          }
        })
      })
    }
  },
  mounted () {
    this.$store.dispatch('getCategorys')
    this.$store.dispatch('getShops')
  },
  components: {
    HeaderTop,
    ShopList
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixins.styl"
  .msite  //首页
    width 100%
    .msite_nav
      bottom-border-1px(#e4e4e4)
      margin-top 45px
      height 200px
      background #fff
      .swiper-container
        width 100%
        height 100%
        .swiper-wrapper
          width 100%
          height 100%
          .swiper-slide
            display flex
            justify-content center
            align-items flex-start
            flex-wrap wrap
            .link_to_food
              width 25%
              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0
                img
                  display inline-block
                  width 50px
                  height 50px
              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666
        .swiper-pagination
          >span.swiper-pagination-bullet-active
            background #02a774
    .msite_shop_list
      top-border-1px(#e4e4e4)
      margin-top 10px
      background #fff
      .shop_header
        padding 10px 10px 0
        .shop_icon
          margin-left 5px
          color #999
        .shop_header_title
          color #999
          font-size 14px
          line-height 20px
</style>
