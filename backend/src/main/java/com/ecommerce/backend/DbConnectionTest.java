package com.ecommerce.backend;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DbConnectionTest {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/ecommerce";
        String username = "postgres";
        String password = ""; // empty password as per config

        System.out.println("Testing database connection...");
        System.out.println("URL: " + url);
        System.out.println("Username: " + username);
        System.out.println("Password: " + (password.isEmpty() ? "[EMPTY]" : "[SET]"));

        try {
            Class.forName("org.postgresql.Driver");
            System.out.println("PostgreSQL JDBC Driver loaded successfully");

            Connection connection = DriverManager.getConnection(url, username, password);
            System.out.println("SUCCESS: Connected to PostgreSQL database!");
            System.out.println("Database product: " + connection.getMetaData().getDatabaseProductName());
            System.out.println("Database version: " + connection.getMetaData().getDatabaseProductVersion());
            connection.close();
        } catch (ClassNotFoundException e) {
            System.err.println("ERROR: PostgreSQL JDBC Driver not found");
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("ERROR: Failed to connect to database");
            System.err.println("SQL State: " + e.getSQLState());
            System.err.println("Error Code: " + e.getErrorCode());
            System.err.println("Message: " + e.getMessage());
            e.printStackTrace();
        }
    }
}