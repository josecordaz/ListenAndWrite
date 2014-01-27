package mx.com.jcoc.util;

import com.google.code.mp3fenge.Mp3Fenge;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ListenAndWrite {
    private File subtitulos, audioMp3;
    private List<Bloque> bloques;
    public ListenAndWrite(File audioMp3,File subtitulos){
        this.subtitulos = subtitulos;
        this.audioMp3 = audioMp3;
        new File(audioMp3.getParent()+"\\audio").mkdir();
        new File(audioMp3.getParent()+"\\texto").mkdir();
    }
    
    public void crearBloques(){
        Scanner scn;
        try {
            scn = new Scanner(subtitulos);

            List<Bloque> listaB = new ArrayList();
            while (scn.hasNextLine()) {
                scn.nextLine();
                String lapsos = scn.nextLine();

                String parcial = scn.nextLine(), texto="";
                while(parcial.length()!=0&&scn.hasNextLine()){
                    texto += parcial;
                    parcial = scn.nextLine();
                    if(parcial.length()!=0){
                        parcial = " "+parcial;
                    }
                }

                if(scn.hasNextLine()){
                    Bloque bloque = new Bloque(lapsos,texto);
                    listaB.add(bloque);
                }
                
            }
            this.bloques = listaB;
        } catch (FileNotFoundException ex) {
            Logger.getLogger(ListenAndWrite.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public void crearPedazosMP3AndText(int rango){
        Iterator<Bloque> iterator = bloques.iterator();
        Mp3Fenge mp3Cuter = new Mp3Fenge(this.audioMp3);
        Bloque bloque = bloques.get(0);
        int inicio = bloque.inicio;
        int cont = 0;
        String texto = "";
        boolean ban = true;
	while (iterator.hasNext()) {
            if(ban){
                bloque = iterator.next();
            }else{
                ban = true;
            }
            if(bloque.fin-inicio>=rango){
                mp3Cuter.generateNewMp3ByTime(new File(audioMp3.getParent().toString()+"\\audio\\"+audioMp3.getName().replace(".mp3","") +"#"+(++cont)+".mp3"), inicio, bloque.fin);
                texto+=bloque.texto.replace(".","").replace(",","") +" ";
                bloque = iterator.next();
                inicio = bloque.inicio;
                ban = false;
                this.builTextPiece(texto, cont);
                texto = "";
            }else{
                texto+=bloque.texto.replace(".","").replace(",","") +" ";
            }
            
	}
    }
    
    public void builTextPiece(String texto,int cont){
        try {
            FileOutputStream fos = new FileOutputStream(new File(subtitulos.getParent().toString()+"\\texto"+"\\texto"+cont+".txt"));
            fos.write(texto.getBytes());
            fos.close();
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
    }
    
    public static void main(String[] args) {
//        String audioMp3   = "C:\\Users\\JoseCarlos\\Dropbox\\listenandwrite\\SMALLVILLE_S4_D1 #1.mp3",
//               subtitulos = "C:\\Users\\JoseCarlos\\Dropbox\\listenandwrite\\Smallville - 4x01 - en - SubRip.srt";
//        
//        ListenAndWrite law = new ListenAndWrite(audioMp3,subtitulos);
//        law.crearBloques();
//        law.crearPedazosMP3AndText(10000);
    }
}
