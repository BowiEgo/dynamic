<template>
  <div class="paragraph">
    <div class="dot"></div>
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'Paragraph',
  props: {
    text: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="less" scoped>
/* prettier-ignore */
.paragraph {
  position: relative;
  display: inline-block;
  font-family: PingFangSC-Regular;
  text-align: justify;
  padding-bottom: 15px;
  margin-bottom: 15px;
  font-size: 16px;
  color: #323232;
  letter-spacing: 0;
  text-align: justify;
  line-height: 27px;
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 1PX;
    position: absolute;
    bottom: 0;
    background-color: #f2f2f5;
  }
  &:last-child {
    padding-bottom: 0;
    margin-bottom: 0;
    &::after {
      display: none;
    }
  }
  .dot {
    display: inline-block;
    margin-right: 5px;
    box-sizing: border-box;
    width: 15PX;
    height: 15PX;
    border: #198cff 4PX solid;
    border-radius: 50%;
    // transform: translateY(2px);
  }
}
</style>
