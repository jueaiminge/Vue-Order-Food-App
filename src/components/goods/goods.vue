<template>
	<div class="goods">
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="(item, index) in goods" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
					<span class="text border-1px">
						<span v-show="item.type >= 0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
	    <div class="foods-wrapper" ref="foodWrapper">
	    	<ul>
	    		<li class="food-list food-list-hook" v-for="item in goods">
	    			<h1 class="title">{{item.name}}</h1>
	    			<ul>
	    				<li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-item border-none">
	    					<div class="icon">
	    						<img :src="food.icon" width="57" height="57"/>
	    					</div>
	    					<div class="content">
	    						<h2 class="name">{{food.name}}</h2>
	    						<p class="desc">{{food.description}}</p>
	    						<div class="extra">
	    							<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
	    						</div>
	    						<div class="price">
	    							<span class="now">¥{{food.price}}</span><span v-if="food.oldPrice" class="old">¥{{food.oldPrice}}</span>
	    						</div>
	    						<div class="cartcontrol-wrapper">
	    							<!--同样的节点-->
	    							<cartcontrol :food="food" @add="addFood"></cartcontrol>
	    						</div>
	    					</div>
	    				</li>
	    			</ul>
	    		</li>
	    	</ul>
	    </div>
	    <shopcart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
	    <food :food="selectedFood" ref="food" @add="addFood"></food>
	</div>
</template>

<script>
	const ERR_OK = 0;
	import food from '../food/food'
	import BScroll from 'better-scroll'
	import shopcart from '../shopcart/shopcart'
	import cartcontrol from '../cartcontrol/cartcontrol'
	
	export default {
		props: {
			seller: {
				type:Object
			}
		},
		components: {
			food,
			shopcart,
			cartcontrol
		},
		data() {
			return {
				goods: [],
				selectedFood: {},
				listHeight: [],
				scrollY: 0
			}
		},
		created() {
			this.classMap = ['decrease','discount','special','invoice','guarantee'];
			
			this.$http.get('/api/goods').then((response) => {
				response = response.body;
				if(response.errno === ERR_OK){
					this.goods = response.data;
					this.$nextTick(() => {
						this._initScroll();
						this._calculateHeight();
					});
				}
			});
		},
		computed: {
			currentIndex() {
				for(let i = 0 ; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i+1];
					if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
						return i;
					}
				}
				return 0;
			},
			selectFoods() {
				let foods = [];
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if(food.count) {
							foods.push(food);
						}
					});
				});
				return foods;
			}
		},
		methods: {
			selectMenu(index,event) {
				if(!event._constructed){
					return ;
				}
				let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
				let el = foodList[index];
				this.foodScroll.scrollToElement(el,200);
			},
			_calculateHeight() {
				let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
				let height = 0;
				this.listHeight.push(height);
				for(let i = 0; i <foodList.length; i++){
					let item = foodList[i];
					height += item.clientHeight;
					this.listHeight.push(height);
				}
			},
			_initScroll() {
				this.menuScroll = new BScroll(this.$refs.menuWrapper,{
					click:true
				});
				this.foodScroll = new BScroll(this.$refs.foodWrapper,{
					probeType: 3,
					click: true
				});
				this.foodScroll.on('scroll',(pos) => {
					this.scrollY = Math.abs(Math.round(pos.y));
				});
			},
			selectFood(food,event) {
				if(!event._constructed){
					return ;
				}
				this.selectedFood = food;
				this.$refs.food.show();
			},
			addFood(target) {
				this._drop(target);
			},
			_drop(target) {
				this.$nextTick(() => {
					this.$refs.shopcart.drop(target);
				});
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"

.goods
  position: absolute
  top: 174px
  bottom: 46px
  width: 100%
  display: flex
  overflow: hidden
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    background: #f3f5f7
    .menu-item
      display: table
      height: 54px
      width: 56px
      padding: 0 12px
      line-height: 14px
      &.current
        position: relative
        margin-top: -1px
        z-index: 10
        background: white
        font-weight: 700
        .text
          border-none()
      .icon
        display: inline-block
        width: 12px
        height: 12px
        margin-right: 2px
        background-size: 12px 12px
        background-repeat: no-repeat
        &.decrease
          bg-image('decrease_3')
        &.discount
          bg-image('discount_3')
        &.guarantee
          bg-image('guarantee_3')
        &.invoice
          bg-image('invoice_3')
        &.special
          bg-image('special_3')
      .text
        display: table-cell
        font-size: 12px
        vertical-align: middle
        width: 56px
        border-1px(rgba(7,17,27,0.1))
  .foods-wrapper
    flex: 1
    .title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid #d9dde1
      font-size: 12px
      color: rgb(147,153,159)
      background: #f3f5f7
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      border-1px(rgba(7,17,27,0.1))
      &:last-child
        border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57
        margin-right: 10px
      .content
        flex: 1
        .name
          margin: 2px 0 8px 0
          height: 14px
          line-height: 14px
          font-size: 14px
          color: rgb(7,17,27)
        .desc,.extra
          line-height: 10px
          font-size: 10px
          color: rgb(147,153,159)
        .extra
          .count
            margin-right: 12px
        .desc
           margin-bottom: 8px
           line-height: 15px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 18px
            font-size: 14px
            color:rgb(240,20,20)
          .old
            text-decoration: line-through
            font-size: 10px
            color: rgb(147,153,159)
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 12px
</style>