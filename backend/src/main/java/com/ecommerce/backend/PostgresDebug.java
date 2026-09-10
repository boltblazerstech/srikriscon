package com.ecommerce.backend;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class PostgresDebug {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/ecommerce?sslmode=disable";
        String username = "postgres";
        String password = "postgres";

        System.out.println("Debugging PostgreSQL connection...");
        System.out.println("URL: " + url);
        System.out.println("Username: '" + username + "'");
        System.out.println("Password: '" + password + "'");
        System.out.println();

        try {
            Class.forName("org.postgresql.Driver");
            System.out.println("✓ PostgreSQL JDBC Driver loaded");
        } catch (ClassNotFoundException e) {
            System.err.println("✗ PostgreSQL JDBC Driver not found");
            return;
        }

        Properties props = new Properties();
        props.setProperty("user", username);
        props.setProperty("password", password);
        props.setProperty("ssl", "false");

        try {
            System.out.println("Attempting connection...");
            Connection connection = DriverManager.getConnection(url, props);
            System.out.println("✓ SUCCESS: Connected to PostgreSQL!");

            // Get some basic info
            System.out.println("Database: " + connection.getMetaData().getDatabaseProductName());
            System.out.println("Version: " + connection.getMetaData().getDatabaseProductVersion());
            System.out.println("User: " + connection.getMetaData().getUserName());

            connection.close();
        } catch (SQLException e) {
            System.err.println("✗ FAILED: " + e.getMessage());
            System.err.println("SQL State: " + e.getSQLState());
            System.err.println("Error Code: " + e.getErrorCode());

            // Provide specific advice based on error
            if (e.getSQLState().equals("08004")) {
                System.err.println("\n→ Authentication failed. Check username/password.");
            } else if (e.getMessage().contains("authentication type")) {
                System.err.println("\n→ Authentication type not supported. This is usually a pg_hba.conf issue.");
                System.err.println("  The PostgreSQL server is configured to reject connections from your application.");
                System.err.println("  You need to modify PostgreSQL's pg_hba.conf file to allow md5 or scram-sha-256 authentication.");
                System.err.println("\n  To fix this:");
                System.err.println("  1. Locate your PostgreSQL data directory (often C:\\Program Files\\PostgreSQL\\15\\data)");
                System.err.println("  2. Edit pg_hba.conf file");
                System.err.println("  3. Find the line for localhost connections and change the method to 'md5' or 'trust'");
                System.err.println("  4. Restart PostgreSQL service");
            } else if (e.getMessage().contains("connection refused")) {
                System.err.println("\n→ Connection refused. Check if PostgreSQL is running on port 5432.");
            }
        }
    }
}