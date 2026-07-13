import java.sql.*;

public class DatabaseService {
    public void saveCandidate(String name, String skills) {
        String url = "jdbc:oracle:thin:@localhost:1521:xe"; // Adjust to your DB
        try (Connection conn = DriverManager.getConnection(url, "system", "your_password")) {
            String sql = "INSERT INTO candidate_profiles (full_name, resume_text) VALUES (?, ?)";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, name);
            pstmt.setString(2, skills);
            pstmt.executeUpdate();
            System.out.println("Data saved to Oracle!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
