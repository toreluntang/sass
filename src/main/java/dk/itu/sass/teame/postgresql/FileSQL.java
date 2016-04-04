package dk.itu.sass.teame.postgresql;

import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Instant;

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
	
}
