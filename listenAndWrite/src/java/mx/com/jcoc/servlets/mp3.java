/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package mx.com.jcoc.servlets;

import java.io.*;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author JoseCarlos
 */
@WebServlet(name = "mp3", urlPatterns = {"/mp3.ogg"})
public class mp3 extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        ServletOutputStream stream = null;
        BufferedInputStream buf = null;
        String practica;
        final String id;
        String[] myFiles;
        File mp3;
        try {
            stream = response.getOutputStream();
            
//            practica = request.getParameter("practica");
//            id = request.getParameter("id");
//            
//            mp3 = new File("C:\\Users\\JoseCarlos\\Documents\\EnglishProyecto\\resources\\" + practica + "\\audio\\");
//            
//            myFiles = mp3.list(new FilenameFilter() {
//                public boolean accept(File directory, String fileName) {
//                    return fileName.matches(".*#"+id+".mp3");
//                }
//            });
            
            mp3 = new File("C:\\Users\\JoseCarlos\\Documents\\EnglishProyecto\\resources\\1 - 1 - Introduction to the Android Platform (18-19)\\audio\\simple.ogg");

            response.setContentType("audio/mpeg");

            response.addHeader("Content-Disposition", "attachment; filename=" + mp3.getName());

            response.setContentLength((int) mp3.length());

            FileInputStream input = new FileInputStream(mp3);
            buf = new BufferedInputStream(input);
            int readBytes = 0;
            //read from the file; write to the ServletOutputStream
            while ((readBytes = buf.read()) != -1) {
                stream.write(readBytes);
            }
        } catch (IOException ioe) {
            FileOutputStream f = new FileOutputStream("c:\\errror.txt");
            f.write(ioe.getMessage().getBytes());
            f.close();
        } finally {
            if (stream != null) {
                stream.close();
            }
            if (buf != null) {
                buf.close();
            }
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
