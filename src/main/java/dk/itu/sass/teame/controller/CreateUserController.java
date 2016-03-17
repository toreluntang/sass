package dk.itu.sass.teame.controller;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.ejb.Stateless;


@Stateless
public class CreateUserController {
	
	private String url = "jdbc:postgresql://horton.elephantsql.com:5432/hmdgzyax";
    private String dbusername = "hmdgzyax";
    private String dbpassword = "8ETS72wV53uGfPIs-RCJy_tolfPs481n";
	
    
	public String validateUsername(String username){
		System.out.println("Validate Username called=" + username);
		
		String foundUser = "";
		Connection con = null;
		PreparedStatement pre = null;
		
		try{
			Class.forName("org.postgresql.Driver");
			con = DriverManager.getConnection(url,dbusername, dbpassword);
			
			String stm = "select username from bruger where username = ?";
			pre = con.prepareStatement(stm);
			pre.setString(1, username);
			
			ResultSet rs = pre.executeQuery();			
			
			if(rs.next()){
				foundUser = rs.getString(1);
			}
			
			con.close();

		}catch(Exception sqle){
			
			sqle.printStackTrace();
		}
		
		return foundUser;
	}
	
	public int insertUser(String username, String password, String email){
		System.out.println("Insert user called="+username+", "+password+", "+email);
		int bob = -1;
		Connection con = null;
		PreparedStatement pre = null;
		
		try{
			Class.forName("org.postgresql.Driver");
			con = DriverManager.getConnection(url,dbusername, dbpassword);
			String stm = "insert into bruger(username, password, salt, email) VALUES(?, ?, ?, ?)";
			pre = con.prepareStatement(stm);
			
			pre.setString(1, username);
			pre.setString(2, password);
			pre.setString(3, "SALT");
			pre.setString(4, email);
			bob = pre.executeUpdate();
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return bob;
	}

}