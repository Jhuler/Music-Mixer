<template>
  <picks/>
  <player/>
</template>

<script>
import picks from '@/views/picks.vue'
import player from '@/views/player.vue'

export default {
  components: {picks, player},
  name: 'App',
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');

*{
  font-family: 'Josefin Sans', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  border: none;
  outline: none;
  font-size: 14px;
  color: white;
}

body{
  width: 100vw;
  height: 1000vh;
  overflow: hidden;
}

#app{
  display: grid;
  grid-template-columns: 2fr 1fr;
  background-color: black;
  padding: 0.5rem;
}

::-webkit-scrollbar{
  height: 0.3rem;
  width: 0.3rem;
  // background-color: var(--clr6);
}

::-webkit-scrollbar-thumb{
  // border: solid 0.2rem var(--clr6);
}

::-webkit-scrollbar-thumb{
  background-color: var(--hover);
  border-radius: 0.15rem;
}

:root{
  --clr1: #E63C43;
  --clr2: #FF7351;
  --clr3: #FFD173;
  --clr4: #1ED760;
  --clr5: #121212;
  --clr6: #191919;
  --hover: rgba(254, 254, 254, 0.1);
  --hover: rgb(78, 78, 78)
}

ul{
  padding: 0;
  margin: 0;
}

li{
  list-style: none;
}

a{
    text-decoration: none;
}

main{
  height: calc(100vh - 1rem);
  background-color: var(--clr5);
  border-radius: 0.7rem;
  padding: 1rem;
}

input[type=search]{
  height: 2rem;
  border-radius: 1rem;
  color: black;
  padding: 0.1rem 0.8rem;
  // width: 100%;
}

.noClick{
  pointer-events: none;
  opacity: 0.5;
}

.suspensivos{
  // white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>