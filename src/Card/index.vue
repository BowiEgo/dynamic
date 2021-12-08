<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {},
}
</script>

<style scoped>
.card {
  background: #ffffff;
  box-shadow: 0 0 12px 0 #e6e6e6;
  border-radius: 4px;
  border-radius: 4px;
  padding: 18px 15px;
  margin-bottom: 15px;
}
</style>
