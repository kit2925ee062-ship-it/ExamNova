import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.awt.Desktop;
import java.io.*;
import java.net.InetSocketAddress;
import java.net.URI;
import java.nio.file.Files;

/**
 * ExamNova Standalone Java Web Server
 * Automatically selects an available port (8080, 8888, 3000, 5000, or dynamic)
 * and opens the live working website in your default browser.
 */
public class ExamNovaServer {

    private static final int[] PREFERRED_PORTS = {8080, 8888, 3000, 5000, 8000, 0};

    public static void main(String[] args) {
        HttpServer server = null;
        int activePort = -1;

        for (int port : PREFERRED_PORTS) {
            try {
                server = HttpServer.create(new InetSocketAddress(port), 0);
                activePort = server.getAddress().getPort();
                break;
            } catch (IOException ignored) {
                // Try next port if busy
            }
        }

        if (server == null) {
            System.err.println("❌ Could not bind to any network port.");
            return;
        }

        try {
            server.createContext("/", new StaticFileHandler());
            server.setExecutor(null);
            server.start();

            String url = "http://localhost:" + activePort + "/index.html";
            System.out.println("==================================================================");
            System.out.println("🎓 ExamNova - Live Examination & Quiz System is RUNNING!");
            System.out.println("🌐 Website Live URL : " + url);
            System.out.println("⚡ Ready for presentation! Server is actively responding.");
            System.out.println("ℹ️ Press Ctrl+C in this terminal window to stop the server.");
            System.out.println("==================================================================");

            // Open in browser
            try {
                if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                    Desktop.getDesktop().browse(new URI(url));
                }
            } catch (Exception e) {
                System.out.println("Please open this link in your web browser: " + url);
            }

        } catch (Exception e) {
            System.err.println("❌ Server error: " + e.getMessage());
        }
    }

    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String requestPath = exchange.getRequestURI().getPath();
            if (requestPath == null || requestPath.equals("/") || requestPath.isEmpty()) {
                requestPath = "/index.html";
            }

            // Security: Prevent directory traversal
            if (requestPath.contains("..")) {
                sendResponse(exchange, 403, "Access Denied", "text/plain");
                return;
            }

            File file = new File("." + requestPath);
            if (!file.exists() || file.isDirectory()) {
                sendResponse(exchange, 404, "404 Not Found: " + requestPath, "text/plain");
                return;
            }

            String mimeType = getMimeType(file.getName());
            byte[] fileBytes = Files.readAllBytes(file.toPath());

            exchange.getResponseHeaders().set("Content-Type", mimeType);
            exchange.getResponseHeaders().set("Cache-Control", "no-cache, no-store, must-revalidate");
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.sendResponseHeaders(200, fileBytes.length);

            try (OutputStream os = exchange.getResponseBody()) {
                os.write(fileBytes);
            }
        }

        private void sendResponse(HttpExchange exchange, int statusCode, String responseText, String contentType) throws IOException {
            byte[] responseBytes = responseText.getBytes();
            exchange.getResponseHeaders().set("Content-Type", contentType);
            exchange.sendResponseHeaders(statusCode, responseBytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(responseBytes);
            }
        }

        private String getMimeType(String filename) {
            String lower = filename.toLowerCase();
            if (lower.endsWith(".html") || lower.endsWith(".htm")) return "text/html; charset=UTF-8";
            if (lower.endsWith(".css")) return "text/css; charset=UTF-8";
            if (lower.endsWith(".js")) return "application/javascript; charset=UTF-8";
            if (lower.endsWith(".json")) return "application/json; charset=UTF-8";
            if (lower.endsWith(".png")) return "image/png";
            if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
            if (lower.endsWith(".svg")) return "image/svg+xml";
            if (lower.endsWith(".ico")) return "image/x-icon";
            return "application/octet-stream";
        }
    }
}
