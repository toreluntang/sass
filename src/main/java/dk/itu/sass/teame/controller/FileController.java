package dk.itu.sass.teame.controller;

import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Instant;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.ejb.Stateless;

@Stateless
public class FileController {
	
	private Connection connection;

	public FileController() {
		
	}
	
	@PostConstruct
	private void init() {
		try {
			Class.forName("org.postgresql.Driver");
			connection = DriverManager.getConnection("jdbc:postgresql://horton.elephantsql.com:5432/hmdgzyax", "hmdgzyax", "8ETS72wV53uGfPIs-RCJy_tolfPs481n");
		} catch (Exception e) {
			e.printStackTrace();
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
	
	public void fuckemallup(Long id, Path p) {
		
		try {
			
			Statement stmt = connection.createStatement();
			stmt.execute("insert into img (id_user, path, timestamp) values ("+id+",'"+p+"',"+Instant.now().toEpochMilli()+")");
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		
	}

}
