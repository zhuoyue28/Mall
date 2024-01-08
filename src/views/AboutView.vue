<template>
  <div class="about">
    <div class=" text-[red]">
      <h1>This is an about page</h1>
      <Button type="link">组件按钮</Button>
      <a-page-header style="border: 1px solid rgb(235, 237, 240)" title="Title" sub-title="This is a subtitle"
        @back="() => null" />
    </div>
  </div>
</template>

<script lang="ts" setup>


</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
