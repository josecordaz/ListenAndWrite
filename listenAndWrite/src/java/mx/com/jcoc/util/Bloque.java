/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package mx.com.jcoc.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author joseo
 */
public class Bloque {
    
    int inicio;
    int fin;
    String texto;
    Bloque(String lapsos,String texto){
        String []arr,tiempo,hora;
        
        arr = lapsos.split(" ");

        tiempo = arr[0].split(",");
        hora = tiempo[0].split(":");

        this.inicio = toInt(toInt(hora[0])*(60*60)+toInt(hora[1])*(60)+toInt(hora[2])+""+toInt(tiempo[1]));

        tiempo = arr[2].split(",");
        hora = tiempo[0].split(":");

        this.fin = toInt(toInt(hora[0])*(60*60)+toInt(hora[1])*(60)+toInt(hora[2])+""+toInt(tiempo[1]));

        this.texto = texto;

    }
    
    public static int toInt(String strInt){
        return Integer.parseInt(strInt);
    }
    
    public static  void main(String args[]){
        String lapsos = "01:34:46,882 --> 02:34:48,494";
        String texto = "How did that feel?";
        Bloque bloque = new Bloque(lapsos, texto);
        System.out.println(bloque.inicio);
        System.out.println(bloque.fin);
    }
}
