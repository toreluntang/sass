package dk.itu.sass.teame.postgresql;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.annotation.PostConstruct;
import javax.ejb.Stateless;

import dk.itu.sass.teame.entity.File;

@Stateless
public class FileSQL {

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
			Connection con = DriverManager.getConnection("jdbc:postgresql://horton.elephantsql.com:5432/hmdgzyax", "hmdgzyax", "8ETS72wV53uGfPIs-RCJy_tolfPs481n");
			PreparedStatement stmt = con.prepareStatement("insert into img (id_user, path, timestamp) values (?,?,?)", Statement.RETURN_GENERATED_KEYS);
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
	
}
