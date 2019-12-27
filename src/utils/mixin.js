import {mapGetters,mapActions} from 'vuex'
import {themeList,removeAllCss,addCss,getReadTimeByMinute} from './book'
import {getBookmark, saveLocation} from "./localStorage";


export const ebookMixin={
  computed:{
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark'
    ]),
    themeList() {
      return themeList(this)
    },
    getSectionName(){
      // let sectionName=null;
      // if(this.section){
      //     const sectionInfo=this.currentBook.section(this.section)
      //     if(sectionInfo&&sectionInfo.href&&this.currentBook&&this.currentBook.navigation){
      //         sectionName=this.currentBook.navigation.get(sectionInfo.href).label;
      //     }
      // }
      return this.section?this.navigation[this.section].label:'';
    }
  },
  methods:{
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark'
    ]),
    initGlobalStyle() {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },
    refreshLocation(){
      const curentLocation=this.currentBook.rendition.currentLocation();
      if(curentLocation&&curentLocation.start){
        const startCfi=curentLocation.start.cfi;
        const progress=this.currentBook.locations.percentageFromCfi(startCfi)
        this.setProgress(Math.floor(progress*100))
        this.setSection(curentLocation.start.index)
        saveLocation(this.fileName,startCfi)
        const bookmark=getBookmark(this.fileName)
        if(bookmark){
          if(bookmark.some(item=>item.cfi===startCfi)){
            this.setIsBookmark(true)
          }else {
            this.setIsBookmark(false)
          }
        }else{
          this.setIsBookmark(false)
        }
      }
    },
    display(target,cb){
      if(target){
        this.currentBook.rendition.display(target).then(()=>{
          this.refreshLocation()
          if(cb) cb();
        })
      }else {
        this.currentBook.rendition.display().then(()=>{
          this.refreshLocation()
          if(cb) cb();
        });
      }
    },
    hideTitleAndMenu(){
      if(this.menuVisible){
        this.setSettingVisible(-1)
      }
      this.setMenuVisible(false);
      this.setFontFamilyVisible(false);
    },
    getReadTimeText(){
      return this.$t('book.haveRead',[getReadTimeByMinute(this.fileName)])
    },
  }
}