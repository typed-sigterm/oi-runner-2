<!-- https://tobiasahlin.com/spinkit/ -->

<template>
  <div class="spinner">
    <div class="rect1" />
    <div class="rect2" />
    <div class="rect3" />
    <div class="rect4" />
    <div class="rect5" />
    <slot />
  </div>
</template>

<style scoped>
.spinner {
  width: 50px;
  height: 40px;
  text-align: center;
  color: var(--vscode-descriptionForeground);
}

.spinner > div {
  background-color: #333;
  height: var(--spinner-size);
  width: 6px;
  display: inline-block;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  animation-delay: -1.1s;
}

.spinner .rect3 {
  animation-delay: -1.0s;
}

.spinner .rect4 {
  animation-delay: -0.9s;
}

.spinner .rect5 {
  animation-delay: -0.8s;
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }  20% {
    transform: scaleY(1.0);
  }
}
</style>
