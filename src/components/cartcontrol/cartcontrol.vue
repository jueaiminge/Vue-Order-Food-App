<template>
	<div class="cartcontrol">
		<transition name="fade">
			<div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop="decreaseCart($event)"></div>
		</transition>
		<transition name="show">
			<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
		</transition>
		<!--必须加参数$event-->
		<div class="cart-increase icon-add_circle" @click.stop="increaseCart($event)"></div>  
	</div>
</template>

<script>
	import Vue from 'vue'

	export default {
		props: {
			food:{
				type:Object
			}
		},
		methods: {
			increaseCart(event) {
				if(!event._constructed){
					return ;
				}
				if(!this.food.count) {
					Vue.set(this.food,'count',1);
				} else {
					this.food.count++;
				}
				this.$emit('add', event.target);
			},
			decreaseCart(event) {
				if(!event._constructed){
					return ;
				}
				if(this.food.count) {
					this.food.count--;
				}
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"

.cartcontrol
  font-size: 0
  .cart-decrease, .cart-increase
    display: inline-block
    font-size: 24px
    line-height: 24px
    padding: 6px
    color: rgb(0,160,220)
    /*.cart-decrease
      display: inline-block
      padding: 6px
      opacity: 1
      transform: translate3d(0, 0, 0)
      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        transition: all 0.4s linear
        transform: rotate(0)
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)*/
  .cart-decrease
    &.fade-enter-active 
      transition: all .4s
      transform:rotate(180deg)
    &.fade-leave-active 
      transition: all .3s
      transform:rotate(180deg)
    &.fade-enter, &.fade-leave-to
      transform: translateX(24px)
      opacity: 0;
  .cart-count
    display: inline-block
    vertical-align: top
    width: 12px
    padding-top: 6px
    line-height: 24px
    text-align: center
    font-size: 10px
    color: rgb(147,153,159)
    &.show-enter-active
      transition: all 0.35s
    &.show-leave-active
      transition: all 0.05s
    &.show-enter,&.show-leave-to
      opacity: 0
  .cart-increase
    display: inline-block
</style>