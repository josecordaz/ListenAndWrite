/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package mx.com.jcoc.servlets;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
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
@WebServlet(name = "audio", urlPatterns = {"/audio.mp3"})
public class audio extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        ServletOutputStream stream = null;
        BufferedInputStream buf = null;
        try {
            stream = response.getOutputStream();
            String fileName = "SMV4x01#1.mp3";
            File mp3 = new File("C:\\Users\\joseo\\Documentos\\ListenAndWrite\\" + request.getParameter("practica") + "\\audio\\" + fileName);

            response.setContentType("audio/mpeg");

            response.addHeader("Content-Disposition", "attachment; filename=" + fileName);

            response.setContentLength((int) mp3.length());

            FileInputStream input = new FileInputStream(mp3);
            buf = new BufferedInputStream(input);
            int readBytes = 0;
            //read from the file; write to the ServletOutputStream
            while ((readBytes = buf.read()) != -1) {
                stream.write(readBytes);
            }
        } catch (IOException ioe) {
            throw new ServletException(ioe.getMessage());
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
