package dk.itu.sass.teame.postgresql;

import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import dk.itu.sass.teame.entity.Account;
import dk.itu.sass.teame.entity.Comment;

public class CommentSQL {
	private String propertyFilePath = "src/main/resources/postgresql.properties";
	private String url;
	private String dbusername;
	private String dbpassword;
	
	public CommentSQL(){
		
		try{
			url = readProperty("postgresurl");
			dbusername = readProperty("postgresuser");
			dbpassword = readProperty("postgrespass");
			Class.forName("org.postgresql.Driver");
		}
		catch(Exception e) {e.printStackTrace();}
	}
	
	
	public List<Comment> getComments(long imageId) {
		List<Comment> comments = new ArrayList<>(); 
		
		try {

			try (Connection con = DriverManager.getConnection(url, dbusername, dbpassword)) {

				PreparedStatement pre = null;
				String stm = "select commentid, body, userid, timestamp, imageid from comment where imageid = ?";
				pre = con.prepareStatement(stm);
				pre.setLong(1, imageId);

				try (ResultSet rs = pre.executeQuery();) {
					
					while( rs.next() ){
						
						int commentid = rs.getInt("commentid");
						String body = rs.getString("body");
						int userid = rs.getInt("userid");
						String timestamp = rs.getString("timestamp");
						int imageid2 = rs.getInt("imageid");
						Comment c = new Comment(body,timestamp, userid, commentid,  imageid2);
						comments.add(c);
					}
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return comments;
	}

	public long insertComment(Comment newComment) {
		long bob = -1; // confuse the enemy with nice variable names! 

		try {
			String url = readProperty("postgresurl");
			String dbusername = readProperty("postgresuser");
			String dbpassword = readProperty("postgrespass");
			Class.forName("org.postgresql.Driver");

			try (Connection con = DriverManager.getConnection(url, dbusername, dbpassword)) {
				PreparedStatement pre = null;
				String stm = "insert into comment(body, userid, timestamp, imageid) VALUES(?, ?, ?, ?)";
				pre = con.prepareStatement(stm,Statement.RETURN_GENERATED_KEYS);

				pre.setString(1, newComment.getBody());
				pre.setLong(2, newComment.getUserId());
				pre.setString(3, newComment.getTimestamp());
				pre.setLong(4, newComment.getImageId());
				pre.executeUpdate();
				
				ResultSet rs = pre.getGeneratedKeys();
				
			    if(rs.next()){
                    long generatedId = rs.getInt(1);
                    bob = generatedId;
                }
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return bob;
	}
	
	
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
