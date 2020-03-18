import '../css/index.css'
import '../css/base.css'

(function (window) {
    'use strict';

	// Your starting point. Enjoy the ride!
var todoapp = new Vue({
    el: '.todoapp',
    data: {
        newList: '',   // 新增todolist
        lists:[],   // 所有todolists
        visibility: '',
    },
    computed: {
    /******** 筛选已完成，未完成，全部 ********/
        filterTodos: function () {
            switch (this.visibility) {
                case 'active':
                    return this.lists.filter((val) => {
                        return !val.isCompleted
                    })
                case 'completed':
                    return this.lists.filter((val) => {
                        return val.isCompleted
                    })
                default:
                    return this.lists
            }
        },
    /******** 未完成数量 ********/
        incomplete: function(){
            return this.lists.filter((val)=>{
                return !val.isCompleted
            }).length
        }
    },
    methods: {
    /******** 随机生成不重复8位字符串，即todolist唯一ID ********/
        makeid(length=8) {
            let result = '';
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            let charactersLength = characters.length
            for (let  i = 0; i<length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength))
            }
            return result
        },
    /******** 根据id查找唯一todolist ********/
        findTodoList(id) {
            for (let i=0; i < this.lists.length; i++){
                if (id === this.lists[i].id) {
                    return i
                }
            }
            return false
        },
    /******** 增加 / 删除任务 ********/
        addList (e) {
            if(this.newList){
                this.lists.unshift({ name: this.newList, isCompleted: false, id: this.makeid()})
                this.newList = ''
            }
        },
        removeList(id) {
            this.lists.splice(this.findTodoList(id), 1)
        },
    /******** 双击编辑任务 ********/
        editList (id) {
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
        changeCompleted(id) {
            const index = this.findTodoList(id)
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
        this.lists = JSON.parse(localStorage.getItem('todos')) || []
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
