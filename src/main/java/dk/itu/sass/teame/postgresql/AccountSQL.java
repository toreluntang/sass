package dk.itu.sass.teame.postgresql;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.annotation.PostConstruct;
import javax.ejb.Stateless;

import dk.itu.sass.teame.entity.Account;

@Stateless
public class AccountSQL {

	//Empty constructor for injecting
	public AccountSQL(){
	}
	
	private final String CONNECTION_URL = "jdbc:postgresql://horton.elephantsql.com:5432/hmdgzyax";
	private final String CONNECTION_USERNAME = "hmdgzyax";
	private final String CONNECTION_PASSWORD = "8ETS72wV53uGfPIs-RCJy_tolfPs481n";
	
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
				String stm = "select accountid, username, password, email from account where "+field+" = ?";
				pre = con.prepareStatement(stm);
				pre.setString(1, value);

				try (ResultSet rs = pre.executeQuery();) {
					if (rs.next()) {
						int id = rs.getInt("accountid");
						String name = rs.getString("username");
						String password = rs.getString("password");
						String salt = "";//rs.getString("salt");
						String email = rs.getString("email");
						foundAcc = new Account(id, name,password,salt, email);
					}
				}
			}
		}catch(Exception e) { e.printStackTrace(); }
		
		return foundAcc;
	}
	
	public Account getAccountByString(String field, long value) {
		Account foundAcc = null;
		
		try{
			try (Connection con = DriverManager.getConnection("jdbc:postgresql://horton.elephantsql.com:5432/hmdgzyax", "hmdgzyax", "8ETS72wV53uGfPIs-RCJy_tolfPs481n")) {

				PreparedStatement pre = null;
				String stm = "select accountid, username, password, email, keyid from account where "+field+" = ?";
				pre = con.prepareStatement(stm);
				pre.setLong(1, value);

				try (ResultSet rs = pre.executeQuery();) {
					if (rs.next()) {
						int id = rs.getInt("accountid");
						String name = rs.getString("username");
						String password = rs.getString("password");
						String keyid = rs.getString("keyid");
						System.out.println("ALL tha way down: " + keyid);
						String email = rs.getString("email");
						foundAcc = new Account(id, name,password, email,keyid);
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
				String stm = "insert into account(username, password, email, keyid) VALUES(?, ?, ?, ?)";
				pre = con.prepareStatement(stm,Statement.RETURN_GENERATED_KEYS);

				pre.setString(1, newAccount.getUsername());
				pre.setString(2, newAccount.getPassword());
				pre.setString(3, newAccount.getEmail());
				pre.setString(4, newAccount.getKeyId());
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

	public Account checkLogin(Account acc) {

		try (
			Connection con = DriverManager.getConnection("jdbc:postgresql://horton.elephantsql.com:5432/hmdgzyax", "hmdgzyax", "8ETS72wV53uGfPIs-RCJy_tolfPs481n");
			PreparedStatement stmt = con.prepareStatement("SELECT accountid, username, password, email FROM account WHERE username=?");
		) {
			
			stmt.setString(1, acc.getUsername());
			
			ResultSet rs = stmt.executeQuery();
			if(rs.next()) {
				acc.setAccountid(rs.getLong("accountid"));
				acc.setPassword(rs.getString("password"));
				acc.setEmail(rs.getString("email"));
				return acc;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public List<Account> getAllAccounts(){
		
		List<Account> accounts = new ArrayList<>();
		String query = "select * from account";
		
		try (
				Connection con = DriverManager.getConnection(CONNECTION_URL,CONNECTION_USERNAME,CONNECTION_PASSWORD);
				PreparedStatement stmt = con.prepareStatement(query);
			){
				
				ResultSet rs = stmt.executeQuery();
				
				while(rs.next()) {
					Account account = new Account();
					
					account.setAccountid(rs.getLong("accountid"));
					account.setUsername(rs.getString("username"));
					
					accounts.add(account);
				}
				
				return accounts;
			} catch(SQLException e) {
				return null;
			}
	}

	public boolean updateKey(Account acc) {
		
		try (
				Connection con = DriverManager.getConnection("jdbc:postgresql://horton.elephantsql.com:5432/hmdgzyax", "hmdgzyax", "8ETS72wV53uGfPIs-RCJy_tolfPs481n");
				PreparedStatement stmt = con.prepareStatement("UPDATE account SET keyid=? WHERE username=?");
			) {

				stmt.setString(1, acc.getKeyId());
				stmt.setString(2, acc.getUsername());
				
				if(stmt.executeUpdate() == 1)
					return true;
				
			} catch (Exception e) {
				e.printStackTrace();
			}
			return false;
	}
	
	
	
}
