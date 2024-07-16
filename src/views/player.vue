<template>
<main>
    <section :class="{noClick: playList[i].t2 == '00:00'}">
    <!-- <section> -->
        <article>
            <div>
                <h1 class="suspensivos">{{playList[i].name}}</h1>

                <!-- <div v-if="playList.length>1" @click="changeMode()"> -->
                <div @click="changeMode()">
                    <span v-if="mode">Tools</span>
                    <span v-else>Player</span>
                </div>
            </div>

            <div>
                <input type="range" min="0" max="100" class="range" @change="seekTo()" v-model="playList[i].currentTime">
                <div>
                    <span>{{playList[i].t1}}</span>
                    <span>{{playList[i].t2}}</span>
                </div>
            </div>

            <div>
                <i class="fa-solid fa-volume-low"></i>
                <input type="range" min="0" max="100" class="range" @change="setVolume()" v-model="volume">
                <i class="fa-solid fa-volume-high"></i>
            </div>
        </article>

        <article id="player" v-if="mode">
            <i @click="isRandom = !isRandom, randoms = []" class="fa-solid fa-shuffle" :class="{active: isRandom}"></i>
            <i @click="prevTrack()" class="fa-solid fa-backward-step"></i>
            <i @click="play(i)" v-if="playList[i].paused" class="fa-solid fa-circle-play"></i>
            <i @click="pause()" v-else class="fa-solid fa-circle-pause"></i>
            <i @click="nextTrack()" class="fa-solid fa-forward-step"></i>
            <i @click="isRepeat = !isRepeat" class="fa-solid fa-repeat" :class="{active: isRepeat}"></i>
        </article>

        <article id="tools" v-else>
            <div>
                <h2>LOOP</h2>
                <ul>
                    <li @click="setLoop(1)">
                        <span>IN</span>
                        <span>{{playList[i].loop.tin}}</span>
                    </li>
                    <li @click="setLoop(2)">
                        <span>OUT</span>
                        <span>{{playList[i].loop.tout}}</span>
                    </li>
                </ul>
            </div>

            <div>
                <h2>CUES</h2>
                <ul>
                    <li v-for="(a,x) in playList[i].cues" :key="a.id" @click="setCue(x)">
                        <span>{{a.t}}</span>
                        <i v-if="a.v > 0" @click.stop="removeCue(x)" class="fa-solid fa-xmark"></i>
                    </li>
                </ul>
            </div>
            
            <div>
                <h2>TEMPO</h2>
                <li>
                    <input type="range" min="0" max="200" class="range" v-model="playList[i].velocidad" @change="setRate()">
                    <span @click="defRate()">x{{playList[i].velocidad/100}}</span>
                </li>
            </div>
        </article>
    </section>

    <section>
        <article>
            <input type="search" v-model="inputBuscar" @input="search()">
            <div>
                <span>{{playList.filter(a => a.t2 != '00:00').length}}</span>
                <i v-if="orden" class="fa-solid fa-arrow-down-a-z" @click="ordenar(1)"></i>
                <i v-else class="fa-solid fa-arrow-up-z-a" @click="ordenar(2)"></i>
                <i class="fa-regular fa-folder-open" @click="openChargeFile('loadAudios')">
                    <input type="file" id="loadAudios" accept="audio/*" @change="cargarLista" multiple hidden>
                </i>
            </div>
        </article>

        <ul v-if="inputBuscar == ''">
            <li v-for="a in playList" :key="a.id" @click="loadTrack(a.i)" v-if="!vacio"
            :class="{playing: mode && a.i == i || !mode && !a.paused}">
                <div>
                    <span>{{a.i + 1}}</span>
                    <p>{{a.name}}</p>
                </div>
                <div v-if="mode==0">
                    <i @click="mute(a.i,true)" v-if="a.volume > 0" class="fa-solid fa-volume-high"></i>
                    <i @click="mute(a.i,false)" v-else class="fa-solid fa-volume-xmark"></i>
                    <i @click.stop="play(a.i)" v-if="a.paused" class="fa-regular fa-circle-play"></i>
                    <i @click.stop="pause(a.i)" v-else class="fa-regular fa-circle-pause"></i>
                    <i @click.stop="stop(a.i)" class="fa-solid fa-stop"></i>
                </div>
            </li>
        </ul>

        <ul v-else>
            <li v-for="a in playList1" :key="a.id" @click="loadTrack(a.i)" v-if="!vacio"
            :class="{playing: mode && a.i == i || !mode && !a.paused}">
                <div>
                    <span>{{a.i + 1}}</span>
                    <p>{{a.name}}</p>
                </div>
                <div v-if="mode==0">
                    <i @click="mute(a.i,true)" v-if="a.volume > 0" class="fa-solid fa-volume-high"></i>
                    <i @click="mute(a.i,false)" v-else class="fa-solid fa-volume-xmark"></i>
                    <i @click.stop="play(a.i)" v-if="a.paused" class="fa-regular fa-circle-play"></i>
                    <i @click.stop="pause(a.i)" v-else class="fa-regular fa-circle-pause"></i>
                    <i @click.stop="stop(a.i)" class="fa-solid fa-stop"></i>
                </div>
            </li>
        </ul>
    </section>
</main>
</template>

<script>
import {generarId, openChargeFile, Sound} from '@/store/util.js'

export default {
    setup(){
        return{
            openChargeFile
        }
    },
    data: () => ({
        mode: false,
        vacio: true,
        
        i: 0,
        audio: new Audio(),
        
        volume: 100,
        isPlaying: false,
        isRandom: false,
        randoms: [],
        isRepeat: false,
        update: null,


        loop: null,


        inputBuscar: '',
        orden: true,
        playList: [
            {
                name:'Nombre',
                t1: '00:00',
                t2: '00:00',
                currentTime: 0,
                volume: 100,
                loop: {
                    in: 0,
                    out: 0,
                    tin: '00:00',
                    tout: '00:00',
                    start: null
                },
                velocidad: 100,
                cues: [{v:0, t:'-'},
                        {v:0, t:'-'},
                        {v:0, t:'-'},
                        {v:0, t:'-'},
                        {v:0, t:'-'},
                        {v:0, t:'-'}],
                paused: true
            }
        ],
        playList1: [],
    }),
    mounted(){
        
    },
    methods:{
        changeMode(){
            const item = this.playList.find(a => a.i == this.i)
            this.audio.src = item.src
            this.audio.load()
            this.audio.pause()
            this.audio.currentTime = 0
        
            this.playList.forEach(a => {
                a.paused = true
                a.currentTime = 0
                a.t1 = '00:00'
                a.volume = 100

                a.audio.volume = 1
                a.audio.pause()
                a.audio.currentTime = 0
                clearInterval(a.update)
            })

            this.volume = 100

            this.mode = !this.mode
            clearInterval(this.update)

            this.randoms = []
        },
        cargarLista(event){
            const files = event.target.files

            if (files.length > 0) {
                let x = this.playList.length == 0 ? 0 : this.playList.length

                this.playList = this.playList.filter(a => a.t2 != '00:00')

                for (let i = 0; i < files.length; i++) {
                    const name = files[i].name.split('/').pop().replace(/\.[^/.]+$/, '')

                    if (!this.playList.some(a => a.name === name)) {
                        const item = {
                            i: x+i+1,
                            name,
                            t1: '00:00',
                            t2: '00:00',
                            currentTime: 0,
                            volume: 100,
                            loop: {
                                in: 0,
                                out: 0,
                                tin: '00:00',
                                tout: '00:00',
                                start: null
                            },
                            velocidad: 100,
                            cues: [{v:0, t:'-'},
                                    {v:0, t:'-'},
                                    {v:0, t:'-'},
                                    {v:0, t:'-'},
                                    {v:0, t:'-'},
                                    {v:0, t:'-'}],
                            src: URL.createObjectURL(files[i]),
                            audio: new Audio()
                        }
                        item.audio.src = item.src
                        item.audio.load()
                        item.paused = item.audio.paused
                        this.playList.push(item)
                    }
                }

                this.ordenar(1)
                this.vacio = this.playList.length > 0 ? false : true
                this.loadDuration()
            }
        },
        ordenar(i){
            if (i == 1) {
                this.orden = false
                this.playList = this.playList.sort((a,b) => a.name.localeCompare(b.name))
            } else {
                this.orden = true
                this.playList = this.playList.sort((b,a) => a.name.localeCompare(b.name))
            }

            for (let i = 0; i < this.playList.length; i++) {
                this.playList[i].i = i
            }
        },
        search(){
            this.playList1 = this.playList.filter(a => a.name.toLowerCase().includes(this.inputBuscar.toLowerCase()))
        },
        loadDuration(){
            for (const a of this.playList) {
                const audio = a.audio
                const interval = setInterval(() => {
                    if(!isNaN(audio.duration)){
                        clearInterval(interval)

                        let min = Math.floor(audio.duration / 60)
                        let sec = Math.floor(audio.duration % 60)
                        if (min < 10) min = '0' + min
                        if (sec < 10) sec = '0' + sec
                        a.t2 = min + ':' + sec
                    }
                }, 500)
            }
        },
        loadTrack(i){
            this.i = i
            const item = this.playList.find(a => a.i == this.i)

            if (this.mode) { //Modo reproductor
                item.currentTime = 0
                item.t1 = '00:00'

                this.audio.src = item.src
                this.audio.load()
                item.volume = this.volume
                this.play()
            } else {
                this.volume = item.volume
            }
        },
        play(i){
            if (this.mode) {
                const item = this.playList.find(a => a.i == this.i)
                
                this.audio.play()
                item.paused = this.audio.paused
                this.update = setInterval(() => this.setT1(this.audio), 1000)

                this.audio.onended = () => {
                    if (this.isRepeat == true) {
                        this.loadTrack(this.i)
                    } else {
                        this.nextTrack()
                    }
                }
            } else {
                const item = this.playList.find(a => a.i == i)

                item.audio.play()
                item.paused = item.audio.paused
                
                item.update = setInterval(() => {
                    item.currentTime = item.audio.currentTime * 100 / item.audio.duration
                    item.t1 = this.tiempoString(item.audio.currentTime)
                }, 1000)

                item.audio.onended = () => {
                    stop(i)
                }
            }
        },
        setT1(audio){
            const item = this.playList.find(a => a.i == this.i)
            item.currentTime = audio.currentTime * 100 / audio.duration

            let min = Math.floor(audio.currentTime / 60)
            let sec = Math.floor(audio.currentTime % 60)
            if (min < 10) min = '0' + min
            if (sec < 10) sec = '0' + sec
            item.t1 = min + ':' + sec
        },
        pause(i){
            if (this.mode) {
                clearInterval(this.update)
                const item = this.playList.find(a => a.i == this.i)
                this.audio.pause()    
                item.paused = this.audio.paused
            } else {
                const item = this.playList.find(a => a.i == i)
                clearInterval(item.update)
                item.audio.pause()
                item.paused = item.audio.paused
            }
        },
        stop(i){
            const item = this.playList.find(a => a.i == i)
            clearInterval(item.update)
            item.audio.pause()
            item.audio.currentTime = 0
            item.currentTime = 0
            item.paused = true
            item.t1 = '00:00'
        },
        mute(i,k){
            const item = this.playList.find(a => a.i == i)
            if (k) {
                item.audio.volume = 0
                item.volume = 0
            } else {
                item.audio.volume = 1
                item.volume = 100
            }
        },
        nextTrack(){
            let i
            if (this.i < this.playList.length - 1 && this.isRandom === false) {
                i = this.i + 1
            } else if (this.i < this.playList.length && this.isRandom === true) {
                this.randoms.push(this.i)

                if (this.randoms.length == this.playList.length) {
                    this.randoms.length = 0
                    this.randoms.push(this.i)
                }

                do {
                    i = Math.floor(Math.random() * this.playList.length)
                } while (this.randoms.some(a => a == i))
            } else {
                i = 0
            }
            this.loadTrack(i);
        },
        prevTrack(){
            let i
            if (this.i > 0 && this.isRandom === false) {
                i = this.i - 1
            } else if(this.i > 0 && this.isRandom === true){
                if (this.randoms.length == 0) {
                    i = this.i > 0 ? this.i - 1 : this.playList.length - 1
                } else {
                    i = this.randoms[this.randoms.length - 1]
                    this.randoms.pop()
                }
            } else {
                i = this.playList.length - 1
            }
            this.loadTrack(i)
        },
        seekTo(){
            const item = this.playList.find(a => a.i == this.i)

            if (this.mode) {
                this.audio.currentTime = this.audio.duration * (item.currentTime / 100)
                this.setT1(this.audio)
            } else {
                if (item.loop.in > 0 && item.loop > 0 && item.audio.currentTime >= item.loop.out) {
                    item.audio.currentTime = item.loop.in
                    this.setT1(item.audio)
                } else {
                    item.audio.currentTime = item.audio.duration * (item.currentTime / 100)
                    this.setT1(item.audio)
                }
            }
        },
        setVolume(){
            if(this.mode){
                this.audio.volume = this.volume / 100
            } else {
                const item = this.playList.find(a => a.i == this.i)
                item.audio.volume = this.volume / 100
                item.volume = this.volume
            }
        },
        tiempoString(time){
            let min = Math.floor(time / 60)
            let sec = Math.floor(time % 60)
            if (min < 10) min = '0' + min
            if (sec < 10) sec = '0' + sec
            return min + ':' + sec
        },
        setLoop(i){
            const item = this.playList.find(a => a.i == this.i)

            if (i == 1) {
                item.loop.in = item.audio.currentTime
                item.loop.tin = this.tiempoString(item.loop.in)
            } else if (i == 2) {
                if (item.loop.in == 0) {
                    
                } else if (item.audio.currentTime <= item.loop.in || item.loop.out > 0) {
                    item.loop.in = 0
                    item.loop.tin = this.tiempoString(item.loop.in)
                    item.loop.out = 0
                    item.loop.tout = this.tiempoString(item.loop.out)
                } else {
                    item.loop.out = item.audio.currentTime
                    item.loop.tout = this.tiempoString(item.loop.out)
                }
            }

            if (item.loop.in > 0 && item.loop.out > 0) {
                item.loop.start = setInterval(() => {
                    if (item.audio.currentTime >= item.loop.out) {
                        item.audio.currentTime = item.loop.in
                        this.setT1(item.audio)
                    }
                }, 100)
            } else {
                clearInterval(item.loop.start)
            }
        },
        setCue(i){
            const item = this.playList.find(a => a.i == this.i)

            if (item.cues[i].v == 0) {
                item.cues[i].v = item.audio.currentTime
                item.cues[i].t = this.tiempoString(item.cues[i].v)
            } else {
                if (item.loop.in > 0 && item.loop > 0 && item.cues[i].v >= item.loop.out) {
                    item.audio.currentTime = item.loop.in
                    this.setT1(item.audio)
                } else {
                    item.audio.currentTime = item.cues[i].v
                    this.setT1(item.audio)
                }
            }
        },
        removeCue(i){
            const item = this.playList.find(a => a.i == this.i)
            item.cues[i].v = 0
            item.cues[i].t = '-'
        },
        setRate(){
            const item = this.playList.find(a => a.i == this.i)
            item.audio.playbackRate = item.velocidad / 100
        },
        defRate(){
            const item = this.playList.find(a => a.i == this.i)
            item.velocidad = 100
            item.audio.playbackRate = 1
        }
    }
}
</script>

<style lang="scss" scoped>
main{
    // background: linear-gradient(to top, var(--clr1) 40%, var(--clr5));
    margin-left: 0.5rem;
    padding: 1rem;
    border-radius: 0.7rem;
    display: flex;
    flex-flow: column;
    gap: 2rem;

    section:nth-child(1){
        display: flex;
        flex-flow: column;
        gap: 1rem;

        article:nth-child(1){
            display: flex;
            flex-flow: column;
            justify-content: center;
            gap: 1rem;

            div:nth-child(1){
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;

                h1{
                    font-size: 1.2rem;
                }

                div{
                    padding: 0.5rem;
                    background-color: var(--clr6);
                    cursor: pointer;
                }
            }

            div:nth-child(2){
                input{
                    width: 100%;
                }

                div{
                    margin-top: 0.5rem;
                    display: flex;
                    justify-content: space-between;
                    gap: 0.5rem;

                    span{
                        font-size: 0.8rem;
                    }
                }
            }

            div:nth-child(3){
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 0.5rem;

                input{
                    width: 50%;
                }
            }
        }

        #player{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 3rem;

            i{
                font-size: 1.5rem;
                cursor: pointer;
            }

            i:nth-child(3){
                font-size: 2.5rem;
            }

            .active{
                color: var(--clr4);
            }
        }

        #tools{
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            gap: 1rem;

            >div{
                display: flex;
                flex-flow: column;
                gap: 0.5rem;
                
                h2{
                    text-align: center;
                    font-size: 0.8rem;
                }

                li{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0.4rem;
                    background-color: var(--clr6);
                    font-size: 0.8rem;
                    gap: 0.5rem;

                    *{
                        font-size: 0.8rem;
                    }
                }
            }

            div:nth-child(1){
                ul{
                    display: grid;
                    grid-gap: 0.5rem;

                    li{
                        justify-content: space-between;
                        width: 5rem;
                        cursor: pointer;

                        span{
                            font-size: 0.8rem;
                        }
                    }
                }
            }

            div:nth-child(2){
                ul{
                    display: grid;
                    grid-template-columns: repeat(3, 4rem);
                    grid-gap: 0.5rem;

                    li{
                        cursor: pointer;
                    }
                }
            }

            div:nth-child(3){
                width: 5rem;

                li{
                    height: 3.5rem;
                    display: flex;
                    flex-flow: column;
                    justify-content: center;
                    gap: 1rem;

                    input{
                        width: 100%;
                    }

                    span{
                        cursor: pointer;
                    }
                }
            }
        }

        .range{
            appearance: none;
            height: 0.05rem;
            background-color: rgba(245,245,245,0.2);
            cursor: pointer;
        }

        .range::-webkit-slider-thumb{
            appearance: none;
            height: 0.5rem;
            width: 0.5rem;
            background-color: white;
            border-radius: 50%;
            transition: all 0.3s ease;
            cursor: pointer;
        }
    }

    section:nth-child(2){
        height: 100%;
        display: flex;
        flex-flow: column;
        gap: 1rem;
        overflow: hidden;

        article{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem;
            gap: 1rem;

            input{
                width: 100%;
            }

            div:nth-child(2){
                display: flex;
                gap: 1rem;

                span{
                    width: 2rem;
                    text-align: right;
                }

                i{
                    cursor: pointer;
                }
            }
        }

        ul{
            overflow: auto;

            li{
                padding: 0.8rem 0.5rem;
                cursor: pointer;
                transition: 0.3s;
                display: flex;
                align-items: center;
                justify-content: space-between;
                // gap: 0.5rem;
                border-radius: 0.4rem;

                &:hover{
                    background-color: var(--hover);
                }

                div{
                    display: flex;
                }

                div:nth-child(1){
                    span{
                        width: 2rem;
                        text-align: center;
                    }
                }

                div:nth-child(2){
                    gap: 1rem;

                    i{
                        font-size: 1.2rem;
                        cursor: pointer;
                    }
                }
            }

            .playing{
                *{
                    color: var(--clr4);
                }
            }
        }
    }
}
</style>