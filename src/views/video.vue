<template>
  <div class="main-only-video">
    <!-- <video oncontextmenu="return true;" :style="{'width':'100%','height':'100%'}" autoplay playsinline id="mainonlyvideo" ></video> -->
  </div>
</template>

<script>
import APIUrl from '@/axios/api.url'
import { post, get } from '@/axios/index'
import { mapState } from 'vuex' //引入vuex
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['admin', 'HideShowView', 'pclosecmare']),
  },
  methods: {},
}
</script>

<style>
.main-only-video {
  border: 1px red solid;
}
</style>
