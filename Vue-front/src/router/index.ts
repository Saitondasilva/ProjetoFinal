import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // Dashboard / Home
  {
    path: '/',
    name: 'Ecommerce',
    component: () => import('../views/Ecommerce.vue'),
    meta: { title: 'eCommerce Dashboard', requiresAuth: true },
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../views/Others/Calendar.vue'),
    meta: { title: 'Calendar', requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Others/UserProfile.vue'),
    meta: { title: 'Profile', requiresAuth: true },
  },

  // Forms
  /*{
    path: '/form-elements',
    name: 'Form Elements',
    component: () => import('../views/Forms/FormElements.vue'),
    meta: { title: 'Form Elements', requiresAuth: true },
  },*/

  // Tables
  {
    path: '/basic-tables',
    name: 'Basic Tables',
    component: () => import('../views/Tables/BasicTables.vue'),
    meta: { title: 'Basic Tables', requiresAuth: true },
  },
  {
    path: '/noti-tables',
    name: 'Notificação Tables',
    component: () => import('../views/Tables/TableNoti.vue'),
    meta: { title: 'Notificação Tables', requiresAuth: true },
  },
  {
    path: '/propostas-disponiveis',
    name: 'propostas-disponiveis',
    component: () => import('../views/Tables/TableAluno.vue'),
    meta: { title: 'Propostas Disponíveis', requiresAuth: true },
  },
  {
    path: '/minhas-propostas',
    name: 'minhas-propostas',
    component: () => import('../views/Tables/TableMinhaProOne.vue'),
    meta: { title: 'Minhas Propostas', requiresAuth: true },
  },

  // Charts
  /*{
    path: '/bar-chart',
    name: 'Bar Chart',
    component: () => import('../views/Chart/BarChart/BarChart.vue'),
    meta: { title: 'Bar Chart', requiresAuth: true },
  },

  // UI Elements
  {
    path: '/alerts',
    name: 'Alerts',
    component: () => import('../views/UiElements/Alerts.vue'),
    meta: { title: 'Alerts', requiresAuth: true },
  },
  {
    path: '/avatars',
    name: 'Avatars',
    component: () => import('../views/UiElements/Avatars.vue'),
    meta: { title: 'Avatars', requiresAuth: true },
  },
  {
    path: '/badge',
    name: 'Badge',
    component: () => import('../views/UiElements/Badges.vue'),
    meta: { title: 'Badge', requiresAuth: true },
  },
  {
    path: '/buttons',
    name: 'Buttons',
    component: () => import('../views/UiElements/Buttons.vue'),
    meta: { title: 'Buttons', requiresAuth: true },
  },
  {
    path: '/images',
    name: 'Images',
    component: () => import('../views/UiElements/Images.vue'),
    meta: { title: 'Images', requiresAuth: true },
  },
  /*{
    path: '/videos',
    name: 'Videos',
    component: () => import('../views/UiElements/Videos.vue'),
    meta: { title: 'Videos', requiresAuth: true },
  },
*/
  // Pages
  /*{
    path: '/blank',
    name: 'Blank',
    component: () => import('../views/Pages/BlankPage.vue'),
    meta: { title: 'Blank', requiresAuth: true },
  },*/

  // Auth
  {
    path: '/signin',
    name: 'Signin',
    component: () => import('../views/Auth/Signin.vue'),
    meta: { title: 'Signin', requiresAuth: false },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Auth/Signup.vue'),
    meta: { title: 'Signup', requiresAuth: false },
  },

  // Error
  {
    path: '/error-404',
    name: '404 Error',
    component: () => import('../views/Errors/FourZeroFour.vue'),
    meta: { title: '404 Error', requiresAuth: false },
  },

  // Catch all → 404
  {
    path: '/:catchAll(.*)',
    redirect: '/error-404',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes,
})

// 🔒 Guard global: verifica login
router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title} | Sistema de Gestão Acadêmico`

  const isLoggedIn = !!localStorage.getItem('token')

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/signin') // redireciona se não estiver logado
  } else if ((to.path === '/signin' || to.path === '/signup') && isLoggedIn) {
    next('/') // impede voltar para login/signup se já estiver logado
  } else {
    next() // segue normalmente
  }
})

export default router
