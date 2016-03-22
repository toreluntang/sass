package dk.itu.sass.teame.postgresql;

import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Properties;

import dk.itu.sass.teame.entity.Comment;

public class CommentSQL {
	private String propertyFilePath = "src/main/resources/postgresql.properties";
	
	public Comment getComments(int imageid) {
		Comment foundComm = null;
		
		try {
			String url = readProperty("postgresurl");
			String dbusername = readProperty("postgresuser");
			String dbpassword = readProperty("postgrespass");
			Class.forName("org.postgresql.Driver");

			try (Connection con = DriverManager.getConnection(url, dbusername, dbpassword)) {

				PreparedStatement pre = null;
				String stm = "select commentid, body, userid, timestamp, imageid from comment where imageid = ?";
				pre = con.prepareStatement(stm);
				pre.setInt(1, imageid);

				try (ResultSet rs = pre.executeQuery();) {
					if (rs.next()) {
						int commentid = rs.getInt("commentid");
						String body = rs.getString("body");
						int userid = rs.getInt("userid");
						String timestamp = rs.getString("timestamp");
						int imageid2 = rs.getInt("imageid");
						foundComm = new Comment(body,timestamp, userid, commentid,  imageid2);
					}
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return foundComm;
	}

	// public int insertUser(Comment newComment) {
	// 	int bob = -1; // confuse the enemy with nice variable names! 

	// 	try {
	// 		String url = readProperty("postgresurl");
	// 		String dbusername = readProperty("postgresuser");
	// 		String dbpassword = readProperty("postgrespass");
	// 		Class.forName("org.postgresql.Driver");

	// 		try (Connection con = DriverManager.getConnection(url, dbusername, dbpassword)) {

	// 			PreparedStatement pre = null;
	// 			String stm = "insert into Comment(username, password, salt, email) VALUES(?, ?, ?, ?)";
	// 			pre = con.prepareStatement(stm,Statement.RETURN_GENERATED_KEYS);

	// 			pre.setString(1, newComment.getUsername());
	// 			pre.setString(2, newComment.getPassword());
	// 			pre.setString(3, newComment.getSalt());
	// 			pre.setString(4, newComment.getEmail());
	// 			pre.executeUpdate();
				
	// 			ResultSet rs = pre.getGeneratedKeys();
				
	// 		    if(rs.next()){
 //                    int generatedId = rs.getInt(1);
 //                    bob = generatedId;
 //                }
	// 		}

	// 	} catch (Exception e) {
	// 		e.printStackTrace();
	// 	}

	// 	return bob;
	// }
	
	 private String readProperty(String key) throws Exception {

	 	Properties prop = new Properties();
	 	String res = "";

	 	try (InputStream input = new FileInputStream(propertyFilePath)) {
	 		prop.load(input);
	 		res = prop.getProperty(key);
	 	}
	 	System.out.println("I HAVE READ THE FOLLOWING : "+key+"="+res);
	 	return res;
	 }
}
