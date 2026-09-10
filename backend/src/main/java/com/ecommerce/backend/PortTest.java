package com.ecommerce.backend;

import java.io.IOException;
import java.net.Socket;

public class PortTest {
    public static void main(String[] args) {
        String host = "localhost";
        int port = 5432;

        System.out.println("Testing TCP connection to " + host + ":" + port);

        try (Socket socket = new Socket()) {
            socket.connect(new java.net.InetSocketAddress(host, port), 5000); // 5 second timeout
            System.out.println("SUCCESS: TCP connection established to port " + port);
            System.out.println("Local port: " + socket.getLocalPort());
            System.out.println("Remote address: " + socket.getInetAddress());
        } catch (IOException e) {
            System.err.println("ERROR: Failed to connect to " + host + ":" + port);
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}