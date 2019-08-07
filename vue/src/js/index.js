import '../css/index.css'
import '../css/base.css'
import axios from './axios.conf.js'

var todoapp = new Vue({
    el: '.todoapp',
    data: {
        loading: false,
        newList: '',   // 新增todolist
        lists: [],   // 所有todolists [{_id, list, isComplete}]
        visibility: '',
    },
    computed: {
    /******** 未完成数量 ********/
        incomplete: function(){
            return this.lists.filter((val)=>{
                return !val.isComplete
            }).length
        }
    },
    methods: {
        getList() {
            this.loading = true
            axios.get('/v1/readList', { params: { type: this.visibility }})
                .then(res => {
                this.lists = res.data
                this.loading = false
            })
                .catch(err => {
                this.loading = false
            })
        },
    /******** 增加 / 删除任务 ********/
        addList() {
            this.loading = true
            if (this.newList) {
                axios.post('/v1/createList', {
                    newList: { list: this.newList, isComplete: false }
                }).then(res => {
                    this.getList()
                    this.newList = ''
                }).catch(err => {
                    this.loading = false
                })
            }
        },
        removeList(id) {
            this.loading = true
            axios.delete('/v1/removeList', {
                data: {id: id}
            }).then(res => {
                this.getList()
            }).catch(err => {
                this.loading = false
            })
        },
    /******** 双击编辑任务 ********/
        editList (e) {
            let parent = e.currentTarget.parentNode.parentNode
            parent.classList.add('editing')
            parent.querySelector('.edit').focus()
        },
        finishEdit(e, id, editedList){
            let parent = e.currentTarget.parentNode
            parent.classList.remove('editing')
            axios.put('/v1/updateList', {
                id: id, list: editedList
            }).then(res => {
                this.getList()
            }).catch(err => {
                this.loading = false
            })
        },
    /******** 清空完成的任务 ********/
        clear(){
            this.loading = true
            axios.delete('/v1/removeAll').then(res => {
                this.getList()
            }).catch(err => {
                this.loading = false
            })
        },
    /******** 任务状态（已完成、未完成）转换 ********/
        changeCompleted(id, bool) {
            this.loading = true
            const isComplete = !bool
            axios.put('/v1/updateComplete', {
                id: id, isComplete: isComplete
            }).then(res => {
                this.getList()
            }).catch(err => {
                this.loading = false
            })
        },
    /******** 全部完成 ********/
        finishAll() {
            this.loading = true
            axios.put('/v1/allComplete')
            .then(res => {
                this.getList()
            }).catch(err => {
                this.loading = false
            })
        },
        logout() {
            this.loading = true
            axios.post('/v1/logout')
                .then(res => {
                    this.getList()
                }).catch(err => {
                    this.lists = []
                    this.loading = false
                })
        }
    },
    watch: {
        lists: {
            deep: true,
            handler: function () {
                this.$refs.loading.style.height = this.$refs.main.offsetHeight + 'px'
            },
        }
    },
    created() {
        this.$nextTick(() => {
            this.getList()
        })
    },
    /******** 查看（所有的、未完成的、已完成的）任务 ********/
    mounted() {
        let that = this
        window.onhashchange=function(){
            todoapp.visibility = window.location.hash.slice(2)
            that.getList()
        }
        window.onload=function(){
            todoapp.visibility = window.location.hash.slice(2)
            that.getList()
        }
    }
})
