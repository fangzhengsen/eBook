<template>
  <div>
    <transition name="slide-up">
      <div class="menu-wrapper" :class="{'hide-box-shadow': !menuVisible || settingVisible >= 0}" v-show="menuVisible">
        <div class="icon-wrapper">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-A" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <Ebook-header></Ebook-header>
    <Ebook-setting-font></Ebook-setting-font>
    <Ebook-setting-font-popup></Ebook-setting-font-popup>
    <Ebook-setting-theme></Ebook-setting-theme>
    <Ebook-setting-progress></Ebook-setting-progress>
    <Ebook-slide></Ebook-slide>
    <Ebook-footer></Ebook-footer>
  </div>
</template>

<script>
import {ebookMixin} from '../../utils/mixin'
import EbookSettingFont from "./EbookSettingFont";
import EbookSettingFontPopup from "./EbookSettingFontPopup";
import EbookSettingTheme from "./EbookSettingTheme";
import EbookSettingProgress from "./EbookSettingProgress";
import EbookSlide from "./EbookSlide";
import EbookHeader from "./EbookHeader";
import EbookFooter from "./EbookFooter";
  export default {
    mixins:[ebookMixin],
    components:{
      EbookSettingFont,
      EbookSettingFontPopup,
      EbookSettingTheme,
      EbookSettingProgress,
      EbookSlide,
      EbookHeader,
      EbookFooter
    },
    methods: {
      showSetting(key) {
        this.setSettingVisible(key)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 200;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    font-size: px2rem(20);
    &.hide-box-shadow {
      box-shadow: none;
    }
    .icon-wrapper {
      flex: 1;
      @include center;
      .icon-progress {
        font-size: px2rem(24);
      }
      .icon-bright {
        font-size: px2rem(22);
      }
    }
  }
</style>
