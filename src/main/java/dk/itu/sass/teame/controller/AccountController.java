package dk.itu.sass.teame.controller;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import javax.ejb.Stateless;

import dk.itu.sass.teame.entity.Account;
import dk.itu.sass.teame.postgresql.AccountSQL;

@Stateless
public class AccountController {
	
	public Account getAccount(String username){
		AccountSQL accountSQL = new AccountSQL();
		Account a = accountSQL.getAccountByString("username",username);
		return a;
	}

	public boolean validateUsername(String username) {
		
		return getAccount(username) == null;
	}
	
	public Account insertAccount(String username, String password, String email){
		
		try {

			String hashedPassword;
			hashedPassword = PasswordHash.createHash(password);
			Account newAccount = new Account(username, hashedPassword, "", email);
			AccountSQL accountSQL = new AccountSQL();
			
			long newAccountId = accountSQL.insertUser(newAccount);
			newAccount.setAccountid(newAccountId);
			
			return newAccount;
			
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (InvalidKeySpecException e) {
			e.printStackTrace();
		}
		
		return null;
	}

}