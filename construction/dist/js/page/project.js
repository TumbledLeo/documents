/** v1.0 by helijun **/ 
require([
    'jquery',
    'common', 
    'layuiAll',
    'json/map',
    'css!css/project/list'
], function(
    $, 
    HSKJ
){
    HSKJ.ready(function () {
        var projectIndex = {
            init: function () {
                this.checkPrtSc();
                this.getProjectList();
                this.renderDate();
                this.setInterval();
                this.wactch();
            },

            data: {
                projectid: HSKJ.getUrlParameter('projectid') || '',
                tpl: $("#mainTpl").html() //缓存
            },

            checkPrtSc: function(){
                if (window.innerWidth <= 1900 || window.innerWidth >= 1990){
                    layui.layer.open({
                        title: '提示'
                        , content: '请将分比率调至 1920*1080'
                        , btn: []
                        , closeBtn: 0
                    });     
                }

                if ((window.innerWidth >= 1900 || window.innerWidth <= 1990) &&
                    window.innerHeight <= 1066 //冗余14像素
                ) {
                    layui.layer.open({
                        title: '提示'
                        , content: '请按F11键全屏查看效果更佳'
                        , btn: ['知道了']
                    });
                }
            },

            getProjectList: function(){
                var self = this;

                var urlend = '';
                if(HSKJ.getUserInfo('roleid') != 1){
                    urlend = '?organizationid=' + HSKJ.getUserInfo('organizationid');
                }
                
                HSKJ.POST({
                    url: 'system/project/query' + urlend,
                    beforeSend: function () {
                        HSKJ.loadingShow();
                    },
                    success: function (json) {
                        if (json && json.code == 0) {
                            var html = '';
                            $(json.data).each(function(k, v){
                                html += '<option value='+ v.projectid +'>'+ v.name +'</option>';
                            })
                            $('select[name=projectName]').html(html).change(function(){
                                self.data.projectid = $('select[name=projectName]').val();
                                self.getCountDataAjax();
                            })

                            if(!self.data.projectid){
                                self.data.projectid = json.data[0].projectid;
                            }else{
                                $('select[name=projectName]').val(self.data.projectid);
                            }

                            self.getCountDataAjax();
                        } else {
                            layui.layer.msg(json.message)
                        }
                    }
                })
            },

            getCountDataAjax: function(){
                var self = this;
                HSKJ.POST({
                    url: 'system/outline/query?projectid=' + self.data.projectid,
                    beforeSend: function () {
                        HSKJ.loadingShow();
                    },
                    success: function (json) {
                        if (json && json.code == 0) {
                            self.renderHtml(json.data);            
                        } else {
                            layui.layer.msg(json.message)
                        }
                    }
                })
            },

            renderHtml: function (data) {
                var self = this;
                $('article').html(layui.laytpl(self.data.tpl).render(data || {}))
            },

            checkPrtSc: function(){
                if (window.innerWidth <= 1900 || window.innerWidth >= 1990){
                    layui.layer.open({
                        title: '提示'
                        , content: '请将分比率调至 1920*1080'
                        , btn: []
                        , closeBtn: 0
                    });     
                }

                if ((window.innerWidth >= 1900 || window.innerWidth <= 1990) &&
                    window.innerHeight <= 1066 //冗余14像素
                ) {
                    layui.layer.open({
                        title: '提示'
                        , content: '请按F11键全屏查看效果更佳'
                        , btn: ['知道了']
                    });
                }
            },

            setInterval: function (data) {
                var self = this;

                setInterval(function(){
                    self.renderDate()
                }, 1000)

                setInterval(function () {
                    self.getCountDataAjax()
                }, ENV.PROJECT_TIME)
                
            },

            //头部日期
            renderDate: function(){
                var ymd = new Date().toLocaleString().split(' ')[0].replace('/', '年').replace('/', '月') + '日';
                var time = new Date().toLocaleString().split(' ')[1];
                var day = '星期' + '日一二三四五六'.charAt(new Date().getDay());
                $('.el-time-ymd').html(ymd);
                $('.el-time-day').html(day);
                $('.el-time-hms').html(time);
            },

            wactch: function () {
                var self = this; 

                
            }
        }
        
        projectIndex.init();
        })
    }
)