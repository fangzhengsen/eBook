<template>
	<div class="ebook" ref="ebook">
		<epub-menu></epub-menu>
		<epub-reader></epub-reader>
		<epub-title></epub-title>
		<ebook-bookmark></ebook-bookmark>
	</div>
</template>

<script>
import epubReader from '../../components/epubBook/EbookReader';
import epubMenu from '../../components/epubBook/EbookMenu';
import epubTitle from '../../components/epubBook/EbookTitle';
import ebookBookmark from "../../components/epubBook/EbookBookmark";
import {ebookMixin} from "../../utils/mixin";
import {getReadTime, saveReadTime} from "../../utils/localStorage";
export default {
    name: "epubBook",
		components:{
        epubReader,
				epubMenu,
				epubTitle,
        ebookBookmark
		},
    mixins: [ebookMixin],
		watch:{
        offsetY(v){
            if(this.bookAvailable&&!this.menuVisible){
                if(v>0){
                    this.move(v)
                }else if(v===0){
                    this.restore()
                }
            }
        }
		},
		methods:{
        restore(){
            this.$refs.ebook.style.top=0;
            this.$refs.ebook.style.transition='all .2s linear';
        },
        move(v){
            this.$refs.ebook.style.top=v+'px';
            this.$refs.ebook.style.transition='';
        },
        startLoopReadTime(){
            let readTime=getReadTime(this.fileName)
		        if(!readTime){
		            readTime=0;
		        }
		        this.task=setInterval(()=>{
		            readTime++;
		            if(readTime%30===0){
		                saveReadTime(this.fileName,readTime)
		            }
		        },1000)
        }
		},
		mounted() {
        this.startLoopReadTime()
    },
		beforeDestroy() {
        if(this.task){
            clearInterval(this.task)
        }
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	.ebook{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height:100%;
	}
</style>