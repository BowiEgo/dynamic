<template>
  <div class="advisor" v-if="!!staffId">
    <div class="advisor__avatar">
      <img :src="picture" alt="" />
    </div>
    <div class="advisor__brief">
      <div class="advisor__name">
        <div>{{ monicker }}</div>
        <span>执业编号 {{ serial }}</span>
      </div>
      <div class="advisor__job">{{ jobcname }}</div>
      <div class="advisor__company">{{ depcname }}</div>
    </div>
    <div class="advisor__action">
      <!-- <a :href="tel" class="advisor__phone">电话</a> -->
      <!-- <div class="advisor__shop">小店</div> -->
    </div>
  </div>
</template>

<script>
import { createNamespace } from '../utils/create'

const [name, bem] = createNamespace('Advisor')

export default {
  name: name,
  props: {
    staffId: {
      type: String,
      default: '',
    },
    monicker: {
      type: String,
      default: '--',
    },
    picture: {
      type: String,
      default: '',
    },
    serial: {
      type: String,
      default: 'XX',
    },
    telephone: {
      type: String,
      default: '--',
    },
    depcname: {
      type: String,
      default: '--',
    },
    jobcname: {
      type: String,
      default: '',
    },
  },
  computed: {
    tel() {
      return 'tel:' + this.telephone.toString()
    },
  },
  created() {
    console.log(bem('Advisor'))
  },
}
</script>

<style lang="less" scoped>
.advisor {
  display: flex;
  height: 75px;
  background-color: #fff;
  padding: 15.5px 0 15.5px 15px;
  box-sizing: border-box;
  box-shadow: 0 5px 5px 0 rgba(221, 221, 221, 0.4);
  &__avatar {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    overflow: hidden;
    border: none;
    background-color: #eee;
    img {
      width: 100%;
      height: 100%;
    }
  }
  &__brief {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    font-family: PingFangSC-Regular;
    width: 71%;
    padding-left: 15px;
  }
  &__name {
    display: flex;
    flex-direction: row;
    align-items: center;
    line-height: 16px;
    margin-bottom: 2px;
    div {
      display: inline-block;
      font-family: PingFangSC-Medium;
      font-size: 15px;
      color: #222;
      letter-spacing: 0;
      padding: 0;
      margin-right: 5px;
    }
    span {
      display: inline-block;
      font-size: 10px;
      color: #999;
      letter-spacing: 0;
      background-color: rgba(241, 244, 249, 0.8);
      border-radius: 0.5px;
      padding: 0 4.5px;
      box-sizing: border-box;
    }
  }
  &__company,
  &__job {
    font-family: PingFangSC-Regular;
    font-size: 11px;
    color: #999;
    letter-spacing: 0;
    line-height: 15px;
  }
  &__action {
    display: flex;
  }
  &__phone,
  &__shop {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 44px;
    height: 100%;
    font-family: PingFangSC-Regular;
    font-size: 11px;
    color: #999;
    letter-spacing: 0;
    &::before {
      content: '';
      display: block;
      width: 15px;
      height: 15px;
      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url('../assets/images/1@2x.png');
      transform: translateY(4px);
    }
  }
  &__phone {
    &::before {
      background-image: url('../assets/images/phone@2x.png');
    }
  }
}
</style>
