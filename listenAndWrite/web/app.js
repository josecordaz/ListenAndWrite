var id = 1, texto = '';
Ext.application({
    name: 'HelloExt',
    launch: function() {
        Ext.define('ServiceList', {
            extend: 'Ext.data.Model',
            fields: [
            {
                name:'id', 
                type:'int'
            },

            {
                name:'name', 
                type:'string'
            }
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
            margin: '35 5 5 5',
            items:[
            {
                xtype:'form',
                id:'frmSubirArchivos',
                layout: {
                    type:'vbox',
                    //pack: 'center',
                    align: 'center'
                },
                title:'Subir archivos',
                collapsible :true,
                region: 'west',
                margin: '35 5 5 5',
                width:'20%',
                items:[
                {
                    xtype: 'filefield',
                    width:'100%',
                    name: 'mp3',
                    buttonText: 'MP3'
                },
                {
                    xtype: 'filefield',
                    width:'100%',
                    name: 'srt',
                    buttonText: 'SRT'
                },{
                    xtype : 'button',
                    text  : 'Subir',
                    handler:function(){
                        var form = Ext.getCmp('frmSubirArchivos').getForm();
                            form.submit({
                                url: '/listenAndWrite/FileUploader.x',
                                waitMsg: 'Subiendo archivos...',
                                success: function(fp, o) {
                                    Ext.Msg.alert('Correcto', 'Your photo "' + o.result.file + '" has been uploaded.');
                                }
                            });
                    }
                }
            ]
            },
            {
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
                    id:'cmbPracticas',
                    fieldLabel: 'Audio',
                    store: store,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'name',
                    listeners:{
                        select:function(combo, records, eOpts){
                            Ext.getDom('myAudio').addEventListener('ended', function(){
                                this.src = 'http://localhost:8084/listenAndWrite/audio.mp3?practica='+records[0].data.name+'&id='+id;
                                this.play();
                            }, false);
            
                            Ext.getDom('myAudio').type = 'audio/mpeg';
                            Ext.getDom('myAudio').src = 'http://localhost:8084/listenAndWrite/audio.mp3?practica='+records[0].data.name+'&id='+id;
                            
                            consultaText();
                            Ext.getDom('myAudio').play();
                        }
                    }
                },
                {
                    xtype      : 'textareafield',
                    readOnly   : true,
                    id         : 'txfArea',
                    labelAlign : 'top',
                    flex       : 1,
                    value      : '',
                    padding    : '5 5 5 5',
                    fieldLabel : 'Texto',
                    width      : '60%',
                    height     : '40%'
                },
                {
                    xtype      : 'textfield',
                    id         : 'txfType',
                    padding    : '5 5 5 5',
                    width      : '60%',
                    enableKeyEvents :true,
                    listeners  : {
                        keyup:function(textfield, e, eOpts ){
                            if(Ext.getCmp('txtTexto').getValue().indexOf(Ext.getCmp('txfArea').getValue()+textfield.getValue()+' ')==0){
                                Ext.getCmp('txfArea').setValue(Ext.getCmp('txfArea').getValue()+ textfield.getValue()+' ');
                                textfield.setValue();
                            } else {
                                if(Ext.getCmp('txtTexto').getValue().indexOf(Ext.getCmp('txfArea').getValue()+textfield.getValue())!=0){
                                    textfield.setValue(textfield.getValue().substr(0,textfield.getValue().length-1))
                                }
                            }
                        }
                    }
                },{
                    xtype      : 'textfield',
                    hidden     : true,
                    id         : 'txtTexto',
                    width      : '100%'
                }
                ]
            }]
        });
    }
});

function consultaText(){
    Ext.Ajax.request({
        url: 'http://localhost:8084/listenAndWrite/texto.x?practica='+Ext.getCmp('cmbPracticas').getValue()+'&id='+id,
        success:function(uno,dos,tres){
            Ext.getCmp('txtTexto').setValue(Ext.decode(uno.responseText).texto);
        }
    });
}