<template>
	<div id="read"></div>
</template>

<script>
import {ebookMixin} from '../../utils/mixin'
import {getFontFamily,getFontSize,saveFontFamily,saveFontSize,getTheme,saveTheme} from "../../utils/localStorage";
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
        initFamily(){
            let fontFamily=getFontFamily(this.fileName)
            if(!fontFamily){
                saveFontFamily(this.fileName,this.defaultFontFamily)
            }else{
                this.currentBook.rendition.themes.font(fontFamily)
                this.setDefaultFontFamily(fontFamily)
            }
        },
        initFontSize(){
            let fontSize=getFontSize(this.fileName)
            if(!fontSize){
                saveFontSize(this.fileName,this.defaultFontSize)
            }else {
                this.currentBook.rendition.themes.fontSize(fontSize)
                this.setDefaultFontSize(fontSize)
            }
        },
        initTheme(){
            let themes=this.themeList
		        themes.forEach((theme)=>{
                this.currentBook.rendition.themes.register(theme.name,theme.style);
		        })
		        let localTheme=getTheme(this.fileName)
		        if(!localTheme){
                saveTheme(this.fileName,this.defaultTheme)
		        }else{
				        this.setDefaultTheme(localTheme)
		        }
            this.initGlobalStyle()
            this.currentBook.rendition.themes.select(localTheme)
        },
        initEpub(){
            const url=`http://192.168.0.2:8008/epub/${this.fileName}.epub`;
            this.book = new Epub(url);
            this.setCurrentBook(this.book);
            this.rendition = this.book.renderTo('read', {
                width: window.innerWidth,
                height: window.innerHeight,
                method: 'default'
            })
            this.rendition.display().then(()=>{
								this.initFamily();
								this.initFontSize();
								this.initTheme();
            })
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
								e.preventDefault();
								e.stopPropagation();

		        })
		        this.rendition.hooks.content.register(contents=>{
							contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`)
              contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
              contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`)
              contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`)
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
            this.setFontFamilyVisible(false);
		    },
        toggleMenuBar(){
            this.setSettingVisible(-1)
            this.setMenuVisible(!this.menuVisible);
            this.setFontFamilyVisible(false)
        }
    },
}
</script>

<style scoped>

</style>