Ext.application({
    name: 'HelloExt',
    launch: function() {
        Ext.define('ServiceList', {
            extend: 'Ext.data.Model',
            fields: [
                {name:'id', type:'int'},
                {name:'name', type:'string'}
            ]
        });
        
        var store = Ext.create('Ext.data.Store', {
            model: 'ServiceList',
            proxy: {
                type: 'ajax',
                url: '/listenAndWrite/ConsultaPracticas.x',
                reader: {
                    root: 'data',
                    type: 'json'
                }
            }
        });
        store.load();
        
        Ext.create('Ext.Viewport', {
            layout: 'border',
            title:'Listen And Write',
            items:[{
                    xtype:'panel',
                region: 'center',
                margin: '35 5 5 5',
                layout: {
                    type:'vbox',
                    pack: 'center',
                    align: 'center'
                },
                width:'100%',
                items: [
                {
                    padding: '5 5 5 5',
                    xtype:'combo',
                    fieldLabel: 'Audio',
                    store: store,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'name',
                    listeners:{
                        select:function(combo, records, eOpts){
                            Ext.getDom('myAudio').type = 'audio/mpeg';
                            Ext.getDom('myAudio').src = 'http://localhost:7734/listenAndWrite/audio.mp3?practica='+records[0].data.name;
//                            Ext.getDom('myAudio').addEventListener('ended', restartVideo, false);
//                            Ext.getDom('myAudio').loop = true;
                            Ext.getDom('myAudio').play();
                        }
                    }
                },
                {
                    xtype      : 'textareafield',
                    labelAlign : 'top',
                    flex:1,
                    padding    : '5 5 5 5',
//                    grow       : true,
//                    name       : 'message',
                    fieldLabel : 'Texto',
                    width      : '60%',
                    height     : '40%'
                },
                {
                    xtype      : 'textfield',
//                    flex:1,
                    padding    : '5 5 5 5',
//                    name       : 'txtTecleo',
                    text       :'asdfasdf',
                    width      : '60%'
                }
                ]
            }]
        });
    //        Ext.create('Ext.window.Window',{
    //            title:'Listen and Write',
    //            width:'70%',
    //            height:'70%',
    //            layout: {
    //                type: 'table',
    //                columns: 3,
    //                tdAttrs: { style: 'padding: 5px;' }
    //            },
    //            defaults: {
    //                xtype: 'panel',
    //                width: '33%',
    ////                height: 200,
    //                bodyPadding: 10,
    //                frame: true
    //            },
    //            items:[
    //                {
    //                    layout :'auto',
    //                    items:[
    //                        {
    //                            xtype:'text',
    //                            html:'hola'
    //                        },
    //                        {
    //                            xtype:'button',
    //                            text:'Botón',
    //                            handler:function(){
    //                                document.getElementById('myAudio').addEventListener('ended', function(){
    //                                    this.currentTime = 0;
    //                                    this.play();
    //                                }, false);
    //                                document.getElementById("myAudio").loop=true;
    //                                Ext.getDom('myAudio').src = 'http://localhost:8084/listenAndWrite/audio.mp3';
    //                                Ext.getDom('myAudio').play();
    //                                //document.getElementById("myAudio").loop=true;
    //                            }
    //                        }
    //                    ]
    //                },
    //                {
    //                    layout :'auto',
    //                    items:[
    //                        {
    //                            xtype:'text',
    //                            html:'hola'
    //                        },
    //                        {
    //                            xtype:'button',
    //                            text:'Botón',
    //                            handler:function(){
    //                                document.getElementById('myAudio').addEventListener('ended', function(){
    //                                    this.currentTime = 0;
    //                                    this.play();
    //                                }, false);
    //                                document.getElementById("myAudio").loop=true;
    //                                Ext.getDom('myAudio').src = 'http://localhost:8084/listenAndWrite/audio.mp3';
    //                                Ext.getDom('myAudio').play();
    //                                //document.getElementById("myAudio").loop=true;
    //                            }
    //                        }
    //                    ]
    //                },
    //                {
    //                    layout :'auto',
    //                    items:[
    //                        {
    //                            xtype:'text',
    //                            html:'hola'
    //                        },
    //                        {
    //                            xtype:'button',
    //                            text:'Botón',
    //                            handler:function(){
    //                                document.getElementById('myAudio').addEventListener('ended', function(){
    //                                    this.currentTime = 0;
    //                                    this.play();
    //                                }, false);
    //                                document.getElementById("myAudio").loop=true;
    //                                Ext.getDom('myAudio').src = 'http://localhost:8084/listenAndWrite/audio.mp3';
    //                                Ext.getDom('myAudio').play();
    //                                //document.getElementById("myAudio").loop=true;
    //                            }
    //                        }
    //                    ]
    //                }
    //            ]
    //        }).show();
    }
});

