/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package mx.com.jcoc.servlets;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mx.com.jcoc.util.ListenAndWrite;
import org.apache.tomcat.util.http.fileupload.FileItem;
import org.apache.tomcat.util.http.fileupload.disk.DiskFileItemFactory;
import org.apache.tomcat.util.http.fileupload.servlet.ServletFileUpload;

/**
 *
 * @author JoseCarlos
 */
@WebServlet(name = "FileUploader", urlPatterns = {"/FileUploader.x"})
public class FileUploader extends HttpServlet {
    private final String UPLOAD_DIRECTORY = "C:\\Users\\JoseCarlos\\Documents\\EnglishProyecto\\resources";
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        File audioMp3 = null ,subtitulos = null, tmp = null;
        ListenAndWrite law;
    try {
        try {
            List<FileItem> multiparts = new ServletFileUpload(
                    new DiskFileItemFactory()).parseRequest(request);
            
            for(FileItem item : multiparts){
                if(!item.isFormField()){
                    String name = new File(item.getName()).getName();
                    (tmp = new File(UPLOAD_DIRECTORY+File.separator+name.replace(".mp3","").replace(".srt",""))).mkdir();
                    if(name.substring(name.length()-3,name.length()).equals("mp3")){
                        audioMp3 = new File(UPLOAD_DIRECTORY + File.separator + name.replace(".mp3","") + File.separator + name);
                        item.write(audioMp3);
                    }else{
                        subtitulos = new File(UPLOAD_DIRECTORY + File.separator + name.replace(".srt","")+ File.separator + name);
                        item.write(subtitulos);
                    }
                }
            }
            
            law = new ListenAndWrite(audioMp3,subtitulos);
            law.crearBloques();
            law.crearPedazosMP3AndText(10000);
            
            audioMp3.delete();
            subtitulos.delete();

           request.setAttribute("message", "File Uploaded Successfully");

        } catch (Exception ex) {

           request.setAttribute("message", "File Upload Failed due to " + ex);

        }    
    } finally {            
        out.close();
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP
     * <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP
     * <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}
