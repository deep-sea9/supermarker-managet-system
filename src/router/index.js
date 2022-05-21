import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login'
import Welcome from '../components/Welcome.vue'
import GoodsList from '../components/goods/GoodsList'
import EmployeeList from '../components/employee/EmployeeList'
import Inventory from '../components/goods/Inventory'
import Management from '../components/employee/Management'
import Salement from '../components/sell/Salement'
import Statistics from '../components/sell/Statistics'
import Report from '../components/report/Report'
import Settings from '../components/settings/Settings'
import Supply from '../components/supply/Supplier.vue'
import AddGoods from '../components/goods/AddGoods.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'   //重定向
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/goods',
        component: GoodsList,
        
      },
      {
        path: '/emp',
        component: EmployeeList
      },
      {
        path: '/inventory',
        component: Inventory
      },
      {
        path: '/management',
        component: Management
      },
      {
        path: '/salement',
        component: Salement
      },
      {
        path: '/statistics',
        component: Statistics
      },
      {
        path: '/report',
        component: Report
      },
      {
        path: '/settings',
        component: Settings
      },
      {
        path: '/supply',
        component: Supply
      },
      {
        path: '/add',
        component: AddGoods
      }
    ]
  },
 
]



const router = new VueRouter({
  routes,
  mode: 'history'
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  
  //to 将要访问的路径
  //from 代表从哪个路径跳转到来
  //next() 是一个函数，表示放行
  if (to.path === '/login') return next()
  const session = window.sessionStorage.getItem('session')
  // console.log(token);
  if (!session) {
    alert("您还没有登录，请登录后重新进入系统！");
    return next('/login')
  } 
  next()

})

export default router
