package com.ecommerce.backend;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class CommonPasswordsTest {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/ecommerce";
        String username = "postgres";

        String[] commonPasswords = {
            "",           // empty
            "postgres",   // common default
            "root",       // another common default
            "password",   // very common
            "123456",     // common numeric
            "admin",      // admin default
            "postgres123" // postgres with numbers
        };

        System.out.println("Testing common passwords for PostgreSQL user 'postgres'...");
        System.out.println("URL: " + url);
        System.out.println();

        try {
            Class.forName("org.postgresql.Driver");
            System.out.println("PostgreSQL JDBC Driver loaded successfully");
            System.out.println();
        } catch (ClassNotFoundException e) {
            System.err.println("ERROR: PostgreSQL JDBC Driver not found");
            return;
        }

        for (String password : commonPasswords) {
            Properties props = new Properties();
            props.setProperty("user", username);
            props.setProperty("password", password);
            props.setProperty("ssl", "false");

            try {
                Connection connection = DriverManager.getConnection(url, props);
                System.out.println("SUCCESS: Password '" + (password.isEmpty() ? "[EMPTY]" : password) + "' works!");
                connection.close();
                return; // Found working password
            } catch (SQLException e) {
                System.out.println("FAILED: Password '" + (password.isEmpty() ? "[EMPTY]" : password) + "' - " +
                    (e.getSQLState().equals("28P01") ? "Invalid credentials" : e.getMessage()));
            }
        }

        System.out.println();
        System.out.println("None of the common passwords worked. You may need to:");
        System.out.println("1. Check your PostgreSQL installation for the actual password");
        System.out.println("2. Reset the postgres user password");
        System.out.println("3. Configure PostgreSQL to trust local connections (less secure)");
    }
}