<template id="google-static-map">
	<img :src="'https://maps.googleapis.com/maps/api/staticmap?' + queryString" :width="width" :height="height"/>
</template>