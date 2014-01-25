/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package mx.com.jcoc.servlets;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 *
 * @author JoseCarlos
 */
@WebServlet(name = "ConsultaPracticas", urlPatterns = {"/ConsultaPracticas.x"})
public class ConsultaPracticas extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        JSONObject jsonObj;
        JSONArray list;
        int cont = 0;
        try {
            //File practicas = new File("C:\\Users\\JoseCarlos\\Documents\\EnglishProyecto\\resources");
            File practicas = new File("C:\\Users\\joseo\\Documentos\\ListenAndWrite");
            list = new JSONArray();
            for(File carpeta:practicas.listFiles()){
                jsonObj = new JSONObject();
                jsonObj.put("id",++cont);
                jsonObj.put("name",carpeta.getName());
                list.add(jsonObj);
            }
            out.println("{\"data\":"+list.toString()+"}");
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
