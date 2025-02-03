<!---------------------------------------------------------------->
<template>
  <div id="mainbody">
    <header>
      <nav>
        <!-- as a list if any possible menu in the future -->
        <ol>
          <li class="logo">
            <img src="@/assets/logo.png" height="48" alt="Logo CargoPlot" />
          </li>
        </ol>
      </nav>
    </header>

    <div id="main">
      <CargoAdd></CargoAdd>
      <CargoList></CargoList>
    </div>
  </div>
</template>

<!---------------------------------------------------------------->
<script setup lang="ts">
import CargoAdd from "@/components/CargoAdd.vue";
import CargoList from "@/components/CargoList.vue";
</script>

<!---------------------------------------------------------------->
<style scoped>
#mainbody {
  padding: 1.5rem;
  max-width: 1280px;
  margin: 0 auto;
}

#main {
  padding: 2rem 0;
}

ol {
  display: flex;
  align-items: center;
  list-style-type: none;
  padding: 0;
}
</style>
