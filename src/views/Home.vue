<template>
  <div class="home">
    <img
      alt="Vue logo"
      src="../assets/logo.png"
    >
    <h1>Strona domowa</h1>
    <router-link to="/board/123456">
      Example board link
    </router-link>
  </div>
</template>

<script>
// @ is an alias to /src

  export default {
    name: 'Home',
    components: {
    },
  };
</script>
