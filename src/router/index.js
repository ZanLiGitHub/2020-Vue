import {createRouter, createWebHistory, VueRouter} from 'vue-router'
import {Toast} from 'vant'
import store from '../store'

const Home = () => import('../views/home/Home')
const Cart = () => import('../views/cart/Cart')
const Category = () => import('../views/category/Category')
const Detail = () => import('../views/detail/Detail')
const Profile = () => import('../views/profile/Profile')
const Register = () => import('../views/profile/Register')
const Login = () => import('../views/profile/Login')
const Address = () => import('../views/profile/Address')
const AddressEdit = () => import('../views/profile/AddressEdit')
const CreateOrder = () => import('../views/order/CreateOrder')
const OrderDetail = () => import('../views/order/OrderDetail')
const Order = () => import('../views/order/Order')

const routes = [
    //首页
    {
        path: '',
        name: 'Default',
        component: Home,
        meta: {
            title: '图书商城'
        }
    },
    //首页
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
            title: '图书商城'
        }
    },
    //购物车
    {
        path: '/cart',
        name: 'Cart',
        component: Cart,
        meta: {
            title: '购物车',
        }
    },
    //分类
    {
        path: '/category',
        name: 'Category',
        component: Category,
        meta: {
            title: '商品分类'
        }
    },
    //商品详情
    {
        path: '/detail',
        name: 'Detail',
        component: Detail,
        meta: {
            title: '商品详情'
        }
    },
    //个人中心
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: {
            title: '个人信息',
            isAuthRequired: true
        }
    },
    //注册
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            title: '用户注册'
        }
    },
    //登录
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: '用户登录'
        }
    },
    //地址列表
    {
      path: '/address',
      name: 'Address',
      component: Address,
      meta: {
          title:'地址管理',
      }
    },
    //地址编辑
    {
        path: '/addressedit',
        name: 'AddressEdit',
        component: AddressEdit,
        meta: {
            title:'地址编辑',
        }
    },
    //创建订单
    {
        path: '/createorder',
        name: 'CreateOrder',
        component: CreateOrder,
        meta: {
            title:'创建订单',
        }
    },
    //订单详情
    {
        path:'/orderdetail',
        name:'OrderDetail',
        component:OrderDetail,
        meta:{
            title:'订单详情'
        }
    },
    //订单列表
    {
        path:'/order',
        name:'Order',
        component:Order,
        meta:{
            title:'订单列表'
        }
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

// const router = new VueRouter({
//     mode:'hash',
//     base:process.env.BASE_URL,
//     routes,
// })

router.beforeEach((to, from, next) => {
    //如果没有登陆,在这里到login
    // store.state.user.isLogin == false
    let token = window.localStorage.getItem('token')
    if(to.meta.isAuthRequired  && token===' '){
        Toast.fail('请先登录')
        return next('/login')
    }else{
        next();
    }

    document.title = to.meta.title
})

export default router
