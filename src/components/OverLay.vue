<!---------------------------------------------------------------->
<template>
  <!-- could use <dialog> here instead, depending on the required browser compatibility depth -->
  <div
    id="overlay-container"
    :class="props.visible ? 'visible' : 'invisible'"
    style="z-index: 1333"
  >
    <div id="overlay"></div>
    <slot></slot>
  </div>
</template>

<!---------------------------------------------------------------->
<script setup lang="ts">
const props = defineProps({
  visible: Boolean
});
</script>

<!---------------------------------------------------------------->
<style scoped>
#overlay-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

#overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: black;
  opacity: 0.6;
}

.visible {
  visibility: visible;
}

.invisible {
  visibility: hidden;
}
</style>
