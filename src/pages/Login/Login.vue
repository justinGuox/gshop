<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class={on:this.onlogin.phoneLogin} @click="onLogin('phone')">短信登录</a>
          <a href="javascript:;" :class={on:this.onlogin.pwdLogin} @click="onLogin('pwd')">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form @submit.prevent="login">
          <div :class={on:this.onlogin.phoneLogin}>
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button :disabled="!rightPhone" class="get_verification" :class={right_phone:rightPhone} @click.prevent="getCode">
                {{computeTime > 0 ? `已发送 ${computeTime} s` : '获取验证码'}}
              </button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class={on:this.onlogin.pwdLogin}>
            <section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input type="text" maxlength="8" placeholder="密码" v-if="showPwd" v-model="pwd">
                <input type="password" maxlength="8" placeholder="密码" v-else v-model="pwd">
                <div class="switch_button" :class="showPwd ? 'on' : 'off'" @click="showPwd=!showPwd">
                  <div class="switch_circle" :class={right:showPwd}></div>
                  <span class="switch_text">{{showPwd ? 'abc' : '...'}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha" @click="getCaptcha" ref="captcha">
              </section>
            </section>
          </div>
          <button class="login_submit">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-icon-jiantou2"></i>
      </a>
    </div>
    <AlertTip :alertText="alertText" v-show="showAlert" @closeTip="closeTip"/>
  </section>
</template>

<script>
import AlertTip from '../../components/AlertTip/AlertTip'
import {reqPwdLogin, reqSendCode, reqSmsLogin} from '../../api'
export default {
  data () {
    return {
      onlogin: {
        pwdLogin: true,
        phoneLogin: false
      },
      phone: '', // 手机号
      computeTime: 0, // 计时器
      showPwd: false, // 是否显示密码
      pwd: '', // 密码
      name: '', // 用户名
      code: '', // 短信验证码
      captcha: '', // 图片验证码
      alertText: '', // 提示文本
      showAlert: false // 是否显示提示框
    }
  },
  computed: {
    rightPhone () {
      return /^1[3456789]\d{9}$/.test(this.phone)
    }
  },
  methods: {
    onLogin (el) {
      if (el === 'pwd') {
        this.onlogin.pwdLogin = true
        this.onlogin.phoneLogin = false
      } else {
        this.onlogin.pwdLogin = false
        this.onlogin.phoneLogin = true
      }
    },
    // 异步获取短信验证码
    async getCode () {
      // 如果当前没有计时才开启计时器
      if (!this.computeTime) {
        // 启动倒计时
        this.computeTime = 30
        this.internalId = setInterval(() => {
          if (this.computeTime <= 0) {
            clearInterval(this.internalId)
          }
          this.computeTime--
        }, 1000)
        // 发送ajax请求（向指定手机发送验证码）
        const result = await reqSendCode(this.phone)
        if (result.code === 1) {
          // 停止定时器
          this.showAlertM(result.msg)
          if (this.computeTime) {
            this.computeTime = 0
            clearInterval(this.internalId)
            this.internalId = undefined
          }
        }
      }
    },
    showAlertM (msg) {
      this.alertText = msg
      this.showAlert = true
    },
    // 关闭警告框
    closeTip () {
      this.alertText = ''
      this.showAlert = false
    },
    // 异步登录
    async login () {
      let result
      // 前台表单验证
      if (this.onlogin.pwdLogin) {
        const {name, pwd, captcha} = this
        if (!name) {
          // 必须指定用户名
          this.showAlertM('用户名未输入')
          return
        } else if (!pwd) {
          // 必须指定密码
          this.showAlertM('密码未输入')
          return
        } else if (!captcha) {
          // 必须指定验证码
          this.showAlertM('验证码未输入')
          return
        }
        // 发送ajax请求密码登陆
        result = await reqPwdLogin({name, pwd, captcha})
      } else {
        const {phone, code} = this
        if (!this.rightPhone) {
          // 手机号不正确
          this.showAlertM('手机号不正确')
          return
        } else if (!/^\d{6}$/.test(code)) {
          // 验证码必须是6位数字
          this.showAlertM('验证码必须是6位数')
          return
        }
        // 发送ajax请求短信登陆
        result = await reqSmsLogin(phone, code)
      }

      // 停止定时器
      if (this.computeTime) {
        this.computeTime = 0
        clearInterval(this.internalId)
        this.internalId = undefined
      }

      // 根据结果处理数据
      if (result.code === 0) {
        const user = result.data
        // 将user保存到vuex的state
        await this.$store.dispatch('recordUser', user)
        // 跳转去个人中心界面
        await this.$router.replace('/profile')
      } else {
        // 显示新的图片验证码
        this.getCaptcha()
        const msg = result.msg
        // 显示警告提示
        this.showAlertM(msg)
      }
    },
    // 获取一个新的图片验证码
    getCaptcha () {
      // 因为src每次需要改变地址才能发起请求，所以后面加一个实时时间
      this.$refs.captcha.src = 'http://localhost:4000/captcha/?time=' + Date.now()
    }
  },
  components: {
    AlertTip
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(30px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
