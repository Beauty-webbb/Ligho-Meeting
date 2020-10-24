import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index.vue'
import webrtc from '../views/webrtc.vue'
import menu from '../views/menu.vue'
import video from '../views/video.vue'
import setup from '../views/SetUp.vue'
import setVideo from '../views/SetVideo.vue'
import setRedio from '../views/SetRedio.vue'
import setPersonal from '../views/SetPersonal.vue'
import setInfo from '../views/SetInfo.vue'
import setFeedback from '../views/SetFeedback.vue'
import reserMeet from '../views/ReserMeet.vue'
import meetDetails from '../views/MeetDetails.vue'
import feedbacklist from '../views/FeedbackList.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'index',
    component: index
  },
  {
    path: '/webrtc',
    name: 'webrtc',
    component: webrtc
  },
  {
    path: '/menu',
    name: 'menu',
    component: menu
  },
  {
    path: '/video',
    name: 'video',
    component: video
  },
  {
    path: '/setup',
    name: 'setup',
    component: setup,
    children: [{
        path: 'setvideo',
        name: 'setvideo',
        component: setVideo,
      },
      {
        path: 'setredio',
        name: 'setredio',
        component: setRedio,
      },
      {
        path: 'setpersonal',
        name: 'setpersonal',
        component: setPersonal,
      },
      {
        path: 'setinfo',
        name: 'setinfo',
        component: setInfo,
      },
      {
        path: 'setfeedback',
        name: 'setfeedback',
        component: setFeedback,
      },
    ]
  },
  {
    path: '/resermeet',
    name: 'resermeet',
    component: reserMeet,
    children: [{
      path: 'meetDetails:id?',
      name: 'meetDetails',
      component: meetDetails
    }]
  },
  {
    path: '/feedbacklist',
    name: 'feedbacklist',
    component: feedbacklist
  },
]

const router = new VueRouter({
  routes
})

export default router
