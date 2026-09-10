package com.ecommerce.backend;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class PostgresAuthTest {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/ecommerce";
        String username = "postgres";
        String password = ""; // empty password

        System.out.println("Testing PostgreSQL authentication...");
        System.out.println("URL: " + url);
        System.out.println("Username: '" + username + "'");
        System.out.println("Password: '" + password + "' (length: " + password.length() + ")");

        Properties props = new Properties();
        props.setProperty("user", username);
        props.setProperty("password", password);
        props.setProperty("ssl", "false"); // Disable SSL for local testing

        try {
            Class.forName("org.postgresql.Driver");
            System.out.println("\nPostgreSQL JDBC Driver loaded successfully");

            System.out.println("\nAttempting connection...");
            Connection connection = DriverManager.getConnection(url, props);

            System.out.println("SUCCESS: Authenticated to PostgreSQL database!");
            System.out.println("Connection: " + connection);
            System.out.println("Auto-commit: " + connection.getAutoCommit());

            // Test a simple query
            var statement = connection.createStatement();
            var resultSet = statement.executeQuery("SELECT version()");
            if (resultSet.next()) {
                System.out.println("PostgreSQL version: " + resultSet.getString(1));
            }
            resultSet.close();
            statement.close();
            connection.close();

        } catch (ClassNotFoundException e) {
            System.err.println("ERROR: PostgreSQL JDBC Driver not found in classpath");
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("ERROR: Failed to authenticate to PostgreSQL");
            System.err.println("SQL State: " + e.getSQLState());
            System.err.println("Error Code: " + e.getErrorCode());
            System.err.println("Message: " + e.getMessage());

            // Provide helpful hints based on error
            if (e.getSQLState().equals("08001")) {
                System.err.println("\nHint: Connection refused - check if PostgreSQL is running on localhost:5432");
            } else if (e.getSQLState().equals("28P01")) {
                System.err.println("\nHint: Invalid authentication - check username/password");
                System.err.println("      Default postgres user might have a password set");
            } else if (e.getSQLState().equals("3D000")) {
                System.err.println("\nHint: Database 'ecommerce' does not exist");
                System.err.println("      You may need to create it: CREATE DATABASE ecommerce;");
            }
            e.printStackTrace();
        }
    }
}