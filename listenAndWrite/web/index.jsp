<%-- 
    Document   : index
    Created on : Jan 23, 2014, 3:33:46 PM
    Author     : JoseCarlos
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="ext-4.2/resources/css/ext-all.css">
        <script type="text/javascript" src="ext-4.2/ext-debug.js"></script>
        <title>JSP Page</title>
    </head>
    <body>
        <script type="text/javascript">
            Ext.onReady(function(){
                Ext.create('Ext.window.Window', {
                    title: 'Hello',
                    height: 200,
                    width: 400,
                    layout: 'fit',
                    items: {  // Let's put an empty grid in just to illustrate fit layout
                        xtype: 'grid',
                        border: false,
                        columns: [{header: 'World'}],                 // One header just for show. There's no data,
                        store: Ext.create('Ext.data.ArrayStore', {}) // A dummy empty data store
                    }
                }).show();
            });
        </script>
    </body>
</html>
