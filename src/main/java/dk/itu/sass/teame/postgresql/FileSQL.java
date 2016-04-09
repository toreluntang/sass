package dk.itu.sass.teame.postgresql;

import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.ejb.Stateless;

import dk.itu.sass.teame.entity.File;

@Stateless
public class FileSQL {

	private final String CONNECTION_URL = "jdbc:postgresql://horton.elephantsql.com:5432/hmdgzyax";
	private final String CONNECTION_USERNAME = "hmdgzyax";
	private final String CONNECTION_PASSWORD = "8ETS72wV53uGfPIs-RCJy_tolfPs481n";
	
	public FileSQL() {
	}
	
	@PostConstruct
	private void init() {
		try {
			Class.forName("org.postgresql.Driver");
		} catch (Exception e) {
			e.printStackTrace();
			//Do logging
		}
	}
	
	public File insertFile(File file) {
		
		try (
			Connection con = DriverManager.getConnection(CONNECTION_URL,CONNECTION_USERNAME,CONNECTION_PASSWORD);
			PreparedStatement stmt = con.prepareStatement("INSERT INTO img (id_user, path, timestamp) VALUES (?,?,?)", Statement.RETURN_GENERATED_KEYS);
			){
			stmt.setLong(1, file.getUserId());
			stmt.setString(2, file.getPath().toString());
			stmt.setLong(3, file.getTimestamp().toEpochMilli());
			
			stmt.executeUpdate();

			ResultSet rs = stmt.getGeneratedKeys();
			
			if(rs.next()) {
				file.setId(rs.getLong("id"));
			}
			
			//Should the following be pulled out in its own try-with ?
			PreparedStatement stmt1 = con .prepareStatement("INSERT INTO image_shared_with(imageid, userid) VALUES(?,?)");
			stmt1.setLong(1, file.getId());
			stmt1.setLong(2, file.getUserId());
			stmt1.executeUpdate();
			
			
			return file;
		} catch (SQLException e) {
			return null;
		}
		
	}

	public File selectFileById(File file) {

		try (
			Connection con = DriverManager.getConnection(CONNECTION_URL,CONNECTION_USERNAME,CONNECTION_PASSWORD);
			PreparedStatement stmt = con.prepareStatement("SELECT id_user, path, timestamp FROM img WHERE id=?");
		){
			stmt.setLong(1, file.getId());
			
			ResultSet rs = stmt.executeQuery();
			
			if(rs.next()) {
				file.setPath(Paths.get(rs.getString("path")));
				file.setTimestamp(Instant.ofEpochMilli(rs.getLong("timestamp")));
				file.setUserId(rs.getLong("id_user"));
			}
			
			return file;
		} catch(SQLException e) {
			return null;
		}
	}
	
	public List<File> selectFilesByUserId(long userId){
		List<File> images = new ArrayList<>();
		String query =  "SELECT I.id, I.id_user, I.path, I.timestamp, A.username" + "\n" +
						"FROM account A, img I, image_shared_with ISW" + "\n" +
						"WHERE ISW.imageid = I.id" + "\n" +
						"AND ISW.userid = A.accountid" + "\n" +
						"AND A.accountid = ?";
		try (
				Connection con = DriverManager.getConnection(CONNECTION_URL,CONNECTION_USERNAME,CONNECTION_PASSWORD);
				PreparedStatement stmt = con.prepareStatement(query);
			){
				stmt.setLong(1, userId);
				ResultSet rs = stmt.executeQuery();
				
				while(rs.next()) {
					File image = new File();
					
					image.setId(rs.getLong("id"));
					image.setPath(Paths.get(rs.getString("path")));
					image.setTimestamp(Instant.ofEpochMilli(rs.getLong("timestamp")));
					image.setUserId(rs.getLong("id_user")); // author
					image.setUsername(rs.getString("username"));
					
					images.add(image);
				}
				
				return images;
			} catch(SQLException e) {
				return null;
			}
	}

	public int shareImage(long imageId, long shareWithId) {
		String query = "INSERT INTO image_shared_with(imageid, userid) VALUES(?,?)";
		
		try (
				Connection con = DriverManager.getConnection(CONNECTION_URL,CONNECTION_USERNAME,CONNECTION_PASSWORD);
				PreparedStatement stmt = con.prepareStatement(query);
			){
				stmt.setLong(1, imageId);
				stmt.setLong(2, shareWithId);
				int rs = stmt.executeUpdate();
				
				return rs;
				
			} catch(SQLException e) {
				return 0;
			}
	}
	
}
