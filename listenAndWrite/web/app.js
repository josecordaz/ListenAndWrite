Ext.application({
    name: 'HelloExt',
    launch: function() {
        Ext.create('Ext.window.Window',{
            title:'Listen and Write',
            width:'70%',
            height:'70%',
            items:[
                {
                    xtype:'panel',
                    layout :'absolute',
                    items:[
                        {
                            xtype:'text',
                            text:'hola'
                        },
                        {
                            xtype:'button',
                            text:'Botón',
                            handler:function(){
                                document.getElementById('myAudio').addEventListener('ended', function(){
                                    this.currentTime = 0;
                                    this.play();
                                }, false);
                                document.getElementById("myAudio").loop=true;
                                Ext.getDom('myAudio').src = 'http://localhost:8084/listenAndWrite/audio.mp3';
                                Ext.getDom('myAudio').play();
                                //document.getElementById("myAudio").loop=true;
                            }
                        }
                    ]
                }
            ]
        }).show();
    }
});