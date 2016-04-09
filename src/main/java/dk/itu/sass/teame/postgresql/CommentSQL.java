package dk.itu.sass.teame.postgresql;

import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import dk.itu.sass.teame.entity.Account;
import dk.itu.sass.teame.entity.Comment;

public class CommentSQL {
	
	public CommentSQL(){
		
		try{
			Class.forName("org.postgresql.Driver");
		}
		catch(Exception e) {e.printStackTrace();}
	}
	
	
	public List<Comment> getComments(long imageId) {
		List<Comment> comments = new ArrayList<>(); 
		
		String query = "SELECT commentid, body, userid, imageid, timestamp, username" +"\n"+
					   "FROM comment c, account a" +"\n"+
					   "WHERE c.userid = a.accountid" +"\n"+
					   "AND imageid = ?";
		try {

			try (Connection con = DriverManager.getConnection("jdbc:postgresql://horton.elephantsql.com:5432/hmdgzyax", "hmdgzyax", "8ETS72wV53uGfPIs-RCJy_tolfPs481n")) {

				PreparedStatement pre = null;
				String stm = query;
				pre = con.prepareStatement(stm);
				pre.setLong(1, imageId);

				try (ResultSet rs = pre.executeQuery();) {
					
					while( rs.next() ){
						
						long commentid = rs.getLong("commentid");
						String body = rs.getString("body");
						long userid = rs.getLong("userid");
						long timestamp = rs.getLong("timestamp");
						long imageid2 = rs.getLong("imageid");
						String username = rs.getString("username");
						Comment c = new Comment(body,Instant.ofEpochMilli(timestamp), userid, commentid,  imageid2);
						c.setUsername(username);
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
			try (Connection con = DriverManager.getConnection("jdbc:postgresql://horton.elephantsql.com:5432/hmdgzyax", "hmdgzyax", "8ETS72wV53uGfPIs-RCJy_tolfPs481n")) {
				PreparedStatement pre = null;
				String stm = "insert into comment(body, userid, timestamp, imageid) VALUES(?, ?, ?, ?)";
				pre = con.prepareStatement(stm,Statement.RETURN_GENERATED_KEYS);
				pre.setString(1, newComment.getBody());
				pre.setLong(2, newComment.getUserId());
				pre.setLong(3, newComment.getTimestamp().toEpochMilli());
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
}
