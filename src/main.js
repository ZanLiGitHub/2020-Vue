import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import touch from 'vue-directive-touch';
import 'vant/lib/index.css'

import {  PullRefresh, Grid, GridItem, Popup, Area, AddressList, AddressEdit, Icon, SubmitBar, Stepper, Checkbox, CheckboxGroup, SwipeCell, Toast, CellGroup, Form, Field, Rate, List, Tag, Button, Image as VanImage, Swipe, SwipeItem, Lazyload, Badge, Sidebar, SidebarItem, Collapse, CollapseItem, Tab, Tabs, Card } from 'vant';

createApp(App).use(store).use(router).use(touch)
    .use(PullRefresh).use(Grid).use(GridItem).use(Popup).use(Area).use(AddressList).use(AddressEdit).use(Icon).use(SubmitBar).use(Stepper).use(Checkbox).use(CheckboxGroup).use(SwipeCell).use(Toast).use(CellGroup).use(Form).use(Field).use(Rate).use(List).use(Tag).use(Button).use(VanImage).use(Card).use(Swipe).use(SwipeItem).use(Lazyload, {loading:require('./assets/images/default.png')}).use(Badge).use(Sidebar).use(SidebarItem).use(Collapse).use(CollapseItem).use(Tab).use(Tabs)
    .mount('#app')
