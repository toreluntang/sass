package dk.itu.sass.teame.postgresql;

import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Properties;

import javax.annotation.PostConstruct;
import javax.ejb.Stateless;

import dk.itu.sass.teame.entity.Account;

@Stateless
public class AccountSQL {

	
	public AccountSQL(){
	}
	
	@PostConstruct
	public void init() {
		try{
			Class.forName("org.postgresql.Driver");
		}
		catch(Exception e) {e.printStackTrace();}	
	}
	
	public Account getAccountByString(String field ,String value) {
		Account foundAcc = null;
		
		try{
			try (Connection con = DriverManager.getConnection("jdbc:postgresql://horton.elephantsql.com:5432/hmdgzyax", "hmdgzyax", "8ETS72wV53uGfPIs-RCJy_tolfPs481n")) {

				PreparedStatement pre = null;
				String stm = "select accountid, username, password, salt, email from account where "+field+" = ?";
				pre = con.prepareStatement(stm);
				pre.setString(1, value);

				try (ResultSet rs = pre.executeQuery();) {
					if (rs.next()) {
						int id = rs.getInt("accountid");
						String name = rs.getString("username");
						String password = rs.getString("password");
						String salt = rs.getString("salt");
						String email = rs.getString("email");
						foundAcc = new Account(id, name,password,salt, email);
					}
				}
			}
		}catch(Exception e) { e.printStackTrace(); }
		
		return foundAcc;
	}

	public long insertUser(Account newAccount) {
		long bob = -1; // confuse the enemy with nice variable names! 

		try {

			try (Connection con = DriverManager.getConnection("jdbc:postgresql://horton.elephantsql.com:5432/hmdgzyax", "hmdgzyax", "8ETS72wV53uGfPIs-RCJy_tolfPs481n")) {

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
