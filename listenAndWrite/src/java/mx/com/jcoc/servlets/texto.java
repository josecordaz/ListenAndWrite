/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package mx.com.jcoc.servlets;

import java.io.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * @author JoseCarlos
 */
@WebServlet(name = "texto", urlPatterns = {"/texto.x"})
public class texto extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        String practica;
        final String id;
        File texto;
        String strTexto = "", myFiles[];
        FileInputStream fis = null;
        JSONArray jsonArray;
        JSONObject jsonObject;
        try {
            practica = request.getParameter("practica");
            id = request.getParameter("id");
            
            texto = new File("C:\\Users\\JoseCarlos\\Documents\\EnglishProyecto\\resources\\" + practica + "\\texto\\texto"+id+".txt");
            
            fis = new FileInputStream(texto);

            int content;
            while ((content = fis.read()) != -1) {
                strTexto += (char) content;
            }
            
            jsonArray = new JSONArray();
            jsonObject = new JSONObject();
            
            jsonObject.put("texto",strTexto);
            jsonArray.add(jsonObject);
            
            out.write(jsonObject.toString());

        } finally {
            if(fis!=null){fis.close();}
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
