<template>
	<div>
		<epub-menu></epub-menu>
		<epub-reader></epub-reader>
		<epub-title></epub-title>
	</div>
</template>

<script>
import epubReader from '../../components/epubBook/EbookReader';
import epubMenu from '../../components/epubBook/EbookMenu';
import epubTitle from '../../components/epubBook/EbookTitle'
export default {
    name: "epubBook",
		components:{
        epubReader,
				epubMenu,
				epubTitle
		},
}
</script>

<style scoped>

</style>