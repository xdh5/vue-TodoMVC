(function (window) {
	'use strict';

	// Your starting point. Enjoy the ride!
var todoapp = new Vue({
		el: '.todoapp',
		data: {
			newLists: '',
			lists:[],
			visibility: '',
		},
/******** 查看（所有的、未完成的、已完成的）任务 ********/
		computed: {
			filterTodos: function(){
				if(this.visibility === 'active'){
					return this.lists.filter((val)=>{
						return !val.isCompleted
					})
				} else if(this.visibility === 'completed'){
					return this.lists.filter((val)=>{
						return val.isCompleted
					})
				} else{
					return this.lists
				}
			},
			incomplete: function(){
				return this.lists.filter((val)=>{
					return !val.isCompleted
				}).length
			}
		},
		methods: {
/******** 增加 / 删除任务 ********/
			addList (e) {
				if(this.newLists){
					this.lists.unshift({name: this.newLists, isCompleted: false})
					this.newLists = ''
				}
			},
			removeList (index) {
				this.lists.splice(index, 1)
			},
/******** 双击编辑任务 ********/
			editList (e) {
				let parent = e.currentTarget.parentNode.parentNode
				parent.classList.add('editing')
				parent.querySelector('.edit').focus()
			},
			finishEdit(event){
				let parent = event.currentTarget.parentNode
				parent.classList.remove('editing')
			},

/******** 显示未完成任务的数量 ********/

/******** 清空完成的任务 ********/
			clear(){
				this.lists = this.lists.filter((val)=>{
					return !val.isCompleted
				})
			},
/******** 任务状态（已完成、未完成）转换 ********/
			changeCompleted (index) {
				this.lists[index].isCompleted = !this.lists[index].isCompleted
			},
/******** 全部完成 ********/
			finishAll(){
				this.lists.forEach(element => {
					element.isCompleted = true
				})
			}
		},
		created(){
			this.lists = JSON.parse(localStorage.getItem('todos'))
		},
/******** 查看（所有的、未完成的、已完成的）任务 ********/
		mounted(){
			window.onhashchange=function(){
				todoapp.visibility = window.location.hash.slice(2)
			}
			window.onload=function(){
				todoapp.visibility = window.location.hash.slice(2)
			}
		},
		watch:{
			lists:{
				deep: true,
				handler:function(){
					localStorage.setItem('todos',JSON.stringify(this.lists))
				},
			}
		}
	})
})(window);