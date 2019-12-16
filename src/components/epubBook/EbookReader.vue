<template>
	<div id="read"></div>
</template>

<script>
import {ebookMixin} from '../../utils/mixin'
import Epub from 'epubjs';
export default {
    name: "ebookReader",
		data(){
        return{

        }
		},
    mixins:[ebookMixin],
		mounted(){
        this.$store.dispatch('setFileName',this.$route.params.filename.split('|').join('/'))
		        .then(()=>{
            this.initEpub();
        });
		},
    methods:{
        initEpub(){
            const url=`http://192.168.0.2:8008/epub/${this.fileName}.epub`;
            this.book = new Epub(url);
            this.setCurrentBook(this.book);
            this.rendition = this.book.renderTo('read', {
                width: window.innerWidth,
                height: window.innerHeight,
                method: 'default'
            })
            this.rendition.display()
		        this.rendition.on('touchstart',(e)=>{
		            this.touchStartX=e.changedTouches[0].clientX;
		            this.timeStart=e.timeStamp
		        })
		        this.rendition.on('touchend',(e)=>{
		            this.touchDiff=e.changedTouches[0].clientX-this.touchStartX
				        this.timeDiff=e.timeStamp-this.timeStart;
								if(this.touchDiff>40&&this.timeDiff<500){
								    this.prevPage();
								}else if(this.touchDiff<-40&&this.timeDiff<500){
								    this.nextPage();
								}else{
								    this.toggleMenuBar();
								}

		        })
        },
		    prevPage(){
            if(this.rendition){
                this.hideTitleAndMenu();
                this.rendition.prev();
            }
		    },
        nextPage(){
            if(this.rendition){
                this.hideTitleAndMenu();
                this.rendition.next();
            }
        },
		    hideTitleAndMenu(){
            if(this.menuVisible){
                this.setSettingVisible(-1)
            }
            this.setMenuVisible(false);
		    },
        toggleMenuBar(){
            this.setSettingVisible(-1)
            this.setMenuVisible(!this.menuVisible);
        }
    },
}
</script>

<style scoped>

</style>