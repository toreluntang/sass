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

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import dk.itu.sass.teame.entity.Account;
import dk.itu.sass.teame.entity.Comment;

public class CommentSQL {
	
	public CommentSQL(){
		
		try{
			Class.forName("org.postgresql.Driver");
		}
		catch(Exception e) {e.printStackTrace();}
	}
	
	
	public JsonArray getComments(String imageId) {
		List<Comment> comments = new ArrayList<>(); 
		Object r = null;
		JsonArray commentList = new JsonArray();
		
		String query = "SELECT commentid, body, userid, imageid, timestamp, username" +"\n"+
					   "FROM comment c, account a" +"\n"+
					   "WHERE c.userid = a.accountid" +"\n"+
					   "AND imageid = ?";
		try {

			try (Connection con = DriverManager.getConnection("jdbc:postgresql://horton.elephantsql.com:5432/hmdgzyax", "hmdgzyax", "8ETS72wV53uGfPIs-RCJy_tolfPs481n")) {

				PreparedStatement pre = null;
				String stm = query;
				pre = con.prepareStatement(stm);
				pre.setString(1, imageId);
				ResultSet rss = null;
				
				Statement s = con.createStatement();
				boolean resFound = s.execute(stm.replaceAll("\\?", imageId+""));
				
				 while(resFound){
					 rss = s.getResultSet();
					 commentList = new JsonArray();
					 
					 while(rss.next()){
						 JsonObject j = new JsonObject();
						 for(int i = 1; i <= rss.getMetaData().getColumnCount(); i++){
							 if(null != rss.getObject(i)){
								 j.addProperty(rss.getMetaData().getColumnLabel(i), rss.getObject(i).toString());
							 }					 
					 }
						 
					 commentList.add(j);
					 System.out.println(commentList);

					 }
					 resFound = s.getMoreResults();
					 r = resFound;
				 }
				 
//				 while(rss.next()){
//				 }
				 
				System.out.println(rss.next());
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
						commentList.forEach(System.out::print);
					}
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			//return r;
		}

		return commentList;
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
