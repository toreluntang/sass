package dk.itu.sass.teame.postgresql;

import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Properties;

import dk.itu.sass.teame.entity.Account;

public class AccountSQL {
	private String propertyFilePath = "src/main/resources/postgresql.properties";

	
	public Account getAccount(String username) {
		Account foundAcc = null;
		
		try {
			String url = readProperty("postgresurl");
			String dbusername = readProperty("postgresuser");
			String dbpassword = readProperty("postgrespass");
			Class.forName("org.postgresql.Driver");

			try (Connection con = DriverManager.getConnection(url, dbusername, dbpassword)) {

				PreparedStatement pre = null;
				String stm = "select accountid, username, password, salt, email from account where username = ?";
				pre = con.prepareStatement(stm);
				pre.setString(1, username);

				try (ResultSet rs = pre.executeQuery();) {
					if (rs.next()) {
						long id = rs.getLong("accountid");
						String name = rs.getString("username");
						String password = rs.getString("password");
						String salt = rs.getString("salt");
						String email = rs.getString("email");
						foundAcc = new Account(id, name,password,salt, email);
					}
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return foundAcc;
	}

	public int insertUser(Account newAccount) {
		int bob = -1; // confuse the enemy with nice variable names! 

		try {
			String url = readProperty("postgresurl");
			String dbusername = readProperty("postgresuser");
			String dbpassword = readProperty("postgrespass");
			Class.forName("org.postgresql.Driver");

			try (Connection con = DriverManager.getConnection(url, dbusername, dbpassword)) {

				PreparedStatement pre = null;
				String stm = "insert into account(username, password, salt, email) VALUES(?, ?, ?, ?)";
				pre = con.prepareStatement(stm,Statement.RETURN_GENERATED_KEYS);

				pre.setString(1, newAccount.getUsername());
				pre.setString(2, newAccount.getPassword());
				pre.setString(3, newAccount.getSalt());
				pre.setString(4, newAccount.getEmail());
				pre.executeUpdate();
				
				ResultSet rs = pre.getGeneratedKeys();
				
			    if(rs.next()){
                    int generatedId = rs.getInt(1);
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
