<template>
	<div class="ebook-reader">
		<div id="read"></div>
		<div class="ebook-reader-mask"
		     @click="onMaskClick"
		     @touchmove="move"
		     @touchend="moveEnd"
		     @mousedown.left="onMouseEnter"
		     @mousemove.left="onMouseMove"
		     @mouseup.left="onMouseEnd"></div>
	</div>
</template>

<script>
import {ebookMixin} from '../../utils/mixin'
import {
    getFontFamily,
    getFontSize,
    saveFontFamily,
    saveFontSize,
    getTheme,
    saveTheme,
    getLocation
} from "../../utils/localStorage";
import Epub from 'epubjs';
import {flatten} from "../../utils/book";
export default {
    name: "ebookReader",
    mixins:[ebookMixin],
		mounted(){
        this.$store.dispatch('setFileName',this.$route.params.filename.split('|').join('/'))
		        .then(()=>{
            this.initEpub();
        });
		},
    methods:{
        // 1 - 鼠标进入
        // 2 - 鼠标进入后的移动
        // 3 - 鼠标从移动状态松手
        // 4 - 鼠标还原
        onMouseEnd(e) {
            if (this.mouseState === 2) {
                this.setOffsetY(0)
                this.firstOffsetY = null
                this.mouseState = 3
            } else {
                this.mouseState = 4
            }
            const time = e.timeStamp - this.mouseStartTime
            if (time < 100) {
                this.mouseState = 4
            }
            e.preventDefault()
            e.stopPropagation()
        },
        onMouseMove(e) {
            if (this.mouseState === 1) {
                this.mouseState = 2
            } else if (this.mouseState === 2) {
                let offsetY = 0
                if (this.firstOffsetY) {
                    offsetY = e.clientY - this.firstOffsetY
                    this.setOffsetY(offsetY)
                } else {
                    this.firstOffsetY = e.clientY
                }
            }
            e.preventDefault()
            e.stopPropagation()
        },
        onMouseEnter(e) {
            this.mouseState = 1
            this.mouseStartTime = e.timeStamp
            e.preventDefault()
            e.stopPropagation()
        },
        move(e){
            let offsetY=0;
            if(this.firstOffset){
								offsetY=e.changedTouches[0].clientY-this.firstOffset
            }else{
                this.firstOffset=e.changedTouches[0].clientY;
            }
						this.setOffsetY(offsetY);
        },
        onMaskClick(e){
            let width=window.innerWidth;
            let offsetX=e.offsetX;
            if(offsetX>0&&offsetX<width*0.3){
                this.prevPage()
            }else if(offsetX>0&&offsetX>width*0.7){
                this.nextPage()
            }else {
                this.toggleMenuBar()
            }
        },
        moveEnd(){
						this.setOffsetY(0);
						this.firstOffset=0;
        },
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
		    initRendition(){
            this.rendition = this.book.renderTo('read', {
                width: window.innerWidth,
                height: window.innerHeight,
                method: 'default'
            })
				    const location=getLocation(this.fileName)
            this.display(location,()=>{
                this.initFamily();
                this.initFontSize();
                this.initTheme();
            })
            this.rendition.hooks.content.register(contents=>{
                contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`)
                contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
                contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`)
                contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`)
            })
		    },
		    // 上页下页手势操作
		    // initGesture(){
        //     this.rendition.on('touchstart',(e)=>{
        //         this.touchStartX=e.changedTouches[0].clientX;
        //         this.timeStart=e.timeStamp
        //     })
        //     this.rendition.on('touchend',(e)=>{
        //         this.touchDiff=e.changedTouches[0].clientX-this.touchStartX
        //         this.timeDiff=e.timeStamp-this.timeStart;
        //         if(this.touchDiff>40&&this.timeDiff<500){
        //             this.prevPage();
        //         }else if(this.touchDiff<-40&&this.timeDiff<500){
        //             this.nextPage();
        //         }else{
        //             this.toggleMenuBar();
        //         }
        //         e.preventDefault();
        //         e.stopPropagation();
		    //
        //     })
		    // },
		    parseBook(){
		        this.book.loaded.cover.then((cover)=>{
		            this.book.archive.createUrl(cover).then((url)=>{
		                this.setCover(url)
		            })
		        })
				    this.book.loaded.metadata.then((metadata)=>{
				        this.setMetadata(metadata);
				    })
				    this.book.loaded.navigation.then((nav)=>{
				        const navItem=flatten(nav.toc)
						    function find(item,level=0){
				            if(!item.parent){
				                return level;
				            }else{
				                return find(navItem.filter(parentItem=>parentItem.id===item.parent)[0],++level)
				            }
						    }
						    navItem.forEach((item)=>{
						        item.level=find(item)
						    })
						    this.setNavigation(navItem)
				    })
		    },
        initEpub(){
            const url=`${process.env.VUE_APP_EPUB_URL}/${this.fileName}.epub`;
            this.book = new Epub(url);
            this.setCurrentBook(this.book);
            this.initRendition();
            // this.initGesture();
            this.parseBook();
						this.book.ready.then(()=>{
						    return this.book.locations.generate(750*(window.innerWidth/375)*(getFontSize(this.fileName)/16))
						}).then((locations)=>{
                this.navigation.forEach(nav => {
                    nav.pagelist = []
                })
                locations.forEach(item => {
                    const loc = item.match(/\[(.*)\]!/)[1]
                    this.navigation.forEach(nav => {
                        if (nav.href) {
                            const href = nav.href.match(/^(.*)\.html$/)
                            if (href) {
                                if (href[1] === loc) {
                                    nav.pagelist.push(item)
                                }
                            }
                        }
                    })
                    let currentPage = 1
                    this.navigation.forEach((nav, index) => {
                        if (index === 0) {
                            nav.page = 1
                        } else {
                            nav.page = currentPage
                        }
                        currentPage += nav.pagelist.length + 1
                    })
                })
                this.setPagelist(locations)
						    this.setBookAvailable(true);
						    this.refreshLocation();
						})
        },
		    prevPage(){
            if(this.rendition){
                this.hideTitleAndMenu();
                this.rendition.prev().then(()=>{
                    this.refreshLocation()
                });
            }
		    },
        nextPage(){
            if(this.rendition){
                this.hideTitleAndMenu();
                this.rendition.next().then(()=>{
                    this.refreshLocation()
                });
            }
        },
        toggleMenuBar(){
            this.setSettingVisible(-1)
            this.setMenuVisible(!this.menuVisible);
            this.setFontFamilyVisible(false)
        }
    },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
	.ebook-reader{
		width: 100%;
		height:100%;
		overflow: hidden;
		.ebook-reader-mask{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height:100%;
			z-index: 150;
		}
	}
</style>