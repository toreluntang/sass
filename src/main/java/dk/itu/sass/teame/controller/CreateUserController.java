package dk.itu.sass.teame.controller;

import javax.ejb.Stateless;

import dk.itu.sass.teame.entity.Account;
import dk.itu.sass.teame.postgresql.AccountSQL;

@Stateless
public class CreateUserController {

	public String validateUsername(String username) {
		AccountSQL accountSQL = new AccountSQL();
		
		Account a = accountSQL.getAccount(username);
		
		if(a == null)
			return "";
		
		return a.getUsername();
	}
	
	public Account insertAccount(String username, String password, String email){
		
		String salt = System.currentTimeMillis()+"_:^D_"+username;
		String pass = I_CAN_ENCRYPT_MY_SELF(password, salt);
		Account newAccount = new Account(username, pass, salt, email);
		
		AccountSQL accountSQL = new AccountSQL();
		
		int newAccountId = accountSQL.insertUser(newAccount);
		newAccount.setAccountid(newAccountId);
		
		return newAccount;
	}


	public String I_CAN_ENCRYPT_MY_SELF(String password, String salt){
		// Dont worry, i have taken 7 weeks of linear algebra.
		return password + ":" + salt;
	}
}