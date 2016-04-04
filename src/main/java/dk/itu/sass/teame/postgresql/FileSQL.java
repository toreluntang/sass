package dk.itu.sass.teame.postgresql;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.ejb.Stateless;

import dk.itu.sass.teame.entity.File;

@Stateless
public class FileSQL {

	private Connection connection;
	
	public FileSQL() {
	}
	
	@PostConstruct
	private void init() {
		try {
			Class.forName("org.postgresql.Driver");
			connection = DriverManager.getConnection("jdbc:postgresql://horton.elephantsql.com:5432/hmdgzyax", "hmdgzyax", "8ETS72wV53uGfPIs-RCJy_tolfPs481n");
		} catch (Exception e) {
			e.printStackTrace();
			//Do logging
		}
	}
	
	
	public File insertFile(File file) {
		
		try {
			PreparedStatement stmt = connection.prepareStatement("insert into img (id_user, path, timestamp) values (?,?,?)");
//			stmt.exe("insert into img (id_user, path, timestamp) values ("+userId+",'"+path+"',"+Instant.now().toEpochMilli()+")");
			stmt.setLong(1, file.getUserId());
			stmt.setString(2, file.getPath().toString());
			stmt.setLong(3, file.getTimestamp().toEpochMilli());
			
			stmt.executeUpdate();

			ResultSet rs = stmt.getGeneratedKeys();
			
			if(rs.next()) {
				file.setId(rs.getLong("id"));
				file.setPath(Paths.get(rs.getLong("id")+""));
			}
			return file;
		} catch (SQLException e) {
			//Do logging
			e.printStackTrace();
			return null;
		}
		
	}
	
	@PreDestroy
	public void kill() {
		try {
			connection.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
}
