const app = new Vue({
    el: '#app',
    data:{
        menu: 'add',
        addTodoBar:{
            newTodo: '',
            newTomato: '',
        },
        listnav: 'todo',
        todos:[{
            title: 'My First Task',
            needTomato: 2,
            tomatoProgress: 0,
            workTime: 1500,
            breakTime: 300,
            seleted: false,
        },
        {
            title: 'My Second Task',
            needTomato: 5,
            tomatoProgress: 3,
            workTime: 750,
            breakTime: 300,
            seleted: false,
        },
        {
            title: 'My Third Task',
            needTomato: 2,
            tomatoProgress: 1,
            workTime: 375,
            breakTime: 300,
            seleted: false,
        },
        {
            title: 'My 4 Task',
            needTomato: 4,
            tomatoProgress: 2,
            workTime: 1125,
            breakTime: 300,
            seleted: false,
        },
        {
            title: 'My 5 Task',
            needTomato: 1,
            tomatoProgress: 1,
            workTime: 0,
            breakTime: 180,
            seleted: false,
        },
        {
            title: 'My 6 Task',
            needTomato: 2,
            tomatoProgress: 2,
            workTime: 0,
            breakTime: 0,
            seleted: false,
        },
        ],
        cacheTitle: '',
        cacheTomato: '',
        playBar:{
            cacheCount: '',
            status: false,
        },
        timeInitial:{
            taskTime: 1500,
            restTime: 300,
        },
        tomatoMode: 'work',
        completedTomatos: 0,
        chart:[{
            ID: '07/15',
            tomato: 5,
            day: 'MON',
            time: 1563190084925
        },
        {
            ID: '07/16',
            tomato: 2,
            day: 'TUS',
            time: 1563262884925
        },
        {
            ID: '07/11',
            tomato: 9,
            day: 'THU',
            time: 1562830884925
        },
        ],
        datebtn: 0,
        ringtoneNav: 'work',
        workMusic: [{
            title: `Birds in Flight`,
            src: `music/break/Birds in Flight.mp3`,
            seleted: true,
            isPlay: false,
        },
        {
            title: `Jazz_Mango`,
            src: `music/break/Jazz_Mango.mp3`,
            seleted: false,
            isPlay: false,
        },
        {
            title: `Come on my deer!!`,
            src: `music/break/Come on my deer!!.mp3`,
            seleted: false,
            isPlay: false,
        },
        {
            title: `Theme of Alberta`,
            src: `music/break/Theme of Alberta.mp3`,
            seleted: false,
            isPlay: false,
        },
        {
            title: `RESPECOGNIZE`,
            src: `music/break/RESPECOGNIZE.mp3`,
            seleted: false,
            isPlay: false,
        },
        {
            title: `Tupelo Train`,
            src: `music/break/Tupelo Train.mp3`,
            seleted: false,
            isPlay: false,
        },
        ],
        breakMusic:[{
            title: `Pacific Sunset`,
            src: `music/work/Pacific Sunset.mp3`,
            seleted: true,
            isPlay: false,
        },
        {
            title: `Chucky the Construction Worker`,
            src: `music/work/Chucky the Construction Worker.mp3`,
            seleted: false,
            isPlay: false,
        },
        {
            title: `One Step Closer`,
            src: `music/work/One Step Closer.mp3`,
            seleted: false,
            isPlay: false,
        },
        {
            title: `Wishful Thinking`,
            src: `music/work/Wishful Thinking.mp3`,
            seleted: false,
            isPlay: false,
        },
        {
            title: `Canal`,
            src: `music/work/Canal.mp3`,
            seleted: false,
            isPlay: false,
        },
        {
            title: `Country Cue`,
            src: `music/work/Country Cue.mp3`,
            seleted: false,
            isPlay: false,
        },
        ],
        cacheMusic: null,
        musicDuration: 0,
        musicCurrentTime: 0,
        alert: '',
    },
    mounted(){
        if(localStorage.getItem('todos')){
            try{
                this.todos = JSON.parse(localStorage.getItem('todos'));
            }catch(e){
                localStorage.removeItem('todos');
            }
        }
        if(localStorage.getItem('chart')){
            try{
                let vm = this
                vm.chart = JSON.parse(localStorage.getItem('chart'));

                // 如果今天有資料的話，今日完成番茄 = 資料內今天的番茄數量
                let dt = new Date();
                let month = dt.getMonth() + 1
                if(month < 10){month = '0'+ String(month)}
                let today = month +'/'+ dt.getDate()

                const ob = vm.chart.filter(function(item){
                    return item.ID === today
                })
                vm.completedTomatos = ob[0].tomato
            }catch(e){
                localStorage.removeItem('chart');
            }
        }
        if(localStorage.getItem('workMusic')){
            try{
                this.workMusic = JSON.parse(localStorage.getItem('workMusic'));
            }catch(e){
                localStorage.removeItem('workMusic');
            }
        }
        if(localStorage.getItem('breakMusic')){
            try{
                this.breakMusic = JSON.parse(localStorage.getItem('breakMusic'));
            }catch(e){
                localStorage.removeItem('breakMusic');
            }
        }
        // this.seleteList();
    },
    methods:{
        addTodo: function(){
            if(this.addTodoBar.newTodo === '' || this.addTodoBar.newTomato ===''){
                return;
            };
            this.todos.push({
                title: this.addTodoBar.newTodo,
                needTomato: this.addTodoBar.newTomato,
                tomatoProgress: 0,
                breakTime: 300,
                workTime: 1500,
                seleted: false,
            });
            this.addTodoBar.newTodo = '';
            this.addTodoBar.newTomato = '';
            this.saveData('todos', this.todos);
        },
        editTodo: function(item){
            if(this.cacheTitle !== item.title){                    
                this.cacheTitle = item.title
                this.cacheTomato = item.needTomato
            }else{
                this.cacheTitle = ''
                this.cacheTomato = ''
            }
        },
        editDone: function(item){
            item.title = this.cacheTitle;
            item.needTomato = this.cacheTomato;
            this.saveData('todos', this.todos);
            this.editTodo(item);                
        },
        removeTodo: function(key){
            this.todos.splice([key],1)
            this.saveData('todos', this.todos);
        },
        countDown: function(){
            let vm = this;
            // 區分是工作or休息模式  如已在倒數中，禁止重複按播放
            if(this.tomatoMode === 'work' && typeof(this.playBar.cacheCount) === 'string'){                        
                this.playBar.cacheCount = setInterval(function(){
                    vm.mainfilter[0].workTime -= 1
                    // 工作time = 0 的話   
                    if(vm.mainfilter[0].workTime === 0){
                        // 停止倒數
                        clearInterval(vm.playBar.cacheCount)
                        // 鬧鐘響
                        vm.menu = 'ringtone'
                        vm.ringtoneNav = 'work'
                        vm.playAudio(vm.workMusic.map(function(item){
                            return item.seleted
                        }).indexOf(true))
                        vm.alert = 'alarm'
                        // 切換休息模式
                        vm.tomatoMode = 'rest'
                        // 播放按鈕彈回
                        vm.playBar.status = ''
                        // 可播放狀態(intervalID = 0)
                        vm.playBar.cacheCount = ''
                        // 存檔
                        vm.saveData('todos', vm.todos);
                    }
                }, 1000);
            }else if(this.tomatoMode === 'rest' && typeof(this.playBar.cacheCount) === 'string'){
                // 第四個番茄休息模式切為30分鐘
                if(vm.completedTomatos % 3 === 0 && vm.completedTomatos !== 0){
                    vm.mainfilter[0].breakTime = 1800
                }else{
                    vm.mainfilter[0].breakTime = 300
                }
                this.playBar.cacheCount = setInterval(function(){
                    vm.mainfilter[0].breakTime -= 1
                    // 休息time = 0
                    if(vm.mainfilter[0].breakTime === 0){
                        // 停止倒數
                        clearInterval(vm.playBar.cacheCount);
                        // 任務番茄完成+1 ，今日完成番茄+1
                        vm.mainfilter[0].tomatoProgress += 1
                        vm.completedTomatos += 1
                        // 切換工作模式
                        vm.tomatoMode = 'work'
                        // 播放按鈕彈回
                        vm.playBar.status = ''
                        // 可播放狀態(intervalID = 0)
                        vm.playBar.cacheCount = ''
                        // 存檔(todos)
                        vm.saveData('todos', vm.todos);
                        // 圖表 用map+indexof找今日資料，如沒有(map = -1)則新增，有則覆蓋
                            let dt = new Date();
                            let month = dt.getMonth() + 1
                            if(month < 10){month = '0'+ String(month)}
                            const today = month +'/'+ dt.getDate()
                            const weekday = ['SUN', 'MON', 'TUS', 'WED', 'THU', 'FRI', 'SAT']
                        let map = vm.chart.map(function(item){
                            return item.ID
                        }).indexOf(today)

                        if(map === -1){
                            vm.chart.push({
                            ID : today,
                            tomato: vm.completedTomatos,
                            day: weekday[dt.getDay()],
                            time: Number(dt)
                            })
                        }else{
                            vm.chart[map].tomato = vm.completedTomatos
                            vm.chart[map].time = Number(dt)
                        }

                        vm.saveData('chart', vm.chart);

                        // 鬧鐘響
                        vm.menu = 'ringtone'
                        vm.ringtoneNav = 'break'
                        let rtMap = vm.breakMusic.map(function(item){
                            return item.seleted
                        }).indexOf(true)
                        console.log(rtMap);
                        
                        vm.playAudio(rtMap)
                        vm.alert = 'alarm'
                        // 番茄全部完成 or 重置下個番茄
                        if(vm.mainfilter[0].tomatoProgress === vm.mainfilter[0].needTomato){
                            vm.mainfilter[0].seleted = false
                            vm.todosfilter[0].seleted =true
                        }else{
                            vm.resetCountDown();
                        }
                    }
                }, 1000);
            }
        },
        stopCountDown: function(){
            clearInterval(this.playBar.cacheCount)
            this.playBar.cacheCount = ''
            this.saveData('todos', this.todos);
        },
        resetCountDown: function(){
            this.stopCountDown();
            this.mainfilter[0].breakTime = this.completedTomatos % 3 === 0 && this.completedTomatos !== 0 ? 1800:300 

            if(this.tomatoMode === 'work'){
                this.mainfilter[0].workTime = 1500;
            }
            this.saveData('todos', this.todos);
        },
        seleteList: function(item){
            if(isNaN(this.mainfilter)){
            this.mainfilter[0].seleted = false
            }            
            item.seleted = true
            this.tomatoMode = item.workTime !== 0 ? 'work' : 'rest'
        },
        smallTomato: function(key, item){
            let vm = item !== undefined ? item : this.mainfilter[0]

            if(key === vm.tomatoProgress){
                let taskTime = this.timeInitial.taskTime
                let result = (taskTime - vm.workTime) / taskTime
                if(result <= 1/4 && result > 1/8){
                    return {
                        width: `4px`,
                        height: `4px`,
                        borderRadius: `0 10px 0 0`,
                        border: `1px solid #EA5548`
                    }
                }else if(result <= 1/2 && result > 3/8 ){
                    return {
                        width: `4px`,
                        height: `10px`,
                        borderRadius: `0 10px 10px 0`,
                        border: `1px solid #EA5548`
                    }
                }else if(result > 5/8 && result <= 1 && item === undefined){
                    return {
                        width: `5.7px`,
                        height: `5.5px`,
                        borderRadius: `10px 0 0 10%`,
                        left: `0px`,
                        backgroundColor: `#EAEAEA`
                    }
                }else if(result > 5/8 && result <= 1 && item !== undefined){                            
                    return {
                        width: `6px`,
                        height: `6px`,
                        borderRadius: `100% 10% 10% 10%`,
                        left: `0px`,
                        top: `0px`,
                        backgroundColor: `#414141`,
                    }
                }
            }
        },
        saveData: function(name, item){
            const parsed = JSON.stringify(item);
            localStorage.setItem(name, parsed)
        },
        playAudio: function(key){
            let vm = this
            let musicList = vm.ringtoneNav === 'work'? vm.workMusic : vm.breakMusic
            let audio = vm.ringtoneNav === 'work'? document.querySelectorAll('.work .audio') : document.querySelectorAll('.break .audio')
            console.log(audio);
            
            if(audio[key].paused){
                clearInterval(this.cacheMusic)
                for(let i = 0; i < audio.length; i++){
                    audio[i].pause()
                    audio[i].currentTime = 0
                    musicList[i].isPlay = false                            
                }

                audio[key].play()
                musicList[key].isPlay = true
                this.musicDuration = audio[key].duration
                this.cacheMusic = setInterval(function(){
                    vm.musicCurrentTime = audio[key].currentTime                                                               
                },300)
            }else{
                audio[key].load()
                musicList[key].isPlay = false
                clearInterval(this.cacheMusic)
            }
        },
        rtSelete: function(e){
            let musicList = this.ringtoneNav === 'work'? this.workMusic : this.breakMusic
            let saveName = this.ringtoneNav === 'work'? 'workMusic' : 'breakMusic'

            let map = musicList.map(function(item){
                return item.seleted
            }).indexOf(true)
            musicList[map].seleted = false
            e.seleted = true

            this.saveData(saveName , musicList)
        },
        stopAlarm: function(){
            let vm = this
            let musicList = vm.ringtoneNav === 'work'? vm.workMusic : vm.breakMusic
            vm.playAudio(musicList.map(function(item){return item.seleted}).indexOf(true))
        }
    },
    computed: {
        mainfilter: function(){
            return this.todos.filter(function(item){
                return item.seleted
            })
        },
        clockTimeR: function(){
            // 變數=工作or休息time
            let timeInitial = this.mainfilter[0].workTime !== 0 ? this.timeInitial.taskTime : this.timeInitial.restTime;
            let countDownTime = this.mainfilter[0].workTime !== 0 ? this.mainfilter[0].workTime : this.mainfilter[0].breakTime;

            return {
            transform : countDownTime > timeInitial / 2 ?
            `rotate(${-135 + (timeInitial - countDownTime) * (180 / (timeInitial / 2))}deg)`:
            `rotate(45deg)`
            }
        },
        clockTimeL: function(){
            let timeInitial = this.mainfilter[0].workTime !== 0 ? this.timeInitial.taskTime : this.timeInitial.restTime;
            let countDownTime = this.mainfilter[0].workTime !== 0 ? this.mainfilter[0].workTime : this.mainfilter[0].breakTime;

            return {
            transform : countDownTime <= timeInitial/2?
            `rotate(${-135 + (timeInitial/2 - countDownTime) * (180 / (timeInitial / 2))}deg)`:
            `rotate(-135deg)`
            }
        },
        clockTime: function(){
            let time = this.mainfilter[0].workTime !== 0 ? this.mainfilter[0].workTime : this.mainfilter[0].breakTime;

            let seconds = time % 60 < 10 ? time % 60 + '0' : time % 60
            return parseInt(time / 60) +':'+ seconds
        },
        todosfilter: function(){
            let vm = this;
            return this.todos.filter(function(item){
                return vm.listnav === 'todo'? item.breakTime > 0 : item.breakTime === 0 && item.tomatoProgress === item.needTomato 
            })
        },
        datefilter: function(){
            let vm = this
            let todayDt = new Date();
            let nowDt = new Date(todayDt - vm.datebtn*24*60*60*1000)
            let sevenDt = new Date(nowDt - 6*24*60*60*1000)
            return vm.chart.filter(function(item){
                return item.time > sevenDt && item.time <= nowDt
            }).sort(function(a, b){ return a.time - b.time})
        },
        musicTimeR: function(){
            return {
            transform : this.musicCurrentTime <= this.musicDuration / 2 ?
            `rotate(${-135 + this.musicCurrentTime / (this.musicDuration/2) * 180}deg)`:
            `rotate(45deg)`
            }
        },
        musicTimeL: function(){
            return {
            transform : this.musicCurrentTime > this.musicDuration / 2 ?
            `rotate(${-135 + (this.musicCurrentTime - (this.musicDuration/2))/ (this.musicDuration/2) * 180}deg)`:
            `rotate(-135deg)`
            }
        },
    },
})
