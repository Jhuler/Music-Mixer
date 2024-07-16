<template>
<main>
    <section>
        <div>
            <input type="search" v-model="inputBuscar" @input="search()">

            <span>{{list.length}}</span>
        </div>
        <ul>
            <li v-if="inputBuscar == ''" v-for="a in list" :key="a.id" @click="play(a.name)" :class="{playing: !a.paused}">
                <p class="suspensivos">{{a.name}}</p>
                <div v-if="!a.paused">
                    <i @click.stop="stop(a.name)" class="fa-solid fa-stop"></i>
                </div>
            </li>
            <li v-else v-for="a in list1" :key="a.id" @click="play(a.name)" :class="{playing: !a.paused}">
                <p class="suspensivos">{{a.name}}</p>
                <div v-if="!a.paused">
                    <i @click.stop="stop(a.name)" class="fa-solid fa-stop"></i>
                </div>
            </li>
        </ul>
    </section>
</main>
</template>

<script>
export default {
    data: () => ({
        list: [],
        list1: [],
        inputBuscar: '',
    }),
    created(){
        this.cargarLista()
    },
    methods: {
        cargarLista(){
            const ruta = '@/assets/sounds'
            // /\.mp3$/
            const audioContext = require.context('@/assets/sounds', false, /\.(mp3|wav|ogg|aac|m4a|flac|wma|aiff|alac|pcm|mid)$/)
            // console.log(audioContext.keys())
            this.list = audioContext.keys().map((key) => {
                const extencion = '.' + key.split('.').pop()
                // const name = key.replace('./', '').replace('.mp3','')
                const name = key.split('/').pop().replace(/\.[^/.]+$/, '')
                const src = require('@/assets/sounds/' + name + '.mp3')
                const audio = new Audio()

                audio.src = src
                audio.load()

                return {
                    name,
                    src,
                    audio,
                    paused: audio.paused,
                }
            })
        },
        play(name){
            const item = this.list.find(a => a.name == name)
            item.audio.currentTime = 0
            item.audio.play()

            item.paused = item.audio.paused

            item.audio.onended = () => {
                item.paused = item.audio.paused
            }
        },
        stop(name){
            const item = this.list.find(a => a.name == name)
            item.audio.pause()
            item.audio.currentTime = 0
            item.paused = item.audio.paused
        },
        search(){
            this.list1 = this.list.filter(a => a.name.toLowerCase().includes(this.inputBuscar.toLowerCase()))
        }
    }
}
</script>

<style lang="scss" scoped>
main{
    section:nth-child(1){
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-flow: column;
        gap: 1rem;

        div{
            display: flex;
            justify-content: space-between;
            align-content: center;
            gap: 1rem;

            span{
                font-size: 2rem;
            }
        }

        ul{
            height: 100%;
            overflow-y: auto;
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            grid-auto-rows: 6rem;
            grid-gap: 0.5rem;

            li{
                padding: 0.3rem;
                border-radius: 0.4rem;
                background-color: var(--clr6);
                cursor: pointer;
                overflow: hidden;
                display: flex;
                flex-flow: column;
                justify-content: center;
                align-items: center;
                gap: 0.5rem;

                &:hover{
                    p{
                        opacity: 1;
                    }
                }

                p{
                    text-align: center;
                    height: 2rem;
                    opacity: 0.5;
                }

                div{
                    display: flex;
                    justify-content: center;
                }
            }

            .playing{
                background-color: var(--clr4) !important;

                p{
                    opacity: 1;
                }
            }
        }
    }
}
</style>